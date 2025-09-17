const mongoose = require("mongoose");
const { db_url } = require("../constant/config.const");
const { utilisateurSchema, contactSchema } = require("./schema");

mongoose.connect(db_url)
    .then(() => console.log("Connecté avec succès à MongoDB"))
    .catch((err) => console.error("Erreur lors de la connexion à MongoDB :", err));

const utilisateurModel =
    mongoose.models.Utilisateur || mongoose.model("Utilisateur", utilisateurSchema);

const contactModel =
    mongoose.models.Contact || mongoose.model("Contact", contactSchema);
module.exports = { utilisateurModel, contactModel };