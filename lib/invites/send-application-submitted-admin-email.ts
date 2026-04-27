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

function emailAsHtmlLinkOrText(email: string) {
  const safe = email.trim();
  if (!safe.includes("@")) {
    return escapeHtml(safe);
  }
  return `<a href="mailto:${escapeHtml(safe)}">${escapeHtml(safe)}</a>`;
}

export type ApplicationSubmittedAdminEmailParams = {
  inviterName: string;
  inviterEmail: string;
  /** Pitch the inviter wrote when sending the invite (why this person is a fit). */
  inviterAboutJoiner: string;
  inviteeFullName: string;
  inviteeEmail: string;
  phoneCountryCode: string;
  phoneNumber: string;
  linkedinUrl: string;
  shipping: {
    line1: string;
    line2: string | null | undefined;
    city: string;
    postal: string;
    country: string;
  };
  tshirtSize: string;
  merchGender: MerchGender;
  projectsDescription: string;
};

function formatPhoneDisplay(countryCode: string, number: string) {
  return `${countryCode} ${number}`.trim();
}

function formatShippingAsHtml(ship: ApplicationSubmittedAdminEmailParams["shipping"]) {
  const line2 = ship.line2?.trim();
  const cityLine = [ship.postal, ship.city].filter(Boolean).join(" ");
  const parts = [ship.line1, line2, cityLine, ship.country].filter(
    (p) => p && String(p).trim().length > 0,
  ) as string[];
  return parts.map((p) => escapeHtml(p)).join("<br />");
}

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

  const phoneDisplay = formatPhoneDisplay(
    params.phoneCountryCode,
    params.phoneNumber,
  );
  const inviterAboutHtml = escapeHtml(params.inviterAboutJoiner).replaceAll(
    "\n",
    "<br />",
  );
  const projectsHtml = escapeHtml(params.projectsDescription).replaceAll(
    "\n",
    "<br />",
  );
  const linkedinSafe = escapeHtml(params.linkedinUrl);
  const shippingHtml = formatShippingAsHtml(params.shipping);
  const merchGenderLabel = escapeHtml(MERCH_GENDER_LABELS[params.merchGender]);

  await sgMail.send({
    to: adminTo,
    from: sendGridFrom(from),
    subject: `New application: ${params.inviteeFullName}`,
    html: `
      <p>A member completed their <strong>1B Tokens Club</strong> application.</p>
      <p><strong>Who invited</strong></p>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(params.inviterName)}</li>
        <li><strong>Email:</strong> ${emailAsHtmlLinkOrText(params.inviterEmail)}</li>
      </ul>
      <p><strong>What the inviter wrote about the new joiner</strong></p>
      <p>${inviterAboutHtml}</p>
      <p><strong>Who applied (invitee)</strong></p>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(params.inviteeFullName)}</li>
        <li><strong>Email:</strong> ${emailAsHtmlLinkOrText(params.inviteeEmail)}</li>
        <li><strong>Phone:</strong> ${escapeHtml(phoneDisplay)}</li>
        <li><strong>LinkedIn:</strong> <a href="${linkedinSafe}">${linkedinSafe}</a></li>
        <li><strong>Shipping address</strong><br />${shippingHtml}</li>
      </ul>
      <p><strong>Invitee</strong></p>
      <p><em>What they wrote about their projects</em></p>
      <p>${projectsHtml}</p>
      <p><strong>Merch</strong></p>
      <ul>
        <li><strong>T-shirt size:</strong> ${escapeHtml(params.tshirtSize)}</li>
        <li><strong>Gender:</strong> ${merchGenderLabel}</li>
      </ul>
    `,
    trackingSettings: { clickTracking: { enable: false } },
  });
}
