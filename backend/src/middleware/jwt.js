const jwt = require("jsonwebtoken")
const { jwt_secret } = require("../constant/config.const")

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, jwt_secret, { expiresIn: "2h" })
}

const decodeToken = (token) => {
    try {
        return jwt.verify(token, jwt_secret);
    } catch (err) {
        return null;
    }
};

module.exports = {
    generateToken,
    decodeToken
}