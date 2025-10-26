const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bank.controller');

/**
 * @swagger
 * /api/bank/enterprise/accounts:
 *   get:
 *     summary: Get all accounts
 *     tags: [Bank]
 *     responses:
 *       200:
 *         description: List of accounts
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
router.get('/accounts', bankController.getAccountsEnterprise);

/**
 * @swagger
 * /api/bank/enterprise/accounts/{accountId}:
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
router.get('/accounts/:accountId', bankController.getAccountDetailsEnterprise);

/**
 * @swagger
 * /api/bank/enterprise/bills:
 *   get:
 *     summary: Get bills/transactions
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
router.get('/bills', bankController.getBillsEnterprise);

module.exports = router;