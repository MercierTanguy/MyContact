const { default: mongoose } = require("mongoose")
const { db_url } = require("../constant/config.const")
const { utilisateurSchema } = require("./schema.js")

mongoose.connect(db_url)
    .then(() => console.log('Connecté avec succès à MongoDB'))
    .catch((err) => console.error('Erreur lors de la connexion à MongoDB :', err));

const utilisateurModel = mongoose.model("Utilisateur", utilisateurSchema)

module.exports = {
    utilisateurModel
}