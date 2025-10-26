const express = require("express");
const bankCustomerRoutes = require("./bank.customer.routes.js");
const bankEnterpriseRoutes = require("./bank.enterprise.routes.js");
const userRoutes = require("./user.routes.js");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bank
 *   description: Endpoints for interacting with bank accounts and transactions
 */

router.use("/bank/customer", bankCustomerRoutes);
router.use("/bank/enterprise", bankEnterpriseRoutes);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

router.use("/user", userRoutes);

module.exports = router;