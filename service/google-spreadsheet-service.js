const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

const { RESPONSES_SHEET_ID } = process.env;
const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID);
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

const getGoogleURL = async(uid) => 
{
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });

    await doc.loadInfo();
    let sheet = doc.sheetsById[648713531];
    let rows = await sheet.getRows();
    let response = '';

    for (let index = 0; index < rows.length; index++) {
        let row = rows[index];
        if (row.UID == uid) {
            response += row.Google_URL;
            break;
        }
    };

    if (response === '') 
        response += 'คุณยังไม่มีGoogle Sheet';
    return response;
}

const createGoogleSheetId = async(data)=>
{
    if(data.uid == null || data.text == null )
        return "Invalid value"

    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });
    
    await doc.loadInfo();
    let sheet = doc.sheetsById[648713531];
    let rows = await sheet.getRows();

    for (let index = 0; index < rows.length; index++) 
    {
        let row = rows[index];
        if (row.UID == data.uid) 
            return "You already have Google Sheet ID";
    };

    await sheet.addRow({
        UID:data.uid,
        Google_URL:data.text
    })
    return "Add Google Sheet success"
}

const updateGoogleSheetId = async(data) =>
{
    if(data.uid || data.text )
        return "Invalid value"

    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });
    
    await doc.loadInfo();
    let sheet = doc.sheetsById[648713531];
    let rows = await sheet.getRows();

    for (let index = 0; index < rows.length; index++) 
    {
        let row = rows[index];
        if (row.UID == data.uid)
        {
            row.set('Google_URL',data.text)
            await row.save();
            return "Update Google Sheet success"
        }
    };
    return "เกิดข้อผิดพลาด หรือ คุณยังไม่สร้างGoogle Sheet"
}
module.exports = {
    getGoogleURL,
    createGoogleSheetId,
    updateGoogleSheetId
};