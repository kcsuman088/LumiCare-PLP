import { Suspense } from "react";
import { CheckoutForm } from "@/components/CheckoutForm";
import { Header } from "@/components/Logo";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div className="pt-4">
            <div className="text-sm font-black uppercase tracking-[0.2em] text-orchid">Secure COD checkout</div>
            <h1 className="mt-3 font-display text-5xl font-bold leading-tight text-ink">Place your order.</h1>
            <p className="mt-5 text-base leading-7 text-ink/68">
              Fill in your details and submit your order. Your product, quantity, price per piece, and total price are filled automatically from your landing page selection.
            </p>
            <div className="mt-8 rounded-3xl border border-orchid/10 bg-white p-6 shadow-sm">
              <div className="font-black text-ink">Cash On Delivery</div>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                You do not need to pay online. Our sales representative will call you soon to confirm the order and delivery details.
              </p>
            </div>
          </div>

          <div className="rounded-[32px] border border-white bg-white/78 p-5 shadow-soft sm:p-8">
            <Suspense fallback={<div className="text-sm font-semibold text-ink/60">Loading checkout...</div>}>
              <CheckoutForm />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
