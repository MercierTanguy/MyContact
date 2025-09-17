const jwt = require("jsonwebtoken")
const { jwt_secret } = require("../constant/config.const")

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, jwt_secret, { expiresIn: "2h" })
}
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ message: "Malformed token" });
    }

    const token = parts[1];
    try {
        const decoded = jwt.verify(token, jwt_secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = {
    generateToken,
    verifyToken
}