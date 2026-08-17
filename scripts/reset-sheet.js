const { loadEnvConfig } = require("@next/env");
const { google } = require("googleapis");

loadEnvConfig(process.cwd());

function normalizePrivateKey(value) {
  let key = String(value || "").trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, "\n");
}

async function main() {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const title = process.env.GOOGLE_SHEET_TAB_NAME || "Sheet1";
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sheet = meta.data.sheets.find((item) => item.properties.title === title);
  if (!sheet) throw new Error(`Sheet tab not found: ${title}`);

  const sheetId = sheet.properties.sheetId;
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `'${title}'!A:M`
  });

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          updateSheetProperties: {
            properties: { sheetId, gridProperties: { frozenRowCount: 0 } },
            fields: "gridProperties.frozenRowCount"
          }
        },
        {
          repeatCell: {
            range: { sheetId, startRowIndex: 0, startColumnIndex: 0, endColumnIndex: 13 },
            cell: { userEnteredFormat: {}, dataValidation: null },
            fields: "userEnteredFormat,dataValidation"
          }
        }
      ]
    }
  });

  console.log(`Cleared values, formatting, frozen header, and dropdowns from ${title}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
