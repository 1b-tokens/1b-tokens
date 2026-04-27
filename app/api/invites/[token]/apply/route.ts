import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getInviterNameAndEmail } from "@/lib/invites/get-inviter-name-and-email";
import { normalizeEmail } from "@/lib/invites/normalize-email";
import { parseApplicationBody } from "@/lib/invites/parse-application-body";
import { sendApplicationSubmittedAdminEmail } from "@/lib/invites/send-application-submitted-admin-email";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await context.params;
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const primary = user.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId,
  );
  const applicantEmail = normalizeEmail(
    primary?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? "",
  );

  if (!applicantEmail) {
    return NextResponse.json(
      { error: "Your account needs a verified email address." },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseApplicationBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const {
    shipping_address_line1,
    shipping_address_line2,
    shipping_city,
    shipping_postal_code,
    shipping_country,
    phone_country_code,
    phone_number,
    projects_description,
    linkedin_url,
    tshirt_size,
    merch_gender,
  } = parsed.value;

  const supabase = createAdminClient();

  const { data: invite, error: inviteError } = await supabase
    .from("invites")
    .select(
      "id, invitee_email, invitee_full_name, inviter_clerk_user_id, status, token, pitch",
    )
    .eq("token", token)
    .maybeSingle();

  if (inviteError || !invite) {
    return NextResponse.json({ error: "Invite not found." }, { status: 404 });
  }

  if (invite.status !== "pending") {
    return NextResponse.json(
      { error: "This invite is no longer accepting applications." },
      { status: 409 },
    );
  }

  if (normalizeEmail(invite.invitee_email) !== applicantEmail) {
    return NextResponse.json(
      {
        error:
          "Sign in with the same email address this invite was sent to, then try again.",
      },
      { status: 403 },
    );
  }

  const { error: appError } = await supabase.from("invite_applications").insert({
    invite_id: invite.id,
    applicant_clerk_user_id: userId,
    shipping_address_line1,
    shipping_address_line2: shipping_address_line2 ?? null,
    shipping_city,
    shipping_postal_code,
    shipping_country,
    phone_country_code,
    phone_number,
    projects_description,
    linkedin_url,
    tshirt_size,
    merch_gender,
  });

  if (appError) {
    if (appError.code === "23505") {
      return NextResponse.json(
        { error: "An application for this invite was already submitted." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: appError.message }, { status: 500 });
  }

  const { error: updateError } = await supabase
    .from("invites")
    .update({ status: "submitted", updated_at: new Date().toISOString() })
    .eq("id", invite.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  try {
    const { name: inviterName, email: inviterEmail } =
      await getInviterNameAndEmail(invite.inviter_clerk_user_id);
    await sendApplicationSubmittedAdminEmail({
      inviterName,
      inviterEmail,
      inviterAboutJoiner: invite.pitch,
      inviteeFullName: invite.invitee_full_name,
      inviteeEmail: invite.invitee_email,
      phoneCountryCode: phone_country_code,
      phoneNumber: phone_number,
      linkedinUrl: linkedin_url,
      shipping: {
        line1: shipping_address_line1,
        line2: shipping_address_line2,
        city: shipping_city,
        postal: shipping_postal_code,
        country: shipping_country,
      },
      tshirtSize: tshirt_size,
      merchGender: merch_gender,
      projectsDescription: projects_description,
    });
  } catch {
    /* notification must not fail the applicant response */
  }

  return NextResponse.json({ ok: true });
}
