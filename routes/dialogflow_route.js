const express = require('express');
const router = express.Router();

const { getGoogleURL, createGoogleSheetId, updateGoogleSheetId } = require('../service/google-spreadsheet-service');
const { typhoonAI } = require('../service/typhoon-ai-service')
const { summary, saveLedger } = require('../service/ledger-service');
const { BuildData } = require('../helper/helper');


router.post('/typhoon-ai', async (req, res) => {
    let data = BuildData(req, res)
    let result = await typhoonAI(data.text);
    console.log(result)
    res.send({ fulfillmentText: result });
});

router.get('/get-user-google-spreadsheet', async (req, res) => {
    let data = BuildData(req, res)
    let result = await getGoogleURL(data.uid);
    console.log(result)
    res.send({ fulfillmentText: result });
});

router.post('/creat-user-google-spreadsheet', async (req, res) => {
    let data = BuildData(req, res)
    let result = await createGoogleSheetId(data);
    console.log(result)
    res.send({ fulfillmentText: result });
});

router.put('/update-user-google-spreadsheet', async (req, res) => {
    let data = BuildData(req, res)
    let result = await updateGoogleSheetId(data);
    console.log(result)
    res.send({ fulfillmentText: result });
});

router.post('/income', async (req, res) => {
    let result = await saveLedger(req);
    console.log(result)
    res.send({ fulfillmentText: result });
});

router.post('/expense', async (req, res) => {
    let data = BuildData(req, res)
    let result = await saveLedger(data);
    console.log(result)
    res.send({ fulfillmentText: result });
});

router.post('/summary', async (req, res) => {
    let data = BuildData(req, res)
    let result = await summary(data);
    console.log(result)
    res.send({ fulfillmentText: result });
});
module.exports = {
    router
};
