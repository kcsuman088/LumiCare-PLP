"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { formatMoney, getOrderTotals, product } from "@/lib/product";

type FieldErrors = Record<string, string>;

export function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuantity = Number(searchParams.get("quantity") || 1);
  const totals = useMemo(() => getOrderTotals(initialQuantity), [initialQuantity]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = new FormData(event.currentTarget);
    const payload = {
      customerName: String(form.get("customerName") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      location: String(form.get("location") || ""),
      productName: product.name,
      quantity: totals.quantity,
      pricePerPiece: totals.pricePerPiece,
      deliveryFee: totals.deliveryFee,
      totalPrice: totals.totalPrice,
      notes: totals.deliveryFee === 0 ? "Free delivery applied" : `Delivery fee: ${formatMoney(totals.deliveryFee)}`
    };

    const nextErrors: FieldErrors = {};
    if (!payload.customerName.trim()) nextErrors.customerName = "Name is required.";
    if (!payload.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (!/^\S+@\S+\.\S+$/.test(payload.email)) nextErrors.email = "Enter a valid email address.";
    if (!payload.location.trim()) nextErrors.location = "Exact location is required.";

    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Order submission failed. Please try again.");
      }

      const params = new URLSearchParams({
        orderId: result.orderId,
        productName: product.name,
        quantity: String(totals.quantity),
        totalPrice: String(totals.totalPrice)
      });
      router.push(`/thank-you?${params.toString()}`);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Order submission failed. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Full Name" name="customerName" error={errors.customerName} autoComplete="name" />
      <Field label="Phone Number" name="phone" error={errors.phone} autoComplete="tel" />
      <Field label="Email Address" name="email" type="email" error={errors.email} autoComplete="email" />
      <label className="block">
        <span className="text-sm font-bold text-ink">Exact Location</span>
        <textarea
          name="location"
          rows={4}
          placeholder="Kindly share your exact location"
          className="focus-ring mt-2 w-full resize-none rounded-2xl border border-orchid/15 bg-white px-4 py-3 text-ink shadow-sm"
        />
        {errors.location ? <span className="mt-1 block text-sm font-semibold text-red-600">{errors.location}</span> : null}
      </label>

      <div className="grid gap-4 rounded-3xl border border-orchid/10 bg-white p-5 sm:grid-cols-2">
        <Summary label="Product Name" value={product.name} />
        <Summary label="Quantity" value={String(totals.quantity)} />
        <Summary label="Price Per Piece" value={formatMoney(totals.pricePerPiece)} />
        <Summary label="Delivery Fee" value={totals.deliveryFee === 0 ? "Free" : formatMoney(totals.deliveryFee)} />
        <Summary label="Total Price" value={formatMoney(totals.totalPrice)} strong />
        <Summary label="Payment Method" value="Cash On Delivery" />
      </div>

      {serverError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {serverError}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="focus-ring w-full rounded-full bg-ink px-6 py-4 text-base font-black text-white shadow-soft transition hover:bg-orchid disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Submitting Order..." : "Order Now"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  autoComplete
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-ink">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        className="focus-ring mt-2 w-full rounded-full border border-orchid/15 bg-white px-4 py-3 text-ink shadow-sm"
      />
      {error ? <span className="mt-1 block text-sm font-semibold text-red-600">{error}</span> : null}
    </label>
  );
}

function Summary({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-[0.16em] text-orchid/80">{label}</div>
      <div className={strong ? "mt-1 text-2xl font-black text-ink" : "mt-1 font-bold text-ink"}>{value}</div>
    </div>
  );
}
