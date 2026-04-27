export function ClubAccordion() {
  const items = [
    {
      title: "What is the 1B Tokens Club?",
      body: "A private, invite-only network of AI builders who ship real systems — products, workflows, and organizations — not slides or hot takes. We meet in small rooms across Europe: getaways, hikes, and retreats where laptops are open and proof matters more than opinions.",
    },
    {
      title: "Why we exist",
      body: "Most communities optimize for reach. We optimize for signal. The club exists so builders can compare notes with peers who run production workloads, share what actually worked, and leave with sharper systems — without turning the work into performance.",
    },
    {
      title: "Manifesto (short)",
      body: "Build over talk. Outputs over prompts. Proof over posture. The room stays small because the bar stays high. Membership is earned through what you build and how you show up for others who build.",
    },
    {
      title: "VIP events & merch",
      body: "Members get access to intimate builder weekends and limited drops tied to real moments — not a public storefront. Welcome merch is part of the ritual: proof you were in the room when something shipped.",
    },
  ];

  return (
    <section
      aria-labelledby="club-accordion-heading"
      className="border border-white/12 bg-midnight-soft p-6 sm:p-8"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange">
        About the club
      </p>
      <h2
        id="club-accordion-heading"
        className="mt-4 text-3xl font-bold uppercase leading-tight tracking-[-0.06em] text-paper sm:text-4xl"
      >
        1B Tokens in your own time
      </h2>
      <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-paper/65">
        Expand each section to read more before you apply. Applying is free; we
        still read every submission carefully.
      </p>
      <div className="mt-8 space-y-3">
        {items.map((item) => (
          <details
            key={item.title}
            className="group border border-white/10 bg-midnight/60 open:bg-midnight"
          >
            <summary className="cursor-pointer list-none px-4 py-4 text-sm font-bold uppercase tracking-[0.14em] text-orange marker:hidden [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                <span className="text-paper">{item.title}</span>
                <span
                  className="text-[10px] text-paper/50 transition group-open:rotate-180"
                  aria-hidden
                >
                  ▼
                </span>
              </span>
            </summary>
            <div className="border-t border-white/10 px-4 pb-4 pt-3 text-sm font-medium leading-relaxed text-paper/72">
              {item.body}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
