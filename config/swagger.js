const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = new (require('./scripts/config'))();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: config.get('application:name'),
            version: config.get('application:version'),
            description: config.get('application:description'),
            contact: {
                name: config.get('application:author'),
                email: config.get('application:email'),
                url: config.get('application:url'),
            }
        }
    },
    apis: ['./scripts/*.js'],
}

const swaggerSpec = swaggerJSDoc(options);
module.exports = { swaggerSpec, swaggerUi };