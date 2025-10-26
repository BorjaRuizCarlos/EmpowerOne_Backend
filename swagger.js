const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User API',
            version: '1.0.0',
            description: 'A simple API for users with authentication',
        },
        servers: [
            { url: 'http://localhost:8000', description: 'Local server' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./routes/*.js'], // files containing annotations
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(
            specs,
            {
                swaggerOptions: {
                    tryItOutEnabled: true
                }
            }
        )
    );
};

module.exports = setupSwagger;