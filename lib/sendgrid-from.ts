import "server-only";

const SENDGRID_FROM_DISPLAY_NAME = "1B Tokens";

/** SendGrid from line: display name + verified sender email. */
export function sendGridFrom(verifiedFromEmail: string) {
  return {
    name: SENDGRID_FROM_DISPLAY_NAME,
    email: verifiedFromEmail,
  };
}
