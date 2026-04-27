"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";

function maskEmailHint(email: string) {
  const [local, domain] = email.split("@");
  if (!domain || !local) return "the address this invite was sent to";
  return `${local.slice(0, 1)}***@${domain}`;
}

export function JoinAuthPanel(props: { token: string; inviteeEmail: string }) {
  const returnUrl = `/join/${props.token}`;
  const hint = maskEmailHint(props.inviteeEmail);

  return (
    <section className="border border-orange/35 bg-paper p-6 text-midnight sm:p-8">
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange">
        Application (free)
      </p>
      <h2 className="mt-4 text-2xl font-bold uppercase leading-tight tracking-[-0.05em] sm:text-3xl">
        Register before you apply
      </h2>
      <p className="mt-4 text-sm font-medium leading-relaxed text-midnight/72">
        This invite was sent to <strong>{hint}</strong>. Create a Clerk account
        (or sign in) using <strong>that same email</strong> so we can match you
        to this invite. After you authenticate, you&apos;ll return here to
        finish shipping details, phone, LinkedIn, and your build story.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <SignUpButton mode="modal" forceRedirectUrl={returnUrl}>
          <button
            type="button"
            className="cursor-pointer rounded border border-midnight bg-midnight px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-paper transition-colors hover:bg-midnight/90"
          >
            Create account
          </button>
        </SignUpButton>
        <SignInButton mode="modal" forceRedirectUrl={returnUrl}>
          <button
            type="button"
            className="cursor-pointer rounded border border-midnight/25 bg-transparent px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-midnight transition-colors hover:border-midnight"
          >
            Sign in
          </button>
        </SignInButton>
      </div>
    </section>
  );
}
