import { google } from "googleapis";
import type { PreparedOrder } from "./order-schema";

const sheetColumns = [
  "Order ID",
  "Date & Time",
  "Customer Name",
  "Phone Number",
  "Email Address",
  "Exact Location",
  "Product Name",
  "Quantity",
  "Price Per Piece",
  "Total Price",
  "Payment Method",
  "Order Status",
  "Notes"
];

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizePrivateKey(value: string) {
  let trimmed = value.trim();

  const jsonStyleMatch = trimmed.match(/"private_key"\s*:\s*"([\s\S]*?)"\s*,?$/);
  if (jsonStyleMatch?.[1]) {
    trimmed = jsonStyleMatch[1];
  }

  const unquoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed;

  const normalized = unquoted
    .replace(/,$/, "")
    .replace(/\\\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .trim();

  if (!normalized.includes("-----BEGIN PRIVATE KEY-----") || !normalized.includes("-----END PRIVATE KEY-----")) {
    throw new Error("GOOGLE_PRIVATE_KEY is not a valid service-account private key.");
  }

  return normalized;
}

async function getSheetId(sheets: ReturnType<typeof google.sheets>, spreadsheetId: string, tabName: string) {
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const target = spreadsheet.data.sheets?.find((sheet) => sheet.properties?.title === tabName);
  const sheetId = target?.properties?.sheetId;
  if (typeof sheetId !== "number") {
    throw new Error(`Google Sheet tab "${tabName}" was not found.`);
  }
  return sheetId;
}

async function prepareSheetLayout(sheets: ReturnType<typeof google.sheets>, spreadsheetId: string, tabName: string) {
  const sheetId = await getSheetId(sheets, spreadsheetId, tabName);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `'${tabName}'!A1:M1`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [sheetColumns]
    }
  });

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          updateSheetProperties: {
            properties: {
              sheetId,
              gridProperties: {
                frozenRowCount: 1
              }
            },
            fields: "gridProperties.frozenRowCount"
          }
        },
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: sheetColumns.length
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.55, green: 0.37, blue: 0.69 },
                textFormat: {
                  foregroundColor: { red: 1, green: 1, blue: 1 },
                  bold: true
                },
                horizontalAlignment: "CENTER",
                verticalAlignment: "MIDDLE",
                wrapStrategy: "WRAP"
              }
            },
            fields:
              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)"
          }
        },
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: sheetColumns.length
            },
            cell: {
              userEnteredFormat: {
                verticalAlignment: "MIDDLE",
                wrapStrategy: "WRAP",
                textFormat: {
                  foregroundColor: { red: 0.17, green: 0.14, blue: 0.19 }
                }
              }
            },
            fields: "userEnteredFormat(verticalAlignment,wrapStrategy,textFormat)"
          }
        },
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId,
              dimension: "COLUMNS",
              startIndex: 0,
              endIndex: sheetColumns.length
            }
          }
        },
        {
          setDataValidation: {
            range: {
              sheetId,
              startRowIndex: 1,
              startColumnIndex: 11,
              endColumnIndex: 12
            },
            rule: {
              condition: {
                type: "ONE_OF_LIST",
                values: [
                  { userEnteredValue: "New Order" },
                  { userEnteredValue: "Order Confirmed" },
                  { userEnteredValue: "Order Ongoing" },
                  { userEnteredValue: "Delivered" },
                  { userEnteredValue: "Cancelled" }
                ]
              },
              showCustomUi: true,
              strict: true
            }
          }
        }
      ]
    }
  });
}

export async function appendOrderToSheet(order: PreparedOrder) {
  const spreadsheetId = requiredEnv("GOOGLE_SHEET_ID");
  const clientEmail = requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = normalizePrivateKey(requiredEnv("GOOGLE_PRIVATE_KEY"));
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME || "Sheet1";

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });
  const range = `'${tabName}'!A:M`;

  await prepareSheetLayout(sheets, spreadsheetId, tabName);

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          order.orderId,
          order.dateTime,
          order.customerName,
          order.phone,
          order.email,
          order.location,
          order.productName,
          order.quantity,
          order.pricePerPiece,
          order.totalPrice,
          order.paymentMethod,
          order.orderStatus,
          order.notes
        ]
      ]
    }
  });
}

export { sheetColumns };
