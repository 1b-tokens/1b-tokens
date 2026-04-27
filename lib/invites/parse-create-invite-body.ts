import { normalizeEmail } from "@/lib/invites/normalize-email";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ParsedCreateInvite = {
  fullName: string;
  pitch: string;
  normalizedEmail: string;
};

export function parseCreateInviteBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return { ok: false as const, error: "Invalid body" };
  }

  const { fullName, email, pitch } = body as Record<string, unknown>;

  if (typeof fullName !== "string" || fullName.trim().length < 2) {
    return {
      ok: false as const,
      error: "Full name must be at least 2 characters.",
    };
  }

  if (typeof email !== "string" || !emailPattern.test(email.trim())) {
    return {
      ok: false as const,
      error: "A valid email address is required.",
    };
  }

  if (typeof pitch !== "string" || pitch.trim().length < 20) {
    return {
      ok: false as const,
      error:
        "Please write at least a few sentences about why this person is a good fit.",
    };
  }

  return {
    ok: true as const,
    value: {
      fullName: fullName.trim(),
      pitch: pitch.trim(),
      normalizedEmail: normalizeEmail(email),
    } satisfies ParsedCreateInvite,
  };
}
