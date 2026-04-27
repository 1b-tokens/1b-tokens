import { auth, currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { ClubAccordion } from "@/components/join/club-accordion";
import { JoinApplicationForm } from "@/components/join/join-application-form";
import { JoinAuthPanel } from "@/components/join/join-auth-panel";
import { JoinConfigError } from "@/components/join/join-config-error";
import { JoinThankYou } from "@/components/join/join-thank-you";
import { JoinWrongAccount } from "@/components/join/join-wrong-account";
import { getInviteByToken } from "@/lib/invites/get-invite-by-token";
import { maskEmail } from "@/lib/invites/mask-email";
import { normalizeEmail } from "@/lib/invites/normalize-email";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  return {
    title: "Invitation",
    robots: { index: false, follow: false },
    alternates: { canonical: `/join/${token}` },
  };
}

export default async function JoinInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let invite: Awaited<ReturnType<typeof getInviteByToken>>;
  try {
    invite = await getInviteByToken(token);
  } catch {
    return <JoinConfigError />;
  }

  if (!invite) {
    notFound();
  }

  if (invite.status === "submitted") {
    return (
      <main
        id="main"
        className="mx-auto w-full max-w-[var(--content-max)] px-5 py-16 sm:px-8"
      >
        <JoinThankYou name={invite.invitee_full_name} />
      </main>
    );
  }

  const { userId } = await auth();

  let applicationSection: ReactNode;

  if (!userId) {
    applicationSection = (
      <JoinAuthPanel token={token} inviteeEmail={invite.invitee_email} />
    );
  } else {
    const user = await currentUser();
    const emails =
      user?.emailAddresses.map((e) => normalizeEmail(e.emailAddress)) ?? [];
    const invited = normalizeEmail(invite.invitee_email);
    const allowed = emails.includes(invited);

    if (!allowed) {
      applicationSection = (
        <JoinWrongAccount expectedMasked={maskEmail(invite.invitee_email)} />
      );
    } else {
      applicationSection = <JoinApplicationForm token={token} />;
    }
  }

  return (
    <main
      id="main"
      className="mx-auto w-full max-w-[var(--content-max)] px-5 py-16 sm:px-8"
    >
      <div className="flex flex-col gap-10">
        <header>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange">
            Private invite
          </p>
          <h1 className="mt-3 text-4xl font-bold uppercase leading-tight tracking-[-0.07em] text-paper sm:text-6xl">
            Apply to the 1B Tokens Club
          </h1>
          <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-paper/65">
            You were invited as <strong>{invite.invitee_full_name}</strong>.
            Read the club context, then complete the free application. We ship
            merch to serious builders only.
          </p>
        </header>

        <ClubAccordion />

        {applicationSection}
      </div>
    </main>
  );
}
