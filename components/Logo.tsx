import { Sparkles } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white shadow-soft">
        <Sparkles className="h-5 w-5" />
      </div>
      <div>
        <div className="font-display text-xl font-bold leading-none text-ink">LumiCare</div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orchid">
          Vitamin C Serum
        </div>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-cream/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <div className="hidden items-center gap-5 text-sm font-semibold text-ink/75 md:flex">
          <a href="#benefits" className="hover:text-orchid">Benefits</a>
          <a href="#testimonials" className="hover:text-orchid">Reviews</a>
          <a href="#faq" className="hover:text-orchid">FAQ</a>
        </div>
        <a
          href="/lumicare-vitaminC#order"
          className="focus-ring rounded-full border border-orchid/20 bg-white px-4 py-2 text-sm font-bold text-ink shadow-sm transition hover:border-orchid/45"
        >
          Order Now
        </a>
      </div>
    </header>
  );
}
