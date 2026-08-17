import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Logo";
import { formatMoney, product } from "@/lib/product";

export default async function ThankYouPage({
  searchParams
}: {
  searchParams: Promise<{ productName?: string; quantity?: string; totalPrice?: string; orderId?: string }>;
}) {
  const params = await searchParams;
  const productName = params.productName || product.name;
  const quantity = Number(params.quantity || 1);
  const totalPrice = Number(params.totalPrice || product.offerPrice);

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <section className="grid min-h-[calc(100vh-76px)] place-items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl rounded-[36px] border border-white bg-white p-8 text-center shadow-soft sm:p-12">
          <CheckCircle2 className="mx-auto h-16 w-16 text-orchid" />
          <h1 className="mt-6 font-display text-5xl font-bold text-ink">Thank you for your order!</h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-ink/65">
            Our sales representative will call you soon to confirm your order.
          </p>
          <div className="mt-8 grid gap-3 rounded-3xl border border-orchid/10 bg-cream p-5 text-left">
            {params.orderId ? <Summary label="Order ID" value={params.orderId} /> : null}
            <Summary label="Product ordered" value={productName} />
            <Summary label="Quantity" value={String(quantity)} />
            <Summary label="Total price" value={formatMoney(totalPrice)} />
            <Summary label="Payment method" value="Cash On Delivery" />
          </div>
          <Link
            href="/"
            className="focus-ring mt-8 inline-flex rounded-full bg-ink px-7 py-4 text-sm font-black text-white shadow-soft transition hover:bg-orchid"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-orchid/10 py-2 last:border-b-0">
      <span className="text-sm font-semibold text-ink/60">{label}</span>
      <span className="text-right text-sm font-black text-ink">{value}</span>
    </div>
  );
}
