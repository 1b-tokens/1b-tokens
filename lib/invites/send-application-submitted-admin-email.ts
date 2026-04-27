import "server-only";

import sgMail from "@sendgrid/mail";
import { MERCH_GENDER_LABELS, type MerchGender } from "@/lib/invites/constants";
import { sendGridFrom } from "@/lib/sendgrid-from";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getAppOrigin() {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

export type ApplicationSubmittedAdminEmailParams = {
  inviteId: string;
  inviteToken: string;
  inviteeFullName: string;
  inviteeEmail: string;
  inviterClerkUserId: string;
  applicantClerkUserId: string;
  applicantEmail: string;
  tshirtSize: string;
  merchGender: MerchGender;
  linkedinUrl: string;
  projectsDescription: string;
};

/**
 * Notifies ADMIN_EMAIL when an invitee completes their application.
 * No-ops if ADMIN_EMAIL is unset. Uses the same SendGrid credentials as invite emails.
 */
export async function sendApplicationSubmittedAdminEmail(
  params: ApplicationSubmittedAdminEmailParams,
) {
  const adminTo = process.env.ADMIN_EMAIL?.trim();
  if (!adminTo) {
    return;
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM_EMAIL;

  if (!apiKey || !from) {
    return;
  }

  sgMail.setApiKey(apiKey);

  const joinUrl = `${getAppOrigin()}/join/${params.inviteToken}`;
  const projectsPreview =
    params.projectsDescription.length > 400
      ? `${params.projectsDescription.slice(0, 400)}…`
      : params.projectsDescription;

  await sgMail.send({
    to: adminTo,
    from: sendGridFrom(from),
    subject: `New application: ${params.inviteeFullName}`,
    html: `
      <p>A member completed their <strong>1B Tokens Club</strong> application.</p>
      <ul>
        <li><strong>Invitee (invited as):</strong> ${escapeHtml(params.inviteeFullName)} — ${escapeHtml(params.inviteeEmail)}</li>
        <li><strong>Applicant Clerk user:</strong> ${escapeHtml(params.applicantClerkUserId)}</li>
        <li><strong>Applicant email (signed in):</strong> ${escapeHtml(params.applicantEmail)}</li>
        <li><strong>Inviter Clerk user:</strong> ${escapeHtml(params.inviterClerkUserId)}</li>
        <li><strong>Invite id:</strong> ${escapeHtml(params.inviteId)}</li>
        <li><strong>T-shirt:</strong> ${escapeHtml(params.tshirtSize)}</li>
        <li><strong>Merch gender:</strong> ${escapeHtml(MERCH_GENDER_LABELS[params.merchGender])}</li>
        <li><strong>LinkedIn:</strong> ${escapeHtml(params.linkedinUrl)}</li>
      </ul>
      <p><strong>Projects (preview)</strong></p>
      <p>${escapeHtml(projectsPreview).replaceAll("\n", "<br />")}</p>
      <p><a href="${joinUrl}">Open invite link</a> (submitted — thank-you state)</p>
    `,
    trackingSettings: { clickTracking: { enable: false } },
  });
}
