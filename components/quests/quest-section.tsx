export function QuestSection({
  title,
  label,
  content,
  bullets,
  index,
  id,
}: {
  title: string;
  label?: string;
  content?: string;
  bullets?: string[];
  index: number;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-24 grid gap-3 border-t border-divider py-6 lg:grid-cols-[150px_1fr] lg:gap-6">
      <div>
        <p className="font-pixel text-[11px] text-accent">
          {String(index).padStart(2, "0")}{label ? ` · ${label}` : ""}
        </p>
        <h2 className="mt-1 text-[16px] font-bold leading-6">{title}</h2>
      </div>

      <div>
        {content && (
          <p className="max-w-3xl text-[15px] leading-[26px] text-muted">
            {content}
          </p>
        )}

        {bullets && bullets.length > 0 && (
          <ul className={content ? "mt-4 space-y-2" : "space-y-2"}>
            {bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3 text-[15px] leading-[26px]">
                <span className="mt-[10px] h-1.5 w-1.5 shrink-0 bg-accent" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
