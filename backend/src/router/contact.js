const contactRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const { contactModel } = require("../database/model.js");

const {
    isValidEmail,
    isValidTel,
} = require("../controller/check.js");
const { decodeToken, verifyToken } = require("../middleware/jwt.js");


contactRouter.post("/create", async (req, res) => {
    try {
        const { email, telephone, firstname, lastname } = req.body;

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (!isValidTel(telephone)) {
            return res.status(400).json({ message: "Invalid telephone format" });
        }

        const authHeader = req.headers?.authorization;
        if (!authHeader) return res.status(401).json({ message: "No token provided" });
        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: "No token provided" });
        const decoded = decodeToken(token);
        if (!decoded?.id) return res.status(401).json({ message: "Invalid id" });

        const newContact = new contactModel({ email, telephone, firstname, lastname, creatorId: decoded.id });
        await newContact.save();

        return res.status(201).json({ message: "Contact created" });
    } catch (err) {
        console.error("Create contact error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

contactRouter.get("/liste", async (req, res) => {
    try {
        const authHeader = req.headers?.authorization;
        if (!authHeader) return res.status(401).json({ message: "No token provided" });
        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: "No token provided" });
        const decoded = decodeToken(token);
        if (!decoded?.id) return res.status(401).json({ message: "Invalid token" });

        const contacts = await contactModel.find({ creatorId: decoded.id });
        return res.status(200).json({ contacts });
    } catch (err) {
        console.error("Get contacts error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

contactRouter.patch("/:id", async (req, res) => {
    try {
        const authHeader = req.headers?.authorization;
        if (!authHeader) return res.status(401).json({ message: "No token provided" });
        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: "No token provided" });
        const decoded = decodeToken(token);
        if (!decoded?.id) return res.status(401).json({ message: "Invalid token" });

        const contact = await contactModel.findOne({ _id: req.params.id, creatorId: decoded.id });
        if (!contact) return res.status(404).json({ message: "Contact not found" });

        const updatableFields = ["firstname", "lastname", "email", "telephone"];
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                contact[field] = req.body[field];
            }
        });
        await contact.save();
        return res.status(200).json({ message: "Contact updated", contact });
    } catch (err) {
        console.error("Patch contact error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

contactRouter.delete("/:id", async (req, res) => {
    try {
        const authHeader = req.headers?.authorization;
        if (!authHeader) return res.status(401).json({ message: "No token provided" });
        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: "No token provided" });
        const decoded = decodeToken(token);
        if (!decoded?.id) return res.status(401).json({ message: "Invalid token" });

        const contact = await contactModel.findOneAndDelete({ _id: req.params.id, creatorId: decoded.id });
        if (!contact) return res.status(404).json({ message: "Contact not found" });
        return res.status(200).json({ message: "Contact deleted" });
    } catch (err) {
        console.error("Delete contact error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = { contactRouter };