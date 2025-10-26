import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import router from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";

const app = express();

app.use(cors());
app.use(express.json());

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Main API router
app.use("/api", router);

// Start server
app.listen(config.port, () => {
  console.log(`✅ Server running at http://localhost:${config.port}`);
  console.log(`📘 Swagger docs at http://localhost:${config.port}/api-docs`);
});
