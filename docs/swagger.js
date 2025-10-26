import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bank API",
      version: "1.0.0",
      description: "Backend API for financial app (with external bank API integration)",
    },
    servers: [
      {
        url: "http://localhost:8000/api",
        description: "Local server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to route files for annotations
};

export const swaggerSpec = swaggerJSDoc(options);