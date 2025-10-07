const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger.js");
const { userRouter } = require("./src/router/user");
const { contactRouter } = require("./src/router/contact");
dotenv.config();

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Good");
});
app.use('/users', userRouter);

app.use('/contact', contactRouter);

app.use((req, res, next) => {
    return res.status(404).send({ "message": "page not found" })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));