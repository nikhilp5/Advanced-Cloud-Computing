const express = require("express");
const router = express.Router();
const fs = require("fs");
const axios = require("axios");

router.post("/calculate", async (req, res) => {
  const bodyData = req.body;
  if (bodyData?.file) {
    const filePath = bodyData.file;
    if (fs.existsSync("../../../files/a1/" + filePath)) {
      //2nd api
      axios
        .post("http://app-2:3000/", bodyData)
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
