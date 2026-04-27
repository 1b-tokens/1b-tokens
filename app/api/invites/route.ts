import { auth, currentUser } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

import { MAX_PENDING_INVITES_PER_USER } from "@/lib/invites/constants";
import { parseCreateInviteBody } from "@/lib/invites/parse-create-invite-body";
import { sendInviteEmail } from "@/lib/invites/send-invite-email";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
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
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  if ((count ?? 0) >= MAX_PENDING_INVITES_PER_USER) {
    return NextResponse.json(
      {
        error: `You can have at most ${MAX_PENDING_INVITES_PER_USER} open invites at a time. Wait for an application to be submitted or contact support to raise your limit.`,
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

  const user = await currentUser();
  const inviterDisplayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
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

  return NextResponse.json({ ok: true, id: inserted.id, token }, { status: 201 });
}
