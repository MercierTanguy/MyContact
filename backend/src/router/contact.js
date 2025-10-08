const contactRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const { contactModel } = require("../database/model.js");

const {
    isValidEmail,
    isValidTel,
} = require("../controller/check.js");
const { decodeToken } = require("../middleware/jwt.js");

/**
 * @swagger
 * /contact/create:
 *   post:
 *     summary: Create a new contact
 *     tags:
 *       - Contact
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - telephone
 *               - firstname
 *               - lastname
 *             properties:
 *               email:
 *                 type: string
 *               telephone:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /contact/liste:
 *   get:
 *     summary: Get the list of contacts for the authenticated user
 *     tags:
 *       - Contact
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contacts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       telephone:
 *                         type: string
 *                       firstname:
 *                         type: string
 *                       lastname:
 *                         type: string
 *                       creatorId:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

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

/**
 * @swagger
 * /contact/{id}:
 *   patch:
 *     summary: Update a contact by ID
 *     tags:
 *       - Contact
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               telephone:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 contact:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     telephone:
 *                       type: string
 *                     firstname:
 *                       type: string
 *                     lastname:
 *                       type: string
 *                     creatorId:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */

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

/**
 * @swagger
 * /contact/{id}:
 *   delete:
 *     summary: Delete a contact by ID
 *     tags:
 *       - Contact
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The contact ID
 *     responses:
 *       200:
 *         description: Contact deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */

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