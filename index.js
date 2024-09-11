const express = require('express');
require('dotenv').config();

const data = express();

const { PORT } = process.env;

data.use(express.urlencoded({ extended: true }));
data.use(express.json());
data.use((req, res, next) => {
    console.log(`Path ${req.path} with Method ${req.method}`);
    next();
});

const dialogflowRoute = require('./routes/dialogflow_route');

data.use(dialogflowRoute.router);

data.listen(parseInt(PORT), () => {
    console.log(`Server is up and running at ${PORT}`)
});