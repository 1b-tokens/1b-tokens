declare module "country-telephone-data" {
  export type CountryTelephoneRow = {
    name: string;
    iso2: string;
    dialCode: string;
  };

  /** Processed list (name, ISO2, numeric dial string without +). */
  export const allCountries: CountryTelephoneRow[];
  export const iso2Lookup: Record<string, number>;
  export const allCountryCodes: Record<string, string[]>;
}
