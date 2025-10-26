import express from "express";
import bankRoutes from "./bank.routes.js";
import userRoutes from "./user.routes.js";

const router = express.Router();

router.use("/bank", bankRoutes);
router.use("/user", userROutes);

module.exports = router;