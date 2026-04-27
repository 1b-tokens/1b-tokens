import Image from "next/image";

export function MediaPlaceholder({
  title,
  subtitle,
  meta = "Invite only",
  imageSrc,
  imageAlt,
}: {
  title: string;
  subtitle: string;
  meta?: string;
  imageSrc?: string;
  imageAlt?: string;
}) {
  return (
    <figure
      className="group border border-white/14 bg-midnight-soft p-4 text-paper shadow-2xl shadow-black/20"
      aria-label={title}
    >
      <div className="flex items-start justify-between gap-6 border-b border-white/10 pb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange">
          {meta}
        </p>
        <p className="text-right text-[10px] font-bold uppercase tracking-[0.18em] text-paper/50">
          Club spec
        </p>
      </div>

      <div className="relative my-8 aspect-[16/10] overflow-hidden border border-white/10 bg-midnight">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <svg
            className="absolute inset-0 h-full w-full text-white/16 transition-colors group-hover:text-orange/35"
            viewBox="0 0 800 500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            aria-hidden
          >
            <rect x="52" y="52" width="696" height="396" />
            <path d="M130 362h540M130 294h540M130 226h540M130 158h540" />
            <path d="M210 95v310M330 95v310M450 95v310M570 95v310" />
            <path d="M190 342L298 216L402 276L518 150L650 318" />
          </svg>
        )}
        <div className="absolute inset-0 bg-midnight/10" aria-hidden />
        <div className="absolute bottom-5 left-5 border-l-2 border-orange pl-4">
          <p className="text-2xl font-bold uppercase leading-none tracking-[-0.05em] text-paper">
            1B
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-orange">
            Tokens club
          </p>
        </div>
      </div>

      <figcaption>
        <p className="text-xl font-bold uppercase leading-none tracking-[-0.04em]">
          {title}
        </p>
        <p className="mt-3 max-w-prose text-sm font-medium leading-relaxed text-paper/64">
          {subtitle}
        </p>
      </figcaption>
    </figure>
  );
}
