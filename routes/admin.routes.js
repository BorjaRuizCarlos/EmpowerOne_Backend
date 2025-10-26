const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const checkAdmin = require('../middleware/checkAdmin');

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin routes to manage all users and goals
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin login successful, returns JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', adminController.login);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/users', checkAdmin, adminController.getAllUsers);


/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/users/:id', checkAdmin, adminController.getUserById);


/**
 * @swagger
 * /api/admin/goals:
 *   get:
 *     summary: Get all goals
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all goals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       type:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       target_amount:
 *                         type: number
 *                         nullable: true
 *                       current_amount:
 *                         type: number
 *                         nullable: true
 *                       deadline:
 *                         type: string
 *                         format: date
 *                         nullable: true
 *                       debt_name:
 *                         type: string
 *                         nullable: true
 *                       initial_debt:
 *                         type: number
 *                         nullable: true
 *                       remaining_debt:
 *                         type: number
 *                         nullable: true
 *                       monthly_payment_target:
 *                         type: number
 *                         nullable: true
 *                       category:
 *                         type: string
 *                         nullable: true
 *                       spending_limit:
 *                         type: number
 *                         nullable: true
 *                       period:
 *                         type: string
 *                         nullable: true
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/goals', checkAdmin, adminController.getAllGoals);


/**
 * @swagger
 * /api/admin/goals/{id}:
 *   get:
 *     summary: Get a goal by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the goal
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Goal found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                     type:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     target_amount:
 *                       type: number
 *                       nullable: true
 *                     current_amount:
 *                       type: number
 *                       nullable: true
 *                     deadline:
 *                       type: string
 *                       format: date
 *                       nullable: true
 *                     debt_name:
 *                       type: string
 *                       nullable: true
 *                     initial_debt:
 *                       type: number
 *                       nullable: true
 *                     remaining_debt:
 *                       type: number
 *                       nullable: true
 *                     monthly_payment_target:
 *                       type: number
 *                       nullable: true
 *                     category:
 *                       type: string
 *                       nullable: true
 *                     spending_limit:
 *                       type: number
 *                       nullable: true
 *                     period:
 *                       type: string
 *                       nullable: true
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Goal not found
 *       500:
 *         description: Server error
 */



/**
 * @swagger
 * /api/admin/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       goal_id:
 *                         type: integer
 *                         nullable: true
 *                       type:
 *                         type: string
 *                         enum: [income, expense, transfer]
 *                       category:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       occurred_at:
 *                         type: string
 *                         format: date-time
 *                       description:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/transactions', checkAdmin, adminController.getAllTransactions);

/**
 * @swagger
 * /api/admin/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the transaction
 *     responses:
 *       200:
 *         description: Transaction found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                     goal_id:
 *                       type: integer
 *                       nullable: true
 *                     type:
 *                       type: string
 *                     category:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     occurred_at:
 *                       type: string
 *                       format: date-time
 *                     description:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
router.get('/transactions/:id', checkAdmin, adminController.getTransactionById);

/**
 * @swagger
 * /api/admin/bills:
 *   get:
 *     summary: Get all bills
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bills
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       category:
 *                         type: string
 *                       due_date:
 *                         type: string
 *                         format: date
 *                       is_recurring:
 *                         type: boolean
 *                       recurrence_interval:
 *                         type: string
 *                         nullable: true
 *                       is_paid:
 *                         type: boolean
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/bills', checkAdmin, adminController.getAllBills);

/**
 * @swagger
 * /api/admin/bills/{id}:
 *   get:
 *     summary: Get a bill by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the bill
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bill found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     category:
 *                       type: string
 *                     due_date:
 *                       type: string
 *                       format: date
 *                     is_recurring:
 *                       type: boolean
 *                     recurrence_interval:
 *                       type: string
 *                     is_paid:
 *                       type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bill not found
 *       500:
 *         description: Server error
 */
router.get('/bills/:id', checkAdmin, adminController.getBillById);

/**
 * @swagger
 * /api/admin/balances:
 *   get:
 *     summary: Get all balances
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all balances
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       year:
 *                         type: integer
 *                       month:
 *                         type: integer
 *                       balance:
 *                         type: number
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/balances', checkAdmin, adminController.getAllBalances);

/**
 * @swagger
 * /api/admin/balances/{id}:
 *   get:
 *     summary: Get a balance by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the balance record
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Balance found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                     year:
 *                       type: integer
 *                     month:
 *                       type: integer
 *                     balance:
 *                       type: number
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Balance not found
 *       500:
 *         description: Server error
 */
router.get('/balances/:id', checkAdmin, adminController.getBalanceById);

module.exports = router;