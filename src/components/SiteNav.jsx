export function SiteNav({ variant = "light" }) {
  const isDark = variant === "dark";
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 px-6 md:px-8 py-5 flex items-center justify-between backdrop-blur-md ${
        isDark
          ? "bg-ink/40 text-white"
          : "bg-base/70 text-ink border-b border-ink/5"
      }`}
    >
      <a href="/" className="flex items-center gap-3.5 group" aria-label="Ascent & Co. home">
        <span
          className="size-11 bg-accent flex items-center justify-center shadow-sm shrink-0 group-hover:rotate-3 transition-transform"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 20 L12 4 L21 20 Z" fill="white" />
            <path d="M9 12 L12 9 L15 13" stroke="var(--accent)" strokeWidth="1.5" />
          </svg>
        </span>
        <span className="flex flex-col justify-center leading-none">
          <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[1.65rem] leading-none tracking-tight">
            Ascent <span className="italic font-medium text-accent">&amp;</span> Co.
          </span>
          <span className="mt-2 flex items-center gap-2.5">
            <span className="h-px w-4 bg-accent/30" aria-hidden="true" />
            <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-60 leading-none whitespace-nowrap">
              Himalayan Expeditions
            </span>
          </span>
        </span>
      </a>
      <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em]">
        <a href="#services" className="hover:text-accent transition-colors">Services</a>
        <a href="#process" className="hover:text-accent transition-colors">How it works</a>
        <a href="#/guide" className="hover:text-accent transition-colors">Guide</a>
        <a href="#treks" className="hover:text-accent transition-colors">Expeditions</a>
        <a href="#/chat?tab=advisor" className="hover:text-accent transition-colors">AI Advisor</a>
      </div>
      <a
        href="#/chat"
        className="text-[10px] font-bold uppercase tracking-widest bg-accent text-white px-4 py-2 rounded-full hover:brightness-110 transition-all"
      >
        Plan Expedition
      </a>
    </nav>
  );
}
