"use client";

import { SignOutButton } from "@clerk/nextjs";

export function JoinWrongAccount(props: { expectedMasked: string }) {
  return (
    <section className="border border-white/12 bg-midnight-soft p-6 sm:p-8">
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange">
        Wrong account
      </p>
      <h2 className="mt-4 text-2xl font-bold uppercase leading-tight tracking-[-0.05em] text-paper">
        Use the invited email
      </h2>
      <p className="mt-4 text-sm font-medium leading-relaxed text-paper/70">
        You&apos;re signed in with a different address than{" "}
        <strong>{props.expectedMasked}</strong>. Sign out and authenticate with
        the email from your invitation, then reload this page.
      </p>
      <div className="mt-8">
        <SignOutButton>
          <button
            type="button"
            className="cursor-pointer rounded border border-orange px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-orange transition-colors hover:bg-orange/10"
          >
            Sign out
          </button>
        </SignOutButton>
      </div>
    </section>
  );
}
