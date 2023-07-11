const express = require("express");
const router = express.Router();
const mysql = require("mysql");

router.post("/store-products", async (req, res) => {
  let connection = mysql.createConnection({
    host: "host",
    user: "user",
    password: "password",
    database: "db",
    port: "3306",
  });
  try {
    const productsArray = req.body.products;
    productsArray.forEach((product) => {
      let stmt = `INSERT INTO products(name,price,availability)
            VALUES(?,?,?)`;
      let values = [product.name, product.price, product.availability];
      connection.query(stmt, values, (error, results, fields) => {
        if (error) {
          throw error;
        }
      });
    });
    return res.status(200).json({
      message: "Success.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error.",
    });
  } finally {
    connection.end();
  }
});

router.get("/list-products", async (req, res) => {
  let connection = mysql.createConnection({
    host: "host",
    user: "user",
    password: "password",
    database: "db",
    port: "3306",
  });
  try {
    let stmt = `select * from products`;
    connection.query(stmt, (error, results, fields) => {
      if (error) {
        throw error;
      }
      return res.status(200).json({ products: results });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error.",
    });
  } finally {
    connection.end();
  }
});
module.exports = router;
