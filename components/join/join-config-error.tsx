export function JoinConfigError() {
  return (
    <main
      id="main"
      className="mx-auto w-full max-w-[var(--content-max)] px-5 py-16 sm:px-8"
    >
      <div className="border border-white/12 bg-midnight-soft p-8 text-paper">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange">
          Configuration
        </p>
        <h1 className="mt-4 text-3xl font-bold uppercase tracking-[-0.05em]">
          Database connection missing
        </h1>
        <p className="mt-4 text-sm font-medium leading-relaxed text-paper/70">
          Add <code className="text-orange">SUPABASE_URL</code> and{" "}
          <code className="text-orange">SUPABASE_SERVICE_ROLE_KEY</code> to your
          environment, run the SQL migration in{" "}
          <code className="text-orange">supabase/migrations/</code>, then reload
          this page.
        </p>
      </div>
    </main>
  );
}
