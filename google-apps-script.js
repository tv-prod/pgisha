// קוד לחיבור הטופס ל-Google Sheets ומייל אוטומטי
// ==============================================
// 1. פתח את קובץ ה-Google Sheets שלך
// 2. בתפריט למעלה לחץ על: Extensions (הרחבות) -> Apps Script
// 3. מחק את כל מה שכתוב שם והדבק את הקוד הבא:

const SHEET_NAME = 'LeadsPgisha'; // חובה לוודא שזה השם המדויק של הגיליון למטה במסך (או Sheet1 באנגלית)
const NOTIFY_EMAIL = 'tv.prod10@gmail.com'; // המייל שיקבל את ההתראות המייל שלכם (שאליו תקבלו התראות על לידים)

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error("גיליון לא נמצא - ודא ששם הגיליון נכון בקוד");

    // קריאת השדות שנשלחו מהטופס
    const firstName = e.parameter.firstName || '';
    const lastName = e.parameter.lastName || '';
    const phone = e.parameter.phone || '';
    const email = e.parameter.email || '';
    
    // תאריך ושעה
    const date = new Date();
    
    // הוספת השורה לטבלה. זה יכנס לפי הסדר הזה:
    // A=תאריך, B=שם, C=משפחה, D=טלפון, E=מייל, F="", G="", H="", I="no"
    sheet.appendRow([date, firstName, lastName, phone, email, "", "", "", "no"]);

    // שליחת מייל התראה אליכם לתיבת הדואר
    const subject = `ליד חדש מאתר פגישת המראה! - ${firstName} ${lastName}`;
    const message = `
      היי טל וגל, איזה כיף! 
      קיבלתם ליד חדש מפגישת המראה:
      
      שם מלא: ${firstName} ${lastName}
      טלפון: ${phone}
      מייל: ${email}
      
      נשלח בתאריך: ${date.toLocaleString('he-IL')}
      
      (הליד נשמר אוטומטית גם בגוגל שיטס שלכם)
    `;
    
    GmailApp.sendEmail(NOTIFY_EMAIL, subject, message);

    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 4. אחרי שהדבקת, לחץ על הדיסקט הכחול לשמירה (Save)
// 5. לחץ למעלה על הכפתור הכחול "Deploy" -> ואז "New deployment"
// 6. בצד שמאל לחץ על גלגל השיניים ⚙️ ובחר "Web app"
// 7. ב-Description כתוב "Form Submit"
// 8. תחת "Who has access" שנה ל- "Anyone" (חשוב מאוד!)
// 9. לחץ Deploy וייפתח לך חלון אישור גישה (Authorize Access - עקוב אחרי ההוראות ואשר את חשבון הגוגל שלך)
// 10. בסוף תקבל לינק "Web app URL" שמתחיל ב- https://script.google.com/macros/... 
// 11. העתק את הלינק הזה, והדבק אותו בקובץ app.js שלנו בשורה 302 במקום YOUR_GOOGLE_SCRIPT_URL_HERE!
