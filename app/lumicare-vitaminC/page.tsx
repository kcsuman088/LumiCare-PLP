import Image from "next/image";
import { ArrowRight, BadgeCheck, Headphones, PackageCheck, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Header } from "@/components/Logo";
import { ProductGallery } from "@/components/ProductGallery";
import { QuantityOrder } from "@/components/QuantityOrder";
import { formatMoney, product } from "@/lib/product";

const trustItems = [
  { icon: PackageCheck, label: "Cash on Delivery" },
  { icon: Truck, label: "Fast delivery" },
  { icon: Headphones, label: "Customer support" },
  { icon: ShieldCheck, label: "Easy order process" }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream">
      <Header />

      <section className="relative overflow-hidden border-b border-white">
        <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orchid/15 bg-white px-4 py-2 text-sm font-bold text-orchid shadow-sm">
              <Sparkles className="h-4 w-4" />
              Order within 24 hours: {product.phone}
            </div>
            <h1 className="font-display text-5xl font-bold leading-tight text-ink sm:text-6xl lg:text-7xl">
              Vitamin C Glow Serum
            </h1>
            <p className="mt-5 text-xl font-semibold leading-8 text-ink/78">
              Brighter-looking, fresher-feeling skin with a lightweight daily serum made for a healthy glow.
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink/68">{product.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#order"
                className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-black text-white shadow-soft transition hover:bg-orchid"
              >
                Purchase Now <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#order"
                className="focus-ring rounded-full border border-orchid/20 bg-white px-6 py-4 text-sm font-black text-ink shadow-sm transition hover:border-orchid/50"
              >
                Order Now
              </a>
            </div>
            <div className="mt-9 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {trustItems.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white bg-white/70 p-4 shadow-sm">
                  <item.icon className="h-5 w-5 text-orchid" />
                  <div className="mt-2 text-sm font-bold text-ink">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <Image
              src={product.images[0].src}
              alt={product.images[0].alt}
              width={900}
              height={1120}
              priority
              className="mx-auto max-h-[72vh] w-full max-w-[560px] rounded-[36px] object-cover shadow-soft"
            />
          </div>
        </div>
      </section>

      <section id="order" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <ProductGallery />
          <div>
            <div className="text-sm font-black uppercase tracking-[0.2em] text-orchid">Glow serum offer</div>
            <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
              Fresh glow, simple routine, premium feel.
            </h2>
            <p className="mt-4 text-base leading-7 text-ink/68">{product.description}</p>
            <div className="mt-6 flex flex-wrap items-end gap-3">
              <span className="text-4xl font-black text-ink">{formatMoney(product.offerPrice)}</span>
              <span className="pb-1 text-lg font-bold text-ink/45 line-through">{formatMoney(product.regularPrice)}</span>
            </div>
            <ul className="mt-7 grid gap-3">
              {product.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm font-semibold text-ink/78">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-orchid" />
                  {benefit}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <QuantityOrder />
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="border-y border-white bg-white/45 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <div className="text-sm font-black uppercase tracking-[0.2em] text-orchid">Why buy this product</div>
            <h2 className="mt-3 font-display text-4xl font-bold text-ink sm:text-5xl">Daily skincare that feels light and looks luminous.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {product.benefits.map((benefit) => (
              <div key={benefit} className="rounded-3xl border border-orchid/10 bg-white p-5 shadow-sm">
                <Sparkles className="h-6 w-6 text-orchid" />
                <p className="mt-4 text-sm font-bold leading-6 text-ink">{benefit}</p>
              </div>
            ))}
          </div>
          <a
            href="#order"
            className="focus-ring mt-10 inline-flex rounded-full bg-ink px-7 py-4 text-sm font-black text-white shadow-soft transition hover:bg-orchid"
          >
            Buy Now
          </a>
        </div>
      </section>

      <section id="testimonials" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.2em] text-orchid">Customer testimonials</div>
              <h2 className="mt-3 font-display text-4xl font-bold text-ink sm:text-5xl">Loved for its light, fresh feel.</h2>
            </div>
            <p className="max-w-md text-sm font-semibold text-ink/55">Demo content for this learning website, clearly labeled until replaced with real customer reviews.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {product.testimonials.map((item) => (
              <article key={item.name} className="rounded-3xl border border-orchid/10 bg-white p-6 shadow-sm">
                <div className="mb-5 inline-flex rounded-full bg-petal px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-orchid">
                  Demo testimonial
                </div>
                <p className="text-sm font-semibold leading-7 text-ink/76">"{item.quote}"</p>
                <div className="mt-6 font-black text-ink">{item.name}</div>
                <div className="text-sm text-ink/55">{item.location}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-y border-white bg-white/45 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="text-sm font-black uppercase tracking-[0.2em] text-orchid">FAQ</div>
            <h2 className="mt-3 font-display text-4xl font-bold text-ink sm:text-5xl">Quick answers before you order.</h2>
          </div>
          <div className="mt-10 divide-y divide-orchid/10 overflow-hidden rounded-3xl border border-orchid/10 bg-white shadow-sm">
            {product.faqs.map((faq) => (
              <details key={faq.question} className="group p-6">
                <summary className="cursor-pointer list-none text-base font-black text-ink">
                  <span className="flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-2xl text-orchid group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-ink/65">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-display text-4xl font-bold text-ink sm:text-6xl">Ready for a brighter-looking glow?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-ink/68">
            Order today with Cash on Delivery. Our team will call you soon to confirm your order within 24 hours.
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <QuantityOrder compact />
          </div>
        </div>
      </section>
    </main>
  );
}
