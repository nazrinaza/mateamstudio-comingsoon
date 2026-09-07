# Connect the newsletter to Google Sheets

The page is implemented, but does not collect emails until this connection is configured. It never displays a saved confirmation for an unconfirmed write.

1. Create a private Google Sheet in the Google account that will own the mailing list.
2. Open Extensions → Apps Script. Paste Code.gs into the editor.
3. In Project Settings → Script properties, add SPREADSHEET_ID (the ID between /d/ and /edit in the Sheet URL) and NEWSLETTER_SECRET (a long random secret).
4. Deploy → New deployment → Web app. Execute as Me; allow Anyone. Authorize access and copy the /exec URL. The secret authenticates writes; the Sheet remains private.
5. Set the site's server environment variables NEWSLETTER_SCRIPT_URL and NEWSLETTER_SECRET. Use the same secret as step 3. Never put the secret in HTML or browser JavaScript.
6. Submit a test email and verify a row appears in Subscribers. Repeat the same address to check deduplication. Delete the test row afterwards.

Google guide: https://developers.google.com/apps-script/guides/web

The subscriber list stores timestamp, email, consent and source. The page discloses email use and provides an unsubscribe contact. Process unsubscribe requests before sending future newsletters. Newsletter sending itself is not included. Add an email provider and automated unsubscribe handling when sending campaigns.

The temporary page has no confirmed launch date. The company logo, campaign image, registration number and contact details come from the supplied 2025 profiles. Confirm these before public launch. mateamstudio.com DNS is not changed by building this preview.

## Detailed setup

### 1. Prepare the Sheet and script

Create a Sheet named “Mateam Studio Newsletter”. Keep its sharing set to Restricted. Copy the spreadsheet ID from its address:

`https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

Open Extensions → Apps Script. Replace the default code with the contents of this repository's `integrations/Code.gs`, then save. Do not run `doPost` using the editor's Run button: it expects a website request.

### 2. Add private script settings

In Apps Script, open Project Settings (gear icon), then Script properties → Add script property. Add:

| Property | Value |
| --- | --- |
| `SPREADSHEET_ID` | The ID copied from the Sheet URL |
| `NEWSLETTER_SECRET` | A randomly generated secret, preferably 32 random bytes or more |

A password manager can generate the secret. Alternatively, run `openssl rand -hex 32` locally. Save it securely; use exactly the same value on the website server. Do not commit it to GitHub.

### 3. Deploy the script

Choose Deploy → New deployment → Select type → Web app. Set Execute as to **Me**, and Who has access to **Anyone** (including visitors who are not signed in). Authorize the script using the account that owns the Sheet. Copy the deployed URL ending in `/exec`, not `/dev`.

If your Google Workspace administrator prevents anonymous web apps, this approach requires their approval or another backend. Opening the URL directly can show a missing `doGet` error because this script intentionally handles POST submissions only.

### 4. Configure the website server

Set these runtime variables in the hosting environment serving the application:

| Variable | Value |
| --- | --- |
| `NEWSLETTER_SCRIPT_URL` | The deployed Apps Script `/exec` URL |
| `NEWSLETTER_SECRET` | Exactly the same secret saved in Script properties; mark it secret |

For the current Sites preview, these must be configured in that Site's runtime environment. GitHub repository secrets alone do not configure the running Site, and this repository has no GitHub Actions deployment workflow. Supply the web app URL to the site maintainer and enter the secret through the hosting environment's secure secret configuration.

The server reads these values from Cloudflare Workers bindings (`env`). If migrating to another host, configure equivalent server bindings or adapt the server environment lookup. Never move the shared secret into the browser to make static hosting work.

### 5. Verify the complete connection

Submit an email you control through the website. A `Subscribers` tab should be created with timestamp, email, consent and source. The form should confirm that you are on the list. Submit the same email again: it should succeed without adding a duplicate row. Remove the test row afterwards.

If the page says signup is opening soon, the server variables are missing. If it cannot confirm the signup, check the secret matches, the spreadsheet ID is correct, and the script deployment permits anonymous access. Apps Script's Executions panel shows execution failures. Do not include secrets in logs.

After changing Apps Script code, use Deploy → Manage deployments → Edit → New version → Deploy to update the existing `/exec` deployment.
