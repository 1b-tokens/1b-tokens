import { auth, currentUser } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

import {
  isUnrestrictedInviteAdmin,
  maxPendingInvitesForClerkUser,
} from "@/lib/invites/constants";
import { hasSubmittedClubApplication } from "@/lib/invites/has-submitted-club-application";
import { parseCreateInviteBody } from "@/lib/invites/parse-create-invite-body";
import { sendInviteEmail } from "@/lib/invites/send-invite-email";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("invites")
      .select(
        "id, invitee_email, invitee_full_name, pitch, status, created_at",
      )
      .eq("inviter_clerk_user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ invites: data ?? [] });
  } catch (e) {
    console.error("[api/invites GET]", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sender = await currentUser();
    if (!sender) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let canInvite: boolean;
    if (isUnrestrictedInviteAdmin(userId)) {
      canInvite = true;
    } else {
      try {
        canInvite = await hasSubmittedClubApplication(userId);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Lookup failed";
        return NextResponse.json({ error: message }, { status: 500 });
      }
    }

    if (!canInvite) {
      return NextResponse.json(
        {
          error:
            "You can send invites only after you submit the club application using the invite link you received.",
        },
        { status: 403 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = parseCreateInviteBody(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { fullName, pitch, normalizedEmail: normalized } = parsed.value;
    const supabase = createAdminClient();

    const { count, error: countError } = await supabase
      .from("invites")
      .select("*", { count: "exact", head: true })
      .eq("inviter_clerk_user_id", userId)
      .eq("status", "pending");

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    const maxPending = maxPendingInvitesForClerkUser(userId);
    if ((count ?? 0) >= maxPending) {
      return NextResponse.json(
        {
          error: `You can have at most ${maxPending} open invites at a time. Wait for an application to be submitted or contact support to raise your limit.`,
        },
        { status: 409 },
      );
    }

    const token = nanoid(32);
    const { data: inserted, error: insertError } = await supabase
      .from("invites")
      .insert({
        inviter_clerk_user_id: userId,
        invitee_email: normalized,
        invitee_full_name: fullName,
        pitch,
        token,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      return NextResponse.json(
        { error: insertError?.message ?? "Could not create invite." },
        { status: 500 },
      );
    }

    const inviterDisplayName =
      [sender.firstName, sender.lastName].filter(Boolean).join(" ").trim() ||
      sender.username ||
      sender.primaryEmailAddress?.emailAddress ||
      "A member";

    try {
      await sendInviteEmail({
        to: normalized,
        inviteeName: fullName,
        inviterDisplayName,
        pitch,
        token,
      });
    } catch (err) {
      await supabase.from("invites").delete().eq("id", inserted.id);
      const message = err instanceof Error ? err.message : "Email failed";
      return NextResponse.json({ error: message }, { status: 502 });
    }

    return NextResponse.json(
      { ok: true, id: inserted.id, token },
      { status: 201 },
    );
  } catch (e) {
    console.error("[api/invites POST]", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
