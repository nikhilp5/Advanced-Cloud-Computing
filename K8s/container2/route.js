const express = require("express");
const router = express.Router();
const csv = require("csv-parser");
const fs = require("fs");

router.post("/", (req, res) => {
    //container 2 api
  try {
    const filePath = req.body.file;
    const product = req.body.product;
    let totalSum = 0;
    let headerData = [];
    let dataResult = [];
    let count = 0;
    fs.createReadStream("/nikhil_PV_dir/" + filePath)
      .pipe(csv())
      .on("headers", (headers) => {
        headerData = headers;
      })
      .on("data", (data) => {
        dataResult.push(data);
      })
      .on("end", () => {
        if (
          headerData.length === 2 &&
          headerData[0] === "product" &&
          headerData[1] === "amount"
        ) {
          for (let i = 0; i < dataResult.length; i++) {
            count = count + 1;
            if (
              Object.keys(dataResult[i]).length == 2 &&
              dataResult[i].product &&
              dataResult[i].amount &&
              !isNaN(dataResult[i].amount)
            ) {
              if (dataResult[i].product === product) {
                totalSum = totalSum + parseInt(dataResult[i].amount);
              }
              if (count === dataResult.length) {
                res.status(200).json({
                  file: filePath,
                  sum: totalSum.toString(),
                });
              }
            } else {
              res.status(200).json({
                file: filePath,
                error: "Input file not in CSV format.",
              });
              return;
            }
          }
        } else {
          res.status(200).json({
            file: filePath,
            error: "Input file not in CSV format.",
          });
          return;
        }
      });
  } catch (err) {
    res.status(200).json({
      file: filePath,
      error: "Input file not in CSV format.",
    });
    return;
  }
});

module.exports = router;
