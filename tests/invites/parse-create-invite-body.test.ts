import { describe, expect, it } from "vitest";

import { parseCreateInviteBody } from "@/lib/invites/parse-create-invite-body";

describe("parseCreateInviteBody", () => {
  it("accepts valid payload and normalizes email", () => {
    const result = parseCreateInviteBody({
      fullName: "Ada Lovelace",
      email: "  Ada@Example.COM ",
      pitch: "x".repeat(20),
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.fullName).toBe("Ada Lovelace");
    expect(result.value.normalizedEmail).toBe("ada@example.com");
    expect(result.value.pitch).toBe("x".repeat(20));
  });

  it("rejects invalid body root", () => {
    expect(parseCreateInviteBody(null).ok).toBe(false);
    expect(parseCreateInviteBody("x").ok).toBe(false);
  });

  it("rejects short name", () => {
    const r = parseCreateInviteBody({
      fullName: "A",
      email: "a@b.co",
      pitch: "y".repeat(20),
    });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error).toContain("Full name");
  });

  it("rejects bad email", () => {
    const r = parseCreateInviteBody({
      fullName: "Valid Name",
      email: "not-an-email",
      pitch: "y".repeat(20),
    });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error).toContain("email");
  });

  it("rejects short pitch", () => {
    const r = parseCreateInviteBody({
      fullName: "Valid Name",
      email: "a@b.co",
      pitch: "short",
    });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error).toContain("sentences");
  });
});
