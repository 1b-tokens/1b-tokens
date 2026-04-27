import "server-only";

import sgMail from "@sendgrid/mail";
import { getSiteOrigin, siteTitle } from "@/lib/site";
import { sendGridFrom } from "@/lib/sendgrid-from";

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
  /** What the inviter wrote about the invitee (stored on the invite). */
  pitch: string;
  token: string;
}) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error("Missing SENDGRID_API_KEY or SENDGRID_FROM_EMAIL");
  }

  sgMail.setApiKey(apiKey);

  const joinUrl = `${getAppOrigin()}/join/${params.token}`;
  const siteUrl = getSiteOrigin();
  const inviter = escapeHtml(params.inviterDisplayName);
  const clubName = escapeHtml(siteTitle);

  await sgMail.send({
    to: params.to,
    from: sendGridFrom(from),
    subject: `You're invited to the ${siteTitle}`,
    html: `
      <p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:#18181b;">Hi ${escapeHtml(params.inviteeName)},</p>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.5;color:#18181b;"><strong>${inviter}</strong> invited you to join the ${clubName}. It&apos;s an invite-only network for AI builders.</p>
      <p style="margin:0 0 8px;font-size:15px;line-height:1.5;color:#52525b;">This is what they wrote about you:</p>
      <div style="background-color:#f4f4f5;border:1px solid #e4e4e7;border-radius:8px;padding:16px 18px;margin:0 0 20px;font-size:15px;line-height:1.6;color:#3f3f46;white-space:pre-wrap;">${escapeHtml(params.pitch)}</div>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.5;"><a href="${joinUrl}" style="color:#2563eb;">Accept your invite</a></p>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.5;color:#52525b;">This link is personal to you, please don&apos;t forward to anyone. If you don&apos;t want to join the club, you can ignore this invite.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#18181b;">Cheers,<br />The ${clubName}<br /><a href="${siteUrl}" style="color:#2563eb;">${escapeHtml(siteUrl)}</a></p>
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
