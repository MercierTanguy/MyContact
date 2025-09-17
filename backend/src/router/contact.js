const contactRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const { contactModel } = require("../database/model.js");

const {
    isValidEmail,
    isValidTel,
} = require("../controller/check.js");
const { generateToken, verifyToken } = require("../middleware/jwt.js");

const normalizeEmail = (e) => (e || "").trim().toLowerCase();