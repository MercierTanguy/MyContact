const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const { contactRouter } = require("./src/route/contact.js");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
    res.send("Good");
});
app.use("/contact", contactRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));