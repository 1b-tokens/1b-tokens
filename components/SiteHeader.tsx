export function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-midnight text-paper">
      <div className="mx-auto grid max-w-[var(--content-max)] grid-cols-[1fr_auto] items-center gap-6 px-5 py-5 sm:px-8 lg:grid-cols-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-orange">
            Billion Tokens Club
          </p>
          <p className="mt-1 text-xl font-bold uppercase leading-none tracking-[-0.04em]">
            1B TOKENS
          </p>
        </div>

        <div className="hidden justify-self-center border border-white/15 px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-paper/80 lg:block">
          Private builder network
        </div>

        <div className="flex items-center justify-end gap-4">
          <div
            className="grid size-9 place-items-center rounded-full border border-orange text-orange"
            aria-hidden
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c2.4 2.7 3.6 5.7 3.6 9S14.4 18.3 12 21M12 3C9.6 5.7 8.4 8.7 8.4 12S9.6 18.3 12 21" />
            </svg>
          </div>
          <p className="hidden text-right text-[10px] font-bold uppercase tracking-[0.24em] text-orange sm:block">
            Invite only
          </p>
        </div>
      </div>
    </header>
  );
}
