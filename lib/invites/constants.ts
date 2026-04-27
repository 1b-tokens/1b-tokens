export const MAX_PENDING_INVITES_PER_USER = 99;

/**
 * Clerk user IDs that may send invites at any time without submitting the club
 * application, and with no cap on open pending invites.
 */
export const UNRESTRICTED_INVITE_ADMIN_CLERK_USER_IDS = new Set<string>([
  "user_3Cwq9euobZ767F22wNosr3nddIS",
]);

export function isUnrestrictedInviteAdmin(
  userId: string | null | undefined,
): boolean {
  return userId != null && UNRESTRICTED_INVITE_ADMIN_CLERK_USER_IDS.has(userId);
}

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
