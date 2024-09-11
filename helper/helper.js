const { GoogleSpreadsheet } = require("google-spreadsheet");
require("dotenv").config();

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const { RESPONSES_SHEET_ID } = process.env;
const { GOOGLE_SPREADSHEET_ID } = process.env;

//Function Helper
function BuildData(req, res) {
    let data;
    try {
        let intentName = req.body.queryResult.intent.displayName;
        const uid =
            req.body.originalDetectIntentRequest.payload.data.source.userId;
        let text = req.body.queryResult.queryText;
        data = { uid: uid, text: text, intent: intentName };
    } catch (error) {
        console.error("Error to build data : ", error.message);
        res.send({ fulfillmentText: "เกิดข้อผิดพลาด(1)" });
    }
    console.log(data);
    return data;
}

function BuildLedgerData(req) {
    let data;
    try {
        const uid = req.body.originalDetectIntentRequest.payload.data.source.userId;
        let text = req.body.queryResult.queryText;
        let income = req.body.parameters.income?.amount || 0;  
        let expense = req.body.parameters.expense?.amount || 0;  
        let date = req.body.parameters?.Date
        data = {
            income: income,
            expense: expense,
            date: date,
            text: text,
            uid: uid,
        };
    } catch (error) {
        console.error("Error building data: ", error.message);
        return null;
    }
    console.log(data);
    return data;
}

async function AuthenticateDoc(spreadsheetId) {
    const doc = new GoogleSpreadsheet(spreadsheetId);
    try {
        await doc.useServiceAccountAuth({
            client_email: CREDENTIALS.client_email,
            private_key: CREDENTIALS.private_key,
        });
        await doc.loadInfo();
    } catch (error) {
        console.error("Error accessing the spreadsheet:", error.message);
        return null;
    }
    return doc;
}

function ErrorHandle(object) {
    try {
        object();
    } catch (error) {
        console.log("Error ", error.message);
        return null;
    }
    return object();
}

async function AsyncErrorHandle(object) {
    try {
        await object();
    } catch (error) {
        console.log("Error ", error.message);
        return null;
    }
    return await object();
}

const getUserGoogleURL = async (uid) => {
    const doc = await AuthenticateDoc(RESPONSES_SHEET_ID);
    const sheet = ErrorHandle(function () {
        return doc.sheetsById[GOOGLE_SPREADSHEET_ID];
    });
    if (sheet == null) return null;

    const rows = await sheet.getRows();
    const row = rows.find((row) => row.UID == uid);
    return row ? row.Google_URL : null;
};

const getSpreadsheetIdFromURL = (googleURL) => {
    const parts = googleURL.split("/d/");
    return parts[1] ? parts[1].split("/")[0] : null;
};

// Custom Method

String.prototype.UndefinedHandle = function () {
    if (this == undefined) return null;
    return this;
};

module.exports = {
    BuildData,
    AuthenticateDoc,
    ErrorHandle,
    AsyncErrorHandle,
    getUserGoogleURL,
    getSpreadsheetIdFromURL,
    BuildLedgerData,
};
