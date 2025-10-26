import express from "express";
import bankRoutes from "./bank.routes.js";

const router = express.Router();

router.use("/bank", bankRoutes);

export default router;