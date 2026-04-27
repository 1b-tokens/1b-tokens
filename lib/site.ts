const DEFAULT_ORIGIN = "http://localhost:3000";

function normalizeOrigin(url: string): string {
  const trimmed = url.trim().replace(/\/$/, "");
  return trimmed || DEFAULT_ORIGIN;
}

/** Public site origin, no trailing slash. Used for sitemap, robots, JSON-LD. */
export function getSiteOrigin(): string {
  return normalizeOrigin(
    process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_ORIGIN,
  );
}

export function getMetadataBase(): URL {
  return new URL(`${getSiteOrigin()}/`);
}

export const siteTitle = "One Billion Tokens Club";
export const siteTitleShort = "1B TOKENS";

export const siteDescription =
  "Private invite-only club for AI builders creating real systems, running serious workflows, and earning access to the room.";
