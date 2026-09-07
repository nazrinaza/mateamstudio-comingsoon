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
