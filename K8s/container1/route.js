const express = require("express");
const router = express.Router();
const fs = require("fs");
const axios = require("axios");

router.post("/store-file", async (req, res) => {
  //Store file api
  const bodyData = req.body;
  if (bodyData?.file) {
    const filePath = bodyData.file;
    const data = bodyData.data;
    try {
      const lines = data.split("\n").map((line) => line.trim());
      const formattedLines = lines.map((line) => {
        const values = line.split(",").map((value) => value.trim());
        return values.join(",");
      });
      const finalFormattedLines = formattedLines.join("\n");
      fs.writeFileSync("/nikhil_PV_dir/" + filePath, finalFormattedLines);
    } catch (error) {
      console.log(error);
      res.status(200).json({
        file: filePath,
        error: "Error while storing the file to the storage.",
      });
      return;
    }
    res.status(200).json({
      file: filePath,
      message: "Success.",
    });
    return;
  } else {
    res.status(200).json({
      file: null,
      error: "Invalid JSON input.",
    });
    return;
  }
});

router.post("/calculate", async (req, res) => {
  const bodyData = req.body;
  if (bodyData?.file) {
    const filePath = bodyData.file;
    if (fs.existsSync("/nikhil_PV_dir/" + filePath)) {
      //2nd api
      axios
        .post("http://container-connector:3000/", bodyData)
        .then((finalResult) => {
          res.status(200).json(finalResult.data);
          return;
        })
        .catch((err) => {
          res.status(200).json(err.config.data);
          return;
        });
    } else {
      res.status(200).json({
        file: filePath,
        error: "File not found.",
      });
      return;
    }
  } else {
    res.status(200).json({
      file: null,
      error: "Invalid JSON input.",
    });
    return;
  }
});

module.exports = router;
