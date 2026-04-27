/** Max open (pending) invites for members who passed the application gate. */
export const MAX_PENDING_INVITES_PER_MEMBER = 3;

/** Max open (pending) invites for allowlisted invite admins. */
export const MAX_PENDING_INVITES_PER_ADMIN = 99;

/**
 * Clerk user IDs that may send invites at any time without submitting the club
 * application, and with a higher open-invite cap ({@link MAX_PENDING_INVITES_PER_ADMIN}).
 */
export const UNRESTRICTED_INVITE_ADMIN_CLERK_USER_IDS = new Set<string>([
  "user_3Cwq9euobZ767F22wNosr3nddIS",
]);

export function isUnrestrictedInviteAdmin(
  userId: string | null | undefined,
): boolean {
  return userId != null && UNRESTRICTED_INVITE_ADMIN_CLERK_USER_IDS.has(userId);
}

export function maxPendingInvitesForClerkUser(
  userId: string | null | undefined,
): number {
  return isUnrestrictedInviteAdmin(userId)
    ? MAX_PENDING_INVITES_PER_ADMIN
    : MAX_PENDING_INVITES_PER_MEMBER;
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
