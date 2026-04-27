export const MAX_PENDING_INVITES_PER_USER = 3;

export const INVITE_STATUSES = ["pending", "submitted"] as const;
export type InviteStatus = (typeof INVITE_STATUSES)[number];

export const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"] as const;
export type TshirtSize = (typeof TSHIRT_SIZES)[number];

export const MERCH_GENDERS = ["male", "female", "unisex"] as const;
export type MerchGender = (typeof MERCH_GENDERS)[number];

export const MERCH_GENDER_LABELS: Record<MerchGender, string> = {
  male: "Male",
  female: "Female",
  unisex: "Unisex",
};
