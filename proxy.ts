import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedInvites = createRouteMatcher([
  "/invites(.*)",
  "/api/invites(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedInvites(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
