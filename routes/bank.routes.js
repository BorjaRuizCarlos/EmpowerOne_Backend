const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bank.controller');

/**
 * @swagger
 * tags:
 *   name: Bank
 *   description: Endpoints for interacting with bank accounts and transactions
 */

/**
 * @swagger
 * /api/bank/customers/accounts:
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
router.get('/customers/accounts', bankController.getAccounts);

/**
 * @swagger
 * /api/bank/accounts/{accountId}:
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
router.get('/accounts/:accountId', bankController.getAccountDetails);

/**
 * @swagger
 * /api/bank/accounts/bills:
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
router.get('/accounts/bills', bankController.getBills);

module.exports = router;