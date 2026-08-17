import nodemailer from "nodemailer";
import type { PreparedOrder } from "./order-schema";
import { formatMoney } from "./product";

function env(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function emailShell(content: string) {
  const brand = process.env.BRAND_NAME || "LumiCare Vitamin C Serum";
  return `
    <div style="margin:0;padding:0;background:#fff9f4;font-family:Arial,Helvetica,sans-serif;color:#2c2430;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fff9f4;padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #f2dbe5;border-radius:18px;overflow:hidden;">
              <tr>
                <td style="background:#8d5eaf;padding:24px 28px;color:#ffffff;">
                  <div style="font-size:24px;font-weight:700;letter-spacing:.2px;">${brand}</div>
                  <div style="font-size:13px;opacity:.9;margin-top:4px;">Cash On Delivery skincare order</div>
                </td>
              </tr>
              <tr>
                <td style="padding:28px;">
                  ${content}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function row(label: string, value: string | number) {
  return `
    <tr>
      <td style="padding:10px 0;color:#71636f;font-size:14px;">${label}</td>
      <td align="right" style="padding:10px 0;color:#2c2430;font-size:14px;font-weight:700;">${value}</td>
    </tr>
  `;
}

export function businessOrderEmail(order: PreparedOrder) {
  return emailShell(`
    <h1 style="margin:0 0 10px;font-size:26px;line-height:1.25;color:#2c2430;">New product order received</h1>
    <p style="margin:0 0 22px;color:#71636f;font-size:15px;line-height:1.6;">A customer has placed a new Cash On Delivery order. Please call the customer soon to confirm this order.</p>
    <div style="display:inline-block;background:#f7c8d4;color:#5a2c45;border-radius:999px;padding:8px 12px;font-weight:700;font-size:13px;">${order.orderStatus}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:22px;border-top:1px solid #f2dbe5;border-bottom:1px solid #f2dbe5;">
      ${row("Order ID", order.orderId)}
      ${row("Date & Time", order.dateTime)}
      ${row("Customer Name", order.customerName)}
      ${row("Phone Number", order.phone)}
      ${row("Email Address", order.email)}
      ${row("Exact Location", order.location)}
      ${row("Product Name", order.productName)}
      ${row("Quantity", order.quantity)}
      ${row("Price Per Piece", formatMoney(order.pricePerPiece))}
      ${row("Total Price", formatMoney(order.totalPrice))}
      ${row("Payment Method", order.paymentMethod)}
    </table>
    <div style="margin-top:22px;background:#fff2f6;border:1px solid #f2dbe5;border-radius:14px;padding:16px;color:#5a2c45;font-weight:700;">Please call the customer soon to confirm this order.</div>
  `);
}

export function customerOrderEmail(order: PreparedOrder) {
  const brand = process.env.BRAND_NAME || "LumiCare Vitamin C Serum";
  const supportEmail = process.env.EMAIL_FROM || process.env.BUSINESS_EMAIL || "";
  return emailShell(`
    <h1 style="margin:0 0 10px;font-size:26px;line-height:1.25;color:#2c2430;">Thank you for your order.</h1>
    <p style="margin:0 0 18px;color:#71636f;font-size:15px;line-height:1.7;">Hi ${order.customerName}, we have received your order successfully. Our sales representative will call you soon to confirm your order.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px;border-top:1px solid #f2dbe5;border-bottom:1px solid #f2dbe5;">
      ${row("Order ID", order.orderId)}
      ${row("Product", order.productName)}
      ${row("Quantity", order.quantity)}
      ${row("Total Price", formatMoney(order.totalPrice))}
      ${row("Payment Method", order.paymentMethod)}
    </table>
    <p style="margin:22px 0 0;color:#71636f;font-size:15px;line-height:1.7;">For support, reply to this email: <strong style="color:#2c2430;">${supportEmail}</strong></p>
    <p style="margin:18px 0 0;color:#2c2430;font-size:15px;font-weight:700;">Thank you,<br />${brand}</p>
  `);
}

export async function sendOrderEmails(order: PreparedOrder) {
  const businessEmail = env("BUSINESS_EMAIL");
  const from = env("EMAIL_FROM");
  const transporter = nodemailer.createTransport({
    host: env("SMTP_HOST"),
    port: Number(env("SMTP_PORT") || 465),
    secure: Number(env("SMTP_PORT") || 465) === 465,
    auth: {
      user: env("SMTP_USER"),
      pass: env("SMTP_PASS")
    }
  });

  await transporter.sendMail({
    from,
    to: businessEmail,
    replyTo: order.email,
    subject: `New Product Order Received - ${order.orderId}`,
    html: businessOrderEmail(order)
  });

  await transporter.sendMail({
    from,
    to: order.email,
    replyTo: from,
    subject: `Your Order Has Been Received - ${process.env.BRAND_NAME || "LumiCare Vitamin C Serum"}`,
    html: customerOrderEmail(order)
  });
}
