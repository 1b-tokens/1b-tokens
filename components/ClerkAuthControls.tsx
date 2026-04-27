"use client";

import { Show, SignInButton, UserButton } from "@clerk/nextjs";

function InvitesMenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M4 6h16M4 12h10M4 18h14" />
    </svg>
  );
}

export function ClerkAuthControls() {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <Show when="signed-out">
        <SignInButton>
          <button
            type="button"
            className="cursor-pointer rounded border border-orange px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-orange transition-colors hover:border-orange hover:bg-orange/15 hover:text-paper"
          >
            Sign in
          </button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "size-9 ring-1 ring-orange/40",
            },
          }}
        >
          <UserButton.MenuItems>
            <UserButton.Link
              label="Invites"
              labelIcon={<InvitesMenuIcon />}
              href="/invites"
            />
          </UserButton.MenuItems>
        </UserButton>
      </Show>
    </div>
  );
}
