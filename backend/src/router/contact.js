const contactRouter = require('express').Router()
const crypto = require("node:crypto")
const jwt = require("jsonwebtoken")
const { utilisateurModel } = require('../database/model.js')
const { isValidEmail, isValidTel, isValidPassword, isValidDataObject, isValidPosInt } = require('../controller/check.js')
const { generateToken, verifyToken } = require("../middleware/jwt.js")

contactRouter.post("/login", async (req, res) => {
    const currentContact = {
        email: req.body.email || "",
        password: req.body.password ? crypto.createHash('sha256').update(req.body.password).digest("base64") : "",
    }
    if (!isValidDataObject(currentContact)) {
        return res.status(400).send({ message: "incorrect format contact" })
    }
    utilisateurModel.findOne(currentContact).then(contact => {
        if (!contact) {
            return res.status(400).send({ message: "contact not found" })
        }
        else {
            return res.send(generateToken(contact))
        }
    })
})

contactRouter.post("/register", async (req, res) => {
    const currentContact = {
        firstname: req.body.firstname || "",
        lastname: req.body.lastname || "",
        email: req.body.email || "",
        password: req.body.password ? crypto.createHash('sha256').update(req.body.password).digest("base64") : "",
        age: req.body.age || "",
        telephone: req.body.telephone || "",

    }
    console.log(req.body)
    if (!isValidDataObject(currentContact)) {
        return res.status(400).send({ message: "incorrect format contact" })
    }
    if (!isValidEmail(currentContact.email)) {
        return res.status(400).send({ message: "incorrect mail format" })
    }
    if (!isValidPassword(req.body.password)) {
        return res.status(400).send({ message: "incorrect password format" })
    }
    if (!isValidTel(currentContact.telephone)) {
        return res.status(400).send({ message: "incorrect telephone format" })
    }
    if (!isValidPosInt(currentContact.age)) {
        return res.status(400).send({ message: "incorrect age format" })
    }

    utilisateurModel.findOne({ email: req.body.email }).then(
        data => {
            if (!data) {
                utilisateurModel.create(currentContact).then(
                    contact => {
                        return res.status(200).send(generateToken(contact))
                    }
                )
            } else {
                return res.status(404).send({ message: "already exist" })
            }
        }
    )
})



module.exports = { contactRouter }