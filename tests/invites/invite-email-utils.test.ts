import { describe, expect, it } from "vitest";

import { maskEmail } from "@/lib/invites/mask-email";
import { normalizeEmail } from "@/lib/invites/normalize-email";

describe("normalizeEmail", () => {
  it("lowercases and trims", () => {
    expect(normalizeEmail("  Foo@BAR.com ")).toBe("foo@bar.com");
  });
});

describe("maskEmail", () => {
  it("masks local part", () => {
    expect(maskEmail("michal@example.com")).toMatch(/^m\*\*\*@example\.com$/);
  });
});
