const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bank.controller');

/**
 * @swagger
 * /api/bank/customer/accounts:
 *   get:
 *     summary: Get all accounts for a customer
 *     tags: [Bank]
 *     responses:
 *       200:
 *         description: List of customer accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *       500:
 *         description: Failed to fetch accounts
 */
router.get('/accounts', bankController.getAccountsCustomer);

/**
 * @swagger
 * /api/bank/customer/accounts/{accountId}:
 *   get:
 *     summary: Get details of a specific account
 *     tags: [Bank]
 *     parameters:
 *       - in: path
 *         name: accountId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the account
 *     responses:
 *       200:
 *         description: Account details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       500:
 *         description: Failed to fetch account details
 */
router.get('/accounts/:accountId', bankController.getAccountDetailsCustomer);

/**
 * @swagger
 * /api/bank/customer/bills:
 *   get:
 *     summary: Get bills/transactions for an account
 *     tags: [Bank]
 *     responses:
 *       200:
 *         description: List of transactions/bills
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *       500:
 *         description: Failed to fetch transactions
 */
router.get('/bills', bankController.getBillsCustomer);

module.exports = router;