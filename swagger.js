const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'EmpowerOne API',
            version: '1.0.0',
            description: 'API documentation for the EmpowerOne backend services',
        },
        servers: [
            { 
                url: 'http://my-node-env.eba-7tri2szs.us-east-1.elasticbeanstalk.com', description: 'Local server' 
            }
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
                customCss: '.topbar {display: none}',
                customSiteTitle: 'EmpowerOne API Docs',
                swaggerOptions: {
                    tryItOutEnabled: true
                }
            }
        )
    );
};

module.exports = setupSwagger;