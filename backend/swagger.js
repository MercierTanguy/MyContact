const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "MyContact API",
            version: "1.0.0",
            description: "Documentation de l'API MyContact avec Swagger",
        },
        servers: [
            {
                url: "http://localhost:5000/",
            },
        ],
    },
    apis: ["./src/router/*.js"],
};

const specs = swaggerJsdoc(options);
module.exports = specs;