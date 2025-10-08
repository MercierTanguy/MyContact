const userRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const { utilisateurModel } = require("../database/model.js");
const {
    isValidEmail,
    isValidTel,
    isValidPassword,
    isValidDataObject,
    isValidPosInt,
} = require("../controller/check.js");
const { generateToken, verifyToken } = require("../middleware/jwt.js");

const normalizeEmail = (e) => (e || "").trim().toLowerCase();
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login, returns JWT token.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token.
 *       400:
 *         description: Bad request.
 *       404:
 *         description: User not found.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: Internal error.
 */
userRouter.post("/login", async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const plainPassword = req.body.password || "";

        const currentUser = { email, password: plainPassword };
        if (!isValidDataObject(currentUser) || !isValidEmail(email)) {
            return res.status(400).json({ message: "incorrect format user" });
        }

        const user = await utilisateurModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "user not found" });

        const ok = await bcrypt.compare(plainPassword, user.password);
        if (!ok) return res.status(401).json({ message: "invalid password" });

        const token = generateToken(user);
        return res.json({ token });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "internal error" });
    }
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               age:
 *                 type: integer
 *               telephone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered, returns JWT token.
 *       400:
 *         description: Bad request.
 *       409:
 *         description: User already exists.
 *       500:
 *         description: Internal error.
 */
userRouter.post("/register", async (req, res) => {
    try {
        const currentUser = {
            firstname: (req.body.firstname || "").trim(),
            lastname: (req.body.lastname || "").trim(),
            email: normalizeEmail(req.body.email),
            password: req.body.password || "",
            age: req.body.age,
            telephone: (req.body.telephone || "").trim(),
        };

        if (!isValidDataObject(currentUser)) {
            return res.status(400).json({ message: "incorrect format user" });
        }
        if (!isValidEmail(currentUser.email)) {
            return res.status(400).json({ message: "incorrect mail format" });
        }
        if (!isValidPassword(currentUser.password)) {
            return res.status(400).json({ message: "incorrect password format" });
        }
        if (!isValidTel(currentUser.telephone)) {
            return res.status(400).json({ message: "incorrect telephone format" });
        }
        if (!isValidPosInt(currentUser.age)) {
            return res.status(400).json({ message: "incorrect age format" });
        }
        const exists = await utilisateurModel.findOne({ email: currentUser.email });
        if (exists) return res.status(409).json({ message: "already exist" });

        const hash = await bcrypt.hash(currentUser.password, 10);
        const toCreate = { ...currentUser, password: hash };

        const created = await utilisateurModel.create(toCreate);
        const token = generateToken(created);
        return res.status(201).json({ token });
    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ message: "internal error" });
    }
});

/**
 * @swagger
 * /users/getAll:
 *   get:
 *     summary: Retrieve all users (protected route).
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   firstname:
 *                     type: string
 *                   lastname:
 *                     type: string
 *                   email:
 *                     type: string
 *                   age:
 *                     type: integer
 *                   telephone:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized (missing or invalid token).
 *       500:
 *         description: Error retrieving users.
 */
userRouter.get("/getAll", verifyToken, async (req, res) => {
    try {
        const users = await utilisateurModel
            .find({}, { password: 0 })
            .sort({ createdAt: -1 });
        return res.json(users);
    } catch (err) {
        console.error("getAll error:", err);
        return res.status(500).json({ message: "Error retrieving users" });
    }
});

module.exports = { userRouter };