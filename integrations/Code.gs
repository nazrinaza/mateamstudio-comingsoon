// Set SPREADSHEET_ID and NEWSLETTER_SECRET in Project Settings > Script properties.
// Deploy as a web app: execute as Me; access Anyone. Keep the sheet private.
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var data = JSON.parse(e.postData.contents);
    var props = PropertiesService.getScriptProperties();
    var secret = props.getProperty('NEWSLETTER_SECRET');
    if (!secret || data.secret !== secret || data.consent !== true) return result_({ok:false});
    var email = String(data.email || '').trim().toLowerCase();
    if (email.length > 254 || !/^[a-z0-9][a-z0-9.!#$%&'*+/=?^_`{|}~-]*@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(email)) return result_({ok:false});
    lock.waitLock(10000);
    var book = SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID'));
    var sheet = book.getSheetByName('Subscribers') || book.insertSheet('Subscribers');
    if (sheet.getLastRow() === 0) sheet.appendRow(['Subscribed at (UTC)', 'Email', 'Consent', 'Source']);
    if (sheet.getLastRow() > 1 && sheet.getRange(2,2,sheet.getLastRow()-1,1).createTextFinder(email).matchEntireCell(true).matchCase(false).useRegularExpression(false).findNext()) return result_({ok:true});
    sheet.appendRow([new Date().toISOString(), email, 'Newsletter consent v1', 'mateamstudio.com landing page']);
    SpreadsheetApp.flush();
    return result_({ok:true});
  } catch (_) { return result_({ok:false}); }
  finally { if (lock.hasLock()) lock.releaseLock(); }
}
function result_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
