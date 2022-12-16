const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
      info: {
        title: "Node API",
        version: "1.0.0",
        description: "Node API with generated swagger doc",
      },
    },
    apis: ['./routes/*.js','./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;