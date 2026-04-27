import type { MerchGender, TshirtSize } from "@/lib/invites/constants";
import { MERCH_GENDERS, TSHIRT_SIZES } from "@/lib/invites/constants";
import { PHONE_COUNTRY_DIAL_SET } from "@/lib/phone-country-codes";

export type ParsedApplicationBody = {
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  phone_country_code: string;
  phone_number: string;
  projects_description: string;
  linkedin_url: string;
  tshirt_size: TshirtSize;
  merch_gender: MerchGender;
};

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalString(value: unknown) {
  const s = readString(value);
  return s.length ? s : undefined;
}

export function parseApplicationBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return { ok: false as const, error: "Invalid body" };
  }

  const b = body as Record<string, unknown>;

  const shipping_address_line1 = readString(b.shipping_address_line1);
  const shipping_address_line2 = readOptionalString(b.shipping_address_line2);
  const shipping_city = readString(b.shipping_city);
  const shipping_postal_code = readString(b.shipping_postal_code);
  const shipping_country = readString(b.shipping_country);
  const phone_country_code = readString(b.phone_country_code);
  const phone_number = readString(b.phone_number);
  const projects_description = readString(b.projects_description);
  const linkedin_url = readString(b.linkedin_url);
  const tshirt_size = readString(b.tshirt_size);
  const merch_gender = readString(b.merch_gender);

  if (!TSHIRT_SIZES.includes(tshirt_size as TshirtSize)) {
    return { ok: false as const, error: "Invalid T-shirt size." };
  }

  if (!MERCH_GENDERS.includes(merch_gender as MerchGender)) {
    return {
      ok: false as const,
      error: "Select a merch gender (male, female, or unisex).",
    };
  }

  if (!shipping_address_line1 || !shipping_city || !shipping_postal_code) {
    return {
      ok: false as const,
      error: "Shipping address, city, and postal code are required.",
    };
  }

  if (!shipping_country) {
    return { ok: false as const, error: "Shipping country is required." };
  }

  if (!PHONE_COUNTRY_DIAL_SET.has(phone_country_code)) {
    return {
      ok: false as const,
      error: "Select a valid phone country prefix.",
    };
  }

  if (!phone_number || phone_number.replace(/\D/g, "").length < 6) {
    return {
      ok: false as const,
      error: "Enter a valid phone number (digits only after prefix).",
    };
  }

  if (projects_description.length < 10) {
    return {
      ok: false as const,
      error: "Please describe your projects in more detail.",
    };
  }

  if (!linkedin_url.toLowerCase().includes("linkedin.com")) {
    return {
      ok: false as const,
      error:
        "Please provide your LinkedIn profile URL (must include linkedin.com).",
    };
  }

  return {
    ok: true as const,
    value: {
      shipping_address_line1,
      shipping_address_line2,
      shipping_city,
      shipping_postal_code,
      shipping_country,
      phone_country_code,
      phone_number,
      projects_description,
      linkedin_url,
      tshirt_size: tshirt_size as TshirtSize,
      merch_gender: merch_gender as MerchGender,
    } satisfies ParsedApplicationBody,
  };
}
