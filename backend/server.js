const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const { userRouter } = require("./src/router/user");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Good");
});
app.use('/users', userRouter);

app.use((req, res, next) => {
    return res.status(404).send({ "message": "page not found" })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));