const { mongoose } = require("mongoose")

const utilisateurSchema = new mongoose.Schema({
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, minLength: 6, maxLength: 30, trim: true, match: /[a-zA-Z0-9._\-]{1,30}[@][a-zA-Z0-9._\-]{4,12}[.]{1}[a-zA-Z]{2,4}/gm },
    password: { type: String, required: true, trim: true },
    telephone: { type: String, required: true, minLength: 10, maxLength: 10, match: /^0[1-9]\d{8}$/, trim: true },
}, { versionKey: false })



module.exports = {
    utilisateurSchema
}