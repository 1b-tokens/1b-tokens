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

type Props = {
  initialInvites: InviteListRow[];
};

export function InvitesDashboard({ initialInvites }: Props) {
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

  return (
    <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start">
      <section className="border border-white/12 bg-midnight-soft p-6 sm:p-8">
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

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-paper/80">
            <thead className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">
              <tr>
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Sent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {invites.length === 0 ? (
                <tr>
                  <td className="py-6 text-paper/55" colSpan={4}>
                    No invites yet. Send your first one from the form.
                  </td>
                </tr>
              ) : (
                invites.map((invite) => (
                  <tr key={invite.id}>
                    <td className="py-3 pr-4 font-bold text-paper">
                      {invite.invitee_full_name}
                    </td>
                    <td className="py-3 pr-4">{invite.invitee_email}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={
                          invite.status === "pending"
                            ? "text-orange"
                            : "text-paper/70"
                        }
                      >
                        {invite.status === "pending"
                          ? "Awaiting application"
                          : "Application received"}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-paper/55">
                      {formatDate(invite.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
              disabled={atLimit}
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
              disabled={atLimit}
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
              disabled={atLimit}
              placeholder="What are they building? Why should they join our VIP events? How do they show up for other builders?"
              className="border border-midnight/15 bg-white px-3 py-2 text-sm text-midnight outline-none ring-orange focus:ring-2 disabled:opacity-50"
            />
          </div>

          {formError ? (
            <p className="text-sm font-bold text-red-700" role="alert">
              {formError}
            </p>
          ) : null}

          {atLimit ? (
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-midnight/55">
              You already have {MAX_PENDING_INVITES_PER_USER} open invites.
              Wait until someone submits their application before sending more.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting || atLimit}
            className="w-full cursor-pointer rounded border border-midnight bg-midnight py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-paper transition-colors hover:bg-midnight/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send invite email"}
          </button>
        </form>
      </section>
    </div>
  );
}
