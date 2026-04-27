"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { PHONE_COUNTRY_PREFIXES } from "@/lib/phone-country-codes";
import { TSHIRT_SIZES } from "@/lib/invites/constants";

export function JoinApplicationForm(props: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submitForm(formData: FormData) {
    setError(null);
    setPending(true);
    const payload = Object.fromEntries(formData.entries());
    try {
      const res = await fetch(`/api/invites/${props.token}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof body.error === "string" ? body.error : "Request failed");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="border border-orange/35 bg-paper p-6 text-midnight sm:p-8">
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange">
        Application (free)
      </p>
      <h2 className="mt-4 text-2xl font-bold uppercase leading-tight tracking-[-0.05em] sm:text-3xl">
        Tell us how to reach you
      </h2>
      <p className="mt-4 text-sm font-medium leading-relaxed text-midnight/72">
        We use this for welcome merch and urgent event logistics only. Be
        precise — customs and couriers are unforgiving.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          await submitForm(new FormData(event.currentTarget));
        }}
      >
        <div className="grid gap-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-midnight/55">
            Street address line 1
          </label>
          <input
            name="shipping_address_line1"
            required
            className="border border-midnight/15 bg-white px-3 py-2 text-sm text-midnight outline-none ring-orange focus:ring-2"
            autoComplete="address-line1"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-midnight/55">
            Street address line 2 (optional)
          </label>
          <input
            name="shipping_address_line2"
            className="border border-midnight/15 bg-white px-3 py-2 text-sm text-midnight outline-none ring-orange focus:ring-2"
            autoComplete="address-line2"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-midnight/55">
              City
            </label>
            <input
              name="shipping_city"
              required
              className="border border-midnight/15 bg-white px-3 py-2 text-sm text-midnight outline-none ring-orange focus:ring-2"
              autoComplete="address-level2"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-midnight/55">
              Postal code
            </label>
            <input
              name="shipping_postal_code"
              required
              className="border border-midnight/15 bg-white px-3 py-2 text-sm text-midnight outline-none ring-orange focus:ring-2"
              autoComplete="postal-code"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-midnight/55">
            Country / region
          </label>
          <input
            name="shipping_country"
            required
            className="border border-midnight/15 bg-white px-3 py-2 text-sm text-midnight outline-none ring-orange focus:ring-2"
            autoComplete="country-name"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-[minmax(0,220px)_1fr]">
          <div className="grid gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-midnight/55">
              Phone country code
            </label>
            <select
              name="phone_country_code"
              required
              defaultValue="+420"
              className="border border-midnight/15 bg-white px-3 py-2 text-sm text-midnight outline-none ring-orange focus:ring-2"
            >
              {PHONE_COUNTRY_PREFIXES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-midnight/55">
              Phone number (digits)
            </label>
            <input
              name="phone_number"
              required
              inputMode="numeric"
              className="border border-midnight/15 bg-white px-3 py-2 text-sm text-midnight outline-none ring-orange focus:ring-2"
              autoComplete="tel-national"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-midnight/55">
            Projects you&apos;re working on
          </label>
          <textarea
            name="projects_description"
            required
            rows={4}
            minLength={10}
            placeholder="Shipped systems, experiments, teams, constraints…"
            className="border border-midnight/15 bg-white px-3 py-2 text-sm text-midnight outline-none ring-orange focus:ring-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-midnight/55">
            LinkedIn profile URL
          </label>
          <input
            name="linkedin_url"
            required
            type="url"
            placeholder="https://www.linkedin.com/in/your-handle"
            className="border border-midnight/15 bg-white px-3 py-2 text-sm text-midnight outline-none ring-orange focus:ring-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-midnight/55">
            T-shirt size (welcome drop)
          </label>
          <select
            name="tshirt_size"
            required
            defaultValue="M"
            className="border border-midnight/15 bg-white px-3 py-2 text-sm text-midnight outline-none ring-orange focus:ring-2"
          >
            {TSHIRT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <p className="text-sm font-bold text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full cursor-pointer rounded border border-midnight bg-midnight py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-paper transition-colors hover:bg-midnight/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
        >
          {pending ? "Submitting…" : "Submit application"}
        </button>
      </form>
    </section>
  );
}
