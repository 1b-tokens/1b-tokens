export function JoinThankYou(props: { name: string }) {
  return (
    <section className="border border-orange/45 bg-orange/15 p-8 text-paper sm:p-10">
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange">
        Thank you
      </p>
      <h1 className="mt-4 text-3xl font-bold uppercase leading-tight tracking-[-0.06em] sm:text-4xl">
        You&apos;re in, {props.name.split(" ")[0] || "builder"}.
      </h1>
      <p className="mt-6 max-w-2xl text-sm font-medium leading-relaxed text-paper/80">
        We received your application and saved your shipping details. We&apos;ll
        email you soon with logistics for upcoming builder weekends, hikes, and
        member drops — keep an eye on your inbox (and spam, just in case).
      </p>
    </section>
  );
}
