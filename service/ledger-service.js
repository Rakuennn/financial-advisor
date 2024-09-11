const { AuthenticateDoc, getSpreadsheetIdFromURL, getUserGoogleURL, BuildLedgerData} = require('../helper/helper');
require('dotenv').config();

const ledger = async (data) => {
    const googleURL = await getUserGoogleURL(data.uid);
    if (!googleURL) return 'คุณยังไม่มีGoogle Sheet หรือลิงก์ของคุณมีปัญหา';

    const spreadsheetId = getSpreadsheetIdFromURL(googleURL);
    if (!spreadsheetId) return 'เกิดข้อผิดพลาดหรือลิงก์ของคุณมีปัญหา';

    const doc = await AuthenticateDoc(spreadsheetId);
    if (!doc) return 'คุณยังไม่มีGoogle Sheet หรือ Google Sheet มีปัญหา';

    const sheet = doc.sheetsByIndex[0];
    await sheet.setHeaderRow(['วันที่', 'รายรับ', 'รายจ่าย', 'ข้อความ']);

    await sheet.addRow({
        วันที่: data.date,
        รายรับ: data.income,
        รายจ่าย: data.expense,
        ข้อความ: data.text
    });

    return "บันทึกเรียบร้อยงับ";
};

const resultLedger = async (data) => {
    const googleURL = await getUserGoogleURL(data.uid);
    if (!googleURL) return 'คุณยังไม่มีGoogle Sheet หรือลิงก์ของคุณมีปัญหา';

    const spreadsheetId = getSpreadsheetIdFromURL(googleURL);
    if (!spreadsheetId) return 'เกิดข้อผิดพลาดหรือลิงก์ของคุณมีปัญหา';

    const doc = await AuthenticateDoc(spreadsheetId);
    if (!doc) return 'คุณยังไม่มีGoogle Sheet หรือ Google Sheet มีปัญหา';

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    let income = 0;
    let expense = 0;

    rows.forEach(row => {
        if (row.วันที่ == data.date) {
            income += parseInt(row.รายรับ || 0);
            expense += parseInt(row.รายจ่าย || 0);
        }
    });

    return `สรุปรายรับรายจ่ายในวันที่ ${data.date}\nรายรับ: ${income}\nรายจ่าย: ${expense}`;
};

const saveLedger = (req) => {
    let newData= BuildLedgerData(req)
    if(!newData)
        return "invalid value"
    return ledger(newData)
}

const summary = (req) => {
    let newData= BuildLedgerData(req)
    if(!newData)
        return "invalid value"
    return resultLedger(newData);
};

module.exports = {
    saveLedger,
    summary
};
