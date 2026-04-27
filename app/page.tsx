import { MediaPlaceholder } from "@/components/MediaPlaceholder";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const signals = [
    { title: "Build systems", detail: "Outputs over prompts" },
    { title: "Explore together", detail: "Small rooms, real laptops" },
    { title: "Share insights", detail: "No slides, no theater" },
    { title: "Create impact", detail: "Proof beats opinion" },
  ];

  const standards = ["Build > Talk", "Systems running", "No spectators"];
  const itinerary = [
    "01_Czechia / May 2026 / Getaway",
    "02_Poland / June 2026 / Getaway",
    "03_Slovenia / July 2026 / Hike",
    "04_Croatia / Aug 2026 / Retreat",
  ];

  return (
    <main
      id="main"
      className="mx-auto w-full max-w-[var(--content-max)] px-5 pb-20 pt-8 sm:px-8 sm:pt-12"
    >
      <div className="flex flex-col gap-[var(--section-gap)]">
        <section aria-labelledby="hero-heading">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
            <div className="border border-white/12 bg-paper p-6 text-midnight shadow-2xl shadow-black/30 sm:p-8 lg:p-10">
              <div className="flex items-start justify-between gap-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange">
                  Billion Tokens Club
                </p>
                <p className="text-right text-[10px] font-bold uppercase tracking-[0.22em] text-midnight/50">
                  Invite only
                </p>
              </div>
              <h1
                id="hero-heading"
                className="mt-10 max-w-3xl text-6xl font-bold uppercase leading-[0.82] tracking-[-0.08em] sm:text-8xl lg:text-[8.8rem]"
              >
                1B
                <br />
                Tokens
                <br />
                <span className="text-orange">Club</span>
              </h1>

              <p className="mt-8 max-w-xl text-base font-medium leading-relaxed text-midnight/78 sm:text-lg">
                A private network of AI builders creating systems that move
                the real world and meeting up along the way.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-px border border-midnight/12 bg-midnight/12 sm:grid-cols-4">
                {signals.map((signal) => (
                  <div key={signal.title} className="bg-paper p-4">
                    <SignalIcon />
                    <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-midnight">
                      {signal.title}
                    </p>
                    <p className="mt-2 text-xs font-medium leading-snug text-midnight/54">
                      {signal.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="flex min-h-full flex-col justify-between border border-white/12 bg-midnight-soft p-6 text-paper sm:p-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange">
                  Builders only
                </p>
                <p className="mt-6 text-3xl font-bold uppercase leading-[0.95] tracking-[-0.06em] sm:text-5xl">
                  The club for people who see a billion tokens and think:
                  finally.
                </p>
              </div>

              <div className="mt-12 border-t border-white/10 pt-6">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange">
                  No spectators
                </p>
                <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-paper/65">
                  No noise. No theory. A room full of builders who run the
                  systems, not the discourse.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section aria-labelledby="merch-proof-heading">
          <div className="grid gap-6 border border-white/12 bg-paper p-4 text-midnight lg:grid-cols-[0.78fr_1.22fr] lg:p-6">
            <div className="flex flex-col justify-between border border-midnight/10 p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange">
                  Club artifact
                </p>
                <h2
                  id="merch-proof-heading"
                  className="mt-6 text-4xl font-bold uppercase leading-[0.9] tracking-[-0.07em] sm:text-6xl"
                >
                  Premium stuff for people shipping the future.
                </h2>
              </div>
              <p className="mt-10 max-w-md text-sm font-medium leading-relaxed text-midnight/62">
                The merch is not a product line. It is proof you were in the
                room, on the hike, in the build, at the moment.
              </p>
            </div>

            <div className="relative overflow-hidden border border-midnight/10 bg-midnight p-2">
              <Image
                src="/merch-on-a-table.jpg"
                alt="One Billion Tokens Club merch board with shirts, hoodie, hats, tote, bottle, notebook, patches, and packaging"
                width={1024}
                height={683}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </section>

        <section aria-labelledby="what-heading">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange">
                What it is
              </p>
              <h2
                id="what-heading"
                className="mt-5 text-3xl font-bold uppercase leading-none tracking-[-0.06em] text-paper sm:text-5xl"
              >
                A closed circle of AI builders.
              </h2>
            </div>
            <div className="grid gap-px border border-white/12 bg-white/12 lg:col-span-8">
              {[
                "Build real AI workflows, products, or systems",
                "Think in outputs, not prompts",
                "Want to be around others doing the same",
              ].map((item, index) => (
                <div
                  key={item}
                  className="grid gap-4 bg-midnight-soft p-6 sm:grid-cols-[auto_1fr] sm:items-center"
                >
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange">
                    0{index + 1}
                  </p>
                  <p className="text-xl font-bold uppercase leading-tight tracking-[-0.03em] text-paper">
                    {item}
                  </p>
                </div>
              ))}
              <div className="bg-paper p-6 text-midnight">
                <p className="text-sm font-bold uppercase tracking-[0.18em]">
                  Membership is earned. Access is limited.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="getaways-heading">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="border border-white/12 bg-midnight-soft p-6 sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange">
                Upcoming runs / hikes / retreats
              </p>
              <h2
                id="getaways-heading"
                className="mt-5 text-4xl font-bold uppercase leading-[0.9] tracking-[-0.07em] text-paper sm:text-6xl"
              >
                Weekend rooms across Europe.
              </h2>
              <div className="mt-8 space-y-4 text-sm font-medium leading-relaxed text-paper/68">
                <p>
                  You bring your laptop. You show what you&apos;re building.
                  Others do the same.
                </p>
                <p>
                  No slides. No fluff. Only real systems, real discussions,
                  real insight.
                </p>
              </div>
            </div>

            <div className="grid gap-px border border-white/12 bg-white/12 sm:grid-cols-2">
              {itinerary.map((item) => (
                <div key={item} className="bg-paper p-6 text-midnight">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange">
                    {item.split(" / ")[0]}
                  </p>
                  <p className="mt-8 text-2xl font-bold uppercase leading-none tracking-[-0.05em]">
                    {item.split(" / ")[2]}
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-midnight/50">
                    {item.split(" / ")[1]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="drop-heading">
          <div className="grid gap-8 lg:grid-cols-2">
            <MediaPlaceholder
              title="Networking event"
              subtitle="Small groups. Laptops open. Systems running. Conversations that do not survive outside the room."
              meta="Meeting with fellow builders to exchange best-practices and insights"
              imageSrc="/meeting-group.jpg"
              imageAlt="Small group of AI builders meeting with laptops open"
            />
            <div className="border border-white/12 bg-paper p-6 text-midnight sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange">
                Member drop
              </p>
              <h2
                id="drop-heading"
                className="mt-5 text-4xl font-bold uppercase leading-[0.9] tracking-[-0.07em] sm:text-6xl"
              >
                Not for sale. Not public.
              </h2>
              <div className="mt-8 space-y-5 text-sm font-medium leading-relaxed text-midnight/68">
                <p>Members receive limited merchandise.</p>
                <p>Each piece marks participation.</p>
                <p>Each drop is tied to a moment.</p>
                <p className="border-l-2 border-orange pl-4 font-bold uppercase tracking-[0.12em] text-midnight">
                  1B TOKENS is not for everyone.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="standard-heading">
          <div className="border border-white/12 bg-midnight-soft p-6 sm:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange">
              The standard
            </p>
            <h2
              id="standard-heading"
              className="mt-5 max-w-4xl text-4xl font-bold uppercase leading-[0.92] tracking-[-0.07em] text-paper sm:text-6xl"
            >
              The room is small because the bar is high.
            </h2>
            <ul className="mt-10 grid gap-px border border-white/12 bg-white/12 sm:grid-cols-3">
              {standards.map((item) => (
                <li key={item} className="bg-midnight p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-orange">
                    Club rule
                  </p>
                  <p className="mt-10 text-2xl font-bold uppercase leading-none tracking-[-0.05em] text-paper">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-sm font-medium text-paper/58">
              If you know, you know.
            </p>
          </div>
        </section>

        <section aria-labelledby="access-heading">
          <div className="grid gap-px border border-white/12 bg-white/12 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="bg-paper p-6 text-midnight sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange">
                Access
              </p>
              <h2
                id="access-heading"
                className="mt-8 text-5xl font-bold uppercase leading-[0.85] tracking-[-0.08em] sm:text-7xl"
              >
                You don&apos;t apply.
              </h2>
            </div>
            <div className="bg-orange p-6 text-midnight sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em]">
                Join the movement
              </p>
              <p className="mt-8 text-5xl font-bold uppercase leading-[0.85] tracking-[-0.08em] sm:text-7xl">
                You get invited.
              </p>
              <p className="mt-10 max-w-lg text-sm font-bold uppercase tracking-[0.12em]">
                Prove it. Build it. Live it.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SignalIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      className="size-8 text-orange"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M5 23h22M8 23l6-12 5 8 3-5 4 9" />
      <path d="M6 8h4M22 8h4M16 5v4" />
    </svg>
  );
}
