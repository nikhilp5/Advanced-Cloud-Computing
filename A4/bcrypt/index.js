const bcrypt = require("bcryptjs");
const axios = require("axios");

exports.handler = async (event) => {
  const value = event.value;
  const banner = "banner-ID";
  const arn = "lambda-arn";
  const action = event.action;
  try {
    const result = await bcrypt.hash(value, 10); // Hash the input text with a cost factor of 10
    await axios.post(
      "https://v7qaxwoyrb.execute-api.us-east-1.amazonaws.com/default/end",
      { banner, result, arn, action, value }
    );
    return { banner, result, arn, action, value };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Error: Failed to hash the text",
    };
  }
};
