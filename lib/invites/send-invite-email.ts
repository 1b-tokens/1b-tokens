import "server-only";

import sgMail from "@sendgrid/mail";

function getAppOrigin() {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

export async function sendInviteEmail(params: {
  to: string;
  inviteeName: string;
  inviterDisplayName: string;
  token: string;
}) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error("Missing SENDGRID_API_KEY or SENDGRID_FROM_EMAIL");
  }

  sgMail.setApiKey(apiKey);

  const joinUrl = `${getAppOrigin()}/join/${params.token}`;

  await sgMail.send({
    to: params.to,
    from,
    subject: "You're invited to the 1B Tokens Club",
    html: `
      <p>Hi ${escapeHtml(params.inviteeName)},</p>
      <p><strong>${escapeHtml(params.inviterDisplayName)}</strong> invited you to apply for the <strong>1B Tokens Club</strong> — a private builder network.</p>
      <p><a href="${joinUrl}">Open your invite and application</a></p>
      <p>This link is personal to you. If you were not expecting this message, you can ignore it.</p>
    `,
    trackingSettings: { clickTracking: { enable: false } },
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
