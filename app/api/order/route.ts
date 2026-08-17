import { NextResponse } from "next/server";
import { appendOrderToSheet } from "@/lib/google-sheets";
import { sendOrderEmails } from "@/lib/email";
import { orderSchema, type PreparedOrder } from "@/lib/order-schema";
import { product } from "@/lib/product";

function getAllowedOrigins() {
  const configuredUrls = [
    process.env.FRONTEND_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined
  ]
    .filter(Boolean)
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  return configuredUrls
    .map((value) => {
      try {
        return new URL(value).origin;
      } catch {
        return value.replace(/\/$/, "");
      }
    })
    .filter(Boolean);
}

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    const allowedOrigins = getAllowedOrigins();
    if (allowedOrigins.length > 0 && origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json({ success: false, error: "Request origin is not allowed." }, { status: 403 });
    }

    const body = await request.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.errors[0]?.message || "Please check the order details and try again."
        },
        { status: 400 }
      );
    }

    const order: PreparedOrder = {
      ...parsed.data,
      productName: parsed.data.productName || product.name,
      orderId: `LC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      dateTime: new Intl.DateTimeFormat("en-NP", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kathmandu"
      }).format(new Date()),
      paymentMethod: "Cash On Delivery",
      orderStatus: "New Order"
    };

    await appendOrderToSheet(order);
    await sendOrderEmails(order);

    return NextResponse.json({ success: true, orderId: order.orderId });
  } catch (error) {
    console.error("Order submission failed", error);
    const message = error instanceof Error ? error.message : "Order submission failed. Please try again.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
