import { describe, expect, it } from "vitest";

import { parseApplicationBody } from "@/lib/invites/parse-application-body";

const validBase = {
  shipping_address_line1: "1 Builder Lane",
  shipping_city: "Prague",
  shipping_postal_code: "11000",
  shipping_country: "Czechia",
  phone_country_code: "+420",
  phone_number: "777888999",
  projects_description: "Shipping LLM workflows to production.",
  linkedin_url: "https://www.linkedin.com/in/example",
  tshirt_size: "M",
};

describe("parseApplicationBody", () => {
  it("accepts a valid payload", () => {
    const r = parseApplicationBody(validBase);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.phone_country_code).toBe("+420");
    expect(r.value.tshirt_size).toBe("M");
  });

  it("allows optional address line 2", () => {
    const r = parseApplicationBody({
      ...validBase,
      shipping_address_line2: "Suite 5",
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.shipping_address_line2).toBe("Suite 5");
  });

  it("rejects unknown phone prefix", () => {
    const r = parseApplicationBody({
      ...validBase,
      phone_country_code: "+999",
    });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error).toContain("prefix");
  });

  it("rejects short phone number", () => {
    const r = parseApplicationBody({
      ...validBase,
      phone_number: "12345",
    });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error).toContain("phone");
  });

  it("rejects LinkedIn without linkedin.com", () => {
    const r = parseApplicationBody({
      ...validBase,
      linkedin_url: "https://example.com/me",
    });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error).toContain("LinkedIn");
  });

  it("rejects invalid t-shirt size", () => {
    const r = parseApplicationBody({
      ...validBase,
      tshirt_size: "XXX",
    });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error).toContain("T-shirt");
  });
});
