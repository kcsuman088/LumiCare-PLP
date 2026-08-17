"use client";

import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatMoney, getOrderTotals, product } from "@/lib/product";

export function QuantityOrder({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const totals = useMemo(() => getOrderTotals(quantity), [quantity]);

  function goToCheckout() {
    const params = new URLSearchParams({
      productName: product.name,
      quantity: String(totals.quantity),
      pricePerPiece: String(totals.pricePerPiece),
      deliveryFee: String(totals.deliveryFee),
      totalPrice: String(totals.totalPrice)
    });
    router.push(`/checkout?${params.toString()}`);
  }

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      <div className="flex items-center justify-between rounded-full border border-orchid/15 bg-white px-3 py-2 shadow-sm">
        <span className="pl-2 text-sm font-bold text-ink/75">Quantity</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Decrease quantity"
            className="focus-ring grid h-9 w-9 place-items-center rounded-full bg-petal text-ink transition hover:bg-blush"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-lg font-black">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            className="focus-ring grid h-9 w-9 place-items-center rounded-full bg-ink text-white transition hover:bg-orchid"
            onClick={() => setQuantity((value) => value + 1)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-orchid/10 bg-white/80 p-4">
        <div className="flex justify-between text-sm text-ink/70">
          <span>Subtotal</span>
          <span>{formatMoney(totals.subtotal)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm text-ink/70">
          <span>Delivery</span>
          <span>{totals.deliveryFee === 0 ? "Free" : formatMoney(totals.deliveryFee)}</span>
        </div>
        <div className="mt-3 flex items-end justify-between border-t border-orchid/10 pt-3">
          <span className="text-sm font-bold text-ink">Total</span>
          <span className="text-2xl font-black text-ink">{formatMoney(totals.totalPrice)}</span>
        </div>
        <p className="mt-2 text-xs font-semibold text-orchid">
          Free delivery on orders worth {formatMoney(product.freeDeliveryThreshold)} or more.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {["Purchase Now", "Order Now", "Buy Now"].map((label) => (
          <button
            key={label}
            type="button"
            onClick={goToCheckout}
            className="focus-ring rounded-full bg-ink px-5 py-3 text-sm font-black text-white shadow-soft transition hover:bg-orchid"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
