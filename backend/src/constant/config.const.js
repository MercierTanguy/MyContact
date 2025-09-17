const dotenv = require("dotenv")
const dotenvExpand = require('dotenv-expand')
dotenvExpand.expand(dotenv.config())

const db_url = process.env.MONGO_URI || ""
const host = process.env.HOST || "localhost"
const port = process.env.PORT || 5000
const jwt_secret = process.env.JWT_SECRET || "JWT"

module.exports = { db_url, host, port, jwt_secret }