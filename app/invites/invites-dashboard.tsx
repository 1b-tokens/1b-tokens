"use client";

import { useMemo, useState } from "react";

import { MAX_PENDING_INVITES_PER_USER } from "@/lib/invites/constants";
import type { InviteListRow } from "@/lib/invites/list-invites-for-user";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function statusText(status: InviteListRow["status"]) {
  return status === "pending"
    ? "Awaiting application"
    : "Application received";
}

function statusClassName(status: InviteListRow["status"]) {
  return status === "pending" ? "text-orange" : "text-paper/70";
}

type Props = {
  initialInvites: InviteListRow[];
  canSendInvites: boolean;
};

export function InvitesDashboard({ initialInvites, canSendInvites }: Props) {
  const [invites, setInvites] = useState<InviteListRow[]>(initialInvites);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const pendingCount = useMemo(
    () => invites.filter((i) => i.status === "pending").length,
    [invites],
  );

  async function refreshFromApi() {
    const res = await fetch("/api/invites");
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLoadError(typeof body.error === "string" ? body.error : "Load failed");
      return;
    }
    setLoadError(null);
    setInvites((body.invites ?? []) as InviteListRow[]);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get("fullName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      pitch: String(formData.get("pitch") ?? "").trim(),
    };

    const res = await fetch("/api/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    setSubmitting(false);

    if (!res.ok) {
      setFormError(typeof body.error === "string" ? body.error : "Send failed");
      return;
    }

    form.reset();
    await refreshFromApi();
  }

  const atLimit = pendingCount >= MAX_PENDING_INVITES_PER_USER;
  const formDisabled = atLimit || !canSendInvites;

  return (
    <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start">
      <section className="min-w-0 border border-white/12 bg-midnight-soft p-5 sm:p-8">
        <h2 className="text-lg font-bold uppercase tracking-[-0.02em] text-paper">
          Your invites
        </h2>
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-paper/45">
          Open: {pendingCount} / {MAX_PENDING_INVITES_PER_USER}
        </p>

        {loadError ? (
          <p className="mt-4 text-sm font-bold text-orange" role="alert">
            {loadError}
          </p>
        ) : null}

        {invites.length === 0 ? (
          <p className="mt-6 text-sm text-paper/55">
            {canSendInvites
              ? "No invites yet. Send your first one from the form."
              : "No invites yet. After you complete your own application from an invite link, you can send invites here."}
          </p>
        ) : (
          <>
            <ul className="mt-6 flex min-w-0 flex-col gap-3 md:hidden" role="list">
              {invites.map((invite) => (
                <li
                  key={invite.id}
                  className="min-w-0 rounded border border-white/10 bg-midnight/40 p-4"
                >
                  <div className="min-w-0 space-y-3 text-sm text-paper/80">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">
                        Name
                      </p>
                      <p className="mt-1 min-w-0 break-words font-bold text-paper">
                        {invite.invitee_full_name}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">
                        Email
                      </p>
                      <p className="mt-1 min-w-0 [overflow-wrap:anywhere] break-words text-paper/90">
                        {invite.invitee_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">
                        Status
                      </p>
                      <p
                        className={`mt-1 font-medium ${statusClassName(invite.status)}`}
                      >
                        {statusText(invite.status)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">
                        Sent
                      </p>
                      <p className="mt-1 text-xs text-paper/60">
                        {formatDate(invite.created_at)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 hidden min-w-0 overflow-x-auto md:block">
              <table className="w-full min-w-0 text-left text-sm text-paper/80">
                <thead className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">
                  <tr>
                    <th className="w-[20%] pb-3 pr-3 align-bottom">Name</th>
                    <th className="w-[32%] pb-3 pr-3 align-bottom">Email</th>
                    <th className="w-[22%] pb-3 pr-3 align-bottom">Status</th>
                    <th className="pb-3 align-bottom">Sent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {invites.map((invite) => (
                    <tr key={invite.id}>
                      <td className="py-3 pr-3 align-top font-bold break-words text-paper">
                        {invite.invitee_full_name}
                      </td>
                      <td className="min-w-0 py-3 pr-3 align-top [overflow-wrap:anywhere] break-words">
                        {invite.invitee_email}
                      </td>
                      <td className="min-w-[10rem] py-3 pr-3 align-top">
                        <span className={statusClassName(invite.status)}>
                          {statusText(invite.status)}
                        </span>
                      </td>
                      <td className="min-w-[9rem] whitespace-nowrap py-3 text-xs text-paper/55">
                        {formatDate(invite.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <section className="border border-orange/35 bg-paper p-6 text-midnight sm:p-8">
        <h2 className="text-lg font-bold uppercase tracking-[-0.02em]">
          Send a new invite
        </h2>
        <p className="mt-3 text-sm font-medium leading-relaxed text-midnight/70">
          Tell us who deserves a seat. Why should this person join our VIP
          builder weekends? What are they shipping that raises the bar for
          everyone in the room?
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-midnight/55">
              Full name
            </label>
            <input
              name="fullName"
              required
              disabled={formDisabled}
              className="border border-midnight/15 bg-white px-3 py-2 text-sm text-midnight outline-none ring-orange focus:ring-2 disabled:opacity-50"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-midnight/55">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              disabled={formDisabled}
              className="border border-midnight/15 bg-white px-3 py-2 text-sm text-midnight outline-none ring-orange focus:ring-2 disabled:opacity-50"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-midnight/55">
              Why are they a fit?
            </label>
            <textarea
              name="pitch"
              required
              rows={5}
              minLength={20}
              disabled={formDisabled}
              placeholder="What are they building? Why should they join our VIP events? How do they show up for other builders?"
              className="border border-midnight/15 bg-white px-3 py-2 text-sm text-midnight outline-none ring-orange focus:ring-2 disabled:opacity-50"
            />
          </div>

          {formError ? (
            <p className="text-sm font-bold text-red-700" role="alert">
              {formError}
            </p>
          ) : null}

          {!canSendInvites ? (
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-midnight/60">
              You can send invites only after you submit the club application
              from your own invite link. This page is visible before that so you
              can see the flow.
            </p>
          ) : atLimit ? (
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-midnight/55">
              You already have {MAX_PENDING_INVITES_PER_USER} open invites.
              Wait until someone submits their application before sending more.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting || formDisabled}
            className="w-full cursor-pointer rounded border border-midnight bg-midnight py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-paper transition-colors hover:bg-midnight/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send invite email"}
          </button>
        </form>
      </section>
    </div>
  );
}
