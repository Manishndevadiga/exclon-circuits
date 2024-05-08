const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const url = require("url");

const { connectMongoDB } = require("./connection");
const mongoURI = "mongodb://127.0.0.1:27017/mydb3";
connectMongoDB(mongoURI);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const uploadFiles = require("./routes/uploadFiles");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  const { query } = url.parse(req.url, true);
  req.query = query;
  req.requestTime = new Date();
  next();
});

app.use("/", uploadFiles);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
