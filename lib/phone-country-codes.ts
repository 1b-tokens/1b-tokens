import { allCountries } from "country-telephone-data";

export type PhoneCountryPrefix = {
  /** E.164 country calling code, e.g. +420 (may repeat across rows, e.g. +1 for US and Canada). */
  value: string;
  /** Country name and code for the dropdown. */
  label: string;
  /** ISO 3166-1 alpha-2 — unique for React `key` and one row per territory. */
  iso2: string;
};

const rows: PhoneCountryPrefix[] = allCountries
  .map((c) => {
    const dial = `+${c.dialCode}`;
    return { value: dial, label: `${c.name} (${dial})`, iso2: c.iso2.toLowerCase() };
  })
  .sort((a, b) => a.label.localeCompare(b.label, "en"));

/** All territories from country-telephone-data, A–Z by display label. */
export const PHONE_COUNTRY_PREFIXES: readonly PhoneCountryPrefix[] = rows;

/** Set of every distinct calling code prefix the form may submit (e.g. "+1" once, not per country). */
export const PHONE_COUNTRY_DIAL_SET = new Set(
  allCountries.map((c) => `+${c.dialCode}`),
);
