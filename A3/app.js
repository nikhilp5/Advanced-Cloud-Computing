const express = require("express");
const app = express();
const route = require("./route");
app.use(express.json());
app.use("", route);

module.exports = app;
