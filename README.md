# LumiCare Vitamin C Serum COD Funnel

This is a complete Cash On Delivery sales funnel built with Next.js App Router and Tailwind CSS.

## Tech Stack

- Next.js App Router for the landing page, checkout page, thank-you page, and `/api/order`
- Tailwind CSS for responsive premium beauty styling
- Google Sheets API for server-side order storage
- Nodemailer with SMTP for business and customer email notifications
- Zod for backend order validation

## Order Flow

1. Customer chooses quantity on the landing page.
2. The product name, quantity, price per piece, delivery fee, and total price are passed to `/checkout` in the URL.
3. The checkout page auto-fills the order summary and collects name, phone, email, and exact location.
4. The form sends JSON to `POST /api/order`.
5. The API validates the data, creates an order ID, adds date/time, sets payment method to `Cash On Delivery`, and status to `New Order`.
6. The API appends the order to Google Sheets.
7. The API sends one order notification email to the business and one confirmation email to the customer.
8. The customer is redirected to `/thank-you` only after the required server actions succeed.

## Environment Variables

Copy `.env.example` to `.env.local` for local testing or add these variables in Vercel.

```env
NEXT_PUBLIC_SITE_URL=
BUSINESS_EMAIL=suman.kc0888@gmail.com
EMAIL_FROM=suman.kc0888@gmail.com
BRAND_NAME=LumiCare Vitamin C Serum

GOOGLE_SHEET_ID=
GOOGLE_SHEET_TAB_NAME=Sheet1
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=

EMAIL_SERVICE_API_KEY=

FRONTEND_URL=
```

For Gmail SMTP, use an app password for `SMTP_PASS`. Do not use your normal Gmail account password.

## Google Spreadsheet Setup

1. Create a Google Spreadsheet.
2. Rename the tab to `Sheet1` or update `GOOGLE_SHEET_TAB_NAME`.
3. Add these columns in row 1:

```text
Order ID
Date & Time
Customer Name
Phone Number
Email Address
Exact Location
Product Name
Quantity
Price Per Piece
Total Price
Payment Method
Order Status
Notes
```

4. Select the header row and enable filters from Data > Create a filter.
5. For the `Order Status` column, add a dropdown with:
   `New Order`, `Order Confirmed`, `Order Ongoing`, `Delivered`, `Cancelled`.
6. Get the Sheet ID from the spreadsheet URL. It is the long value between `/d/` and `/edit`.
7. Create a Google Cloud service account and enable the Google Sheets API.
8. Add the service account email to `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
9. Add the private key to `GOOGLE_PRIVATE_KEY`. Keep newline characters escaped as `\n` in Vercel.
10. Share the spreadsheet with the service account email and give it Editor access.

## How To Test

1. Install dependencies:

```bash
npm install
```

2. Add `.env.local` with valid Google and SMTP credentials.
3. Start the dev server:

```bash
npm run dev
```

4. Visit `http://localhost:3000`.
5. Place a test order from the checkout page.
6. Confirm:
   - A new row appears in Google Sheets.
   - The business email receives the order notification.
   - The customer email receives the order received notification.
   - The browser redirects to the thank-you page.

If credentials are missing or invalid, the checkout shows a clear error and does not redirect.

## Deploy On Vercel

1. Push the project to GitHub or import the folder into Vercel.
2. Add every variable from `.env.example` in Vercel Project Settings > Environment Variables.
3. Set `FRONTEND_URL` and `NEXT_PUBLIC_SITE_URL` to your production domain, for example `https://your-domain.vercel.app`.
4. Deploy.
5. Place one test order on the live domain and verify the Google Sheet row and both emails.

## Product Notes

- Reels are intentionally not included because no reel links were provided.
- Testimonials are marked as demo content on the page.
- Delivery is free for orders worth `Rs 8,000` or more; otherwise the delivery fee is `Rs 150`.
- The visible logo is a lightweight text-and-icon brand mark created directly in the UI for fast loading.
