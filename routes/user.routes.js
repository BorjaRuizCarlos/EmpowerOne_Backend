const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Missing fields or email exists
 */
router.post('/register', userController.registerUser);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', userController.loginUser);

/**
 * @swagger
 * /api/user/details:
 *   get:
 *     summary: Get current user details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Unauthorized
 */
router.get('/details', auth, userController.getUserDetails);

/**
 * @swagger
 * /api/user/goals:
 *   get:
 *     summary: Get all goals of a specific user
 *     description: Returns all goals associated with the given user ID.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user goals retrieved successfully.
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *       500:
 *         description: Server error.
 */
router.get('/goals', auth, userController.getUserGoals);

/**
 * @swagger
 * /api/user/goals/details:
 *   get:
 *     summary: Get detailed goal info for a user
 *     description: Returns detailed information for all goals of a given user.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detailed goal information retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.get('/goals/details', auth, userController.getUserGoalsDetails);

/**
 * @swagger
 * /api/user/goals/{goal_id}:
 *   get:
 *     summary: Get a specific goal by its ID
 *     description: Retrieves the details of a single goal by its goal ID.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: goal_id
 *         required: true
 *         description: The ID of the goal
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Goal retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Goal not found.
 *       500:
 *         description: Server error.
 */
router.get('/goals/:goal_id', auth, userController.getUserGoal);

/**
 * @swagger
 * /api/user/goals/type/{type}:
 *   get:
 *     summary: Get user goals filtered by type
 *     description: Returns all goals for a user filtered by a specified goal type.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         description: The type of goal (e.g. savings, investment)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user goals filtered by type.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.get('/goals/type/:type', auth, userController.getUserGoalsByType);

/**
 * @swagger
 * /api/user/goals/details/{goal_id}:
 *   get:
 *     summary: Get detailed information of a specific goal
 *     description: Returns detailed goal information for a single goal ID.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: goal_id
 *         required: true
 *         description: The ID of the goal
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detailed goal information retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Goal not found.
 *       500:
 *         description: Server error.
 */
router.get('/goals/details/:goal_id', auth, userController.getUserGoalDetails);

/**
 * @swagger
 * /api/user/goals:
 *   post:
 *     summary: Create a new goal for the authenticated user
 *     description: >
 *       Creates a new goal and stores its details in the appropriate table depending on the goal type.
 *       - `saving_goals`: Stored in **saving_goals**
 *       - `debt_reduction_goals`: Stored in **debt_reduction_goals**
 *       - `spending_control_goals`: Stored in **spending_control_goals**
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, type, title]
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               type:
 *                 type: string
 *                 enum: [saving_goals, debt_reduction_goals, spending_control_goals]
 *                 example: saving_goals
 *               title:
 *                 type: string
 *                 example: Save for a new laptop
 *               description:
 *                 type: string
 *                 example: I want to save $2000 by December.
 *               extraData:
 *                 oneOf:
 *                   - type: object
 *                     description: For saving goals
 *                     required: [target_amount, current_amount, deadline]
 *                     properties:
 *                       target_amount:
 *                         type: number
 *                         example: 5000
 *                       current_amount:
 *                         type: number
 *                         example: 1000
 *                       deadline:
 *                         type: string
 *                         format: date
 *                         example: 2026-01-01
 *                   - type: object
 *                     description: For debt reduction goals
 *                     required: [debt_name, initial_debt, remaining_debt, monthly_payment_target]
 *                     properties:
 *                       debt_name:
 *                         type: string
 *                         example: Student Loan
 *                       initial_debt:
 *                         type: number
 *                         example: 10000
 *                       remaining_debt:
 *                         type: number
 *                         example: 8000
 *                       monthly_payment_target:
 *                         type: number
 *                         example: 500
 *                   - type: object
 *                     description: For spending control goals
 *                     required: [category, spending_limit, period]
 *                     properties:
 *                       category:
 *                         type: string
 *                         example: Entertainment
 *                       spending_limit:
 *                         type: number
 *                         example: 300
 *                       period:
 *                         type: string
 *                         example: monthly
 *     responses:
 *       201:
 *         description: Goal created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 goal_id:
 *                   type: integer
 *                   example: 12
 *       400:
 *         description: Missing or invalid fields.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.post('/goals', auth, userController.createUserGoal);

/**
 * @swagger
 * /api/user/goals/{goal_id}:
 *   put:
 *     summary: Update a user goal
 *     description: Updates an existing goal by its ID.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: goal_id
 *         required: true
 *         description: ID of the goal to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: debt_reduction_goals
 *               title:
 *                 type: string
 *                 example: Pay off credit card
 *               description:
 *                 type: string
 *                 example: Reduce credit card debt by $1000
 *     responses:
 *       200:
 *         description: Goal updated successfully.
 *       404:
 *         description: Goal not found.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.put('/goals/:goal_id', auth, userController.updateUserGoal);

/**
 * @swagger
 * /api/user/goals/{goal_id}:
 *   delete:
 *     summary: Delete a user goal
 *     description: Deletes a goal by its ID.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: goal_id
 *         required: true
 *         description: ID of the goal to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Goal deleted successfully.
 *       404:
 *         description: Goal not found.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.delete('/goals/:goal_id', auth, userController.deleteUserGoal);

/**
 * @swagger
 * /api/user/transactions:
 *   get:
 *     summary: Get all transactions for the authenticated user
 *     description: Returns a list of all income, expense, and transfer transactions for the user.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   type:
 *                     type: string
 *                   category:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   occurred_at:
 *                     type: string
 *                     format: date-time
 *                   description:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/transactions", auth, userController.getUserTransactions);

/**
 * @swagger
 * /api/user/transactions/{id}:
 *   get:
 *     summary: Get a specific transaction by ID
 *     description: Fetches a single transaction belonging to the authenticated user.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The transaction ID
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer, example: 12 }
 *                 type: { type: string, example: "expense" }
 *                 category: { type: string, example: "Food" }
 *                 amount: { type: number, example: 45.50 }
 *                 occurred_at: { type: string, format: date-time, example: "2025-10-26T18:30:00Z" }
 *                 description: { type: string, example: "Dinner with friends" }
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 */
router.get("/transactions/:id", auth, userController.getUserTransaction);

/**
 * @swagger
 * /api/user/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, amount]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense, transfer]
 *               category:
 *                 type: string
 *               amount:
 *                 type: number
 *               occurred_at:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *               goal_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/transactions", auth, userController.createUserTransaction);

/**
 * @swagger
 * /api/user/transactions/{id}:
 *   put:
 *     summary: Update a transaction by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the transaction to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               category:
 *                 type: string
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       404:
 *         description: Transaction not found
 */
router.put("/transactions/:id", auth, userController.updateUserTransaction);

/**
 * @swagger
 * /api/user/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
 */
router.delete("/transactions/:id", auth, userController.deleteUserTransaction);

/**
 * @swagger
 * /api/user/bills:
 *   get:
 *     summary: Get all bills for the authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved bills
 */
router.get("/bills", auth, userController.getUserBills);

/**
 * @swagger
 * /api/user/bills/{id}:
 *   get:
 *     summary: Get a specific bill by ID
 *     description: Returns the details of a bill belonging to the authenticated user.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Bill ID
 *     responses:
 *       200:
 *         description: Bill retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer, example: 9 }
 *                 name: { type: string, example: "Internet" }
 *                 amount: { type: number, example: 699.00 }
 *                 category: { type: string, example: "Utilities" }
 *                 due_date: { type: string, format: date, example: "2025-11-05" }
 *                 is_recurring: { type: boolean, example: true }
 *                 recurrence_interval: { type: string, example: "monthly" }
 *                 is_paid: { type: boolean, example: false }
 *       404:
 *         description: Bill not found
 *       401:
 *         description: Unauthorized
 */
router.get("/bills/:id", auth, userController.getUserBill);

/**
 * @swagger
 * /api/user/bills:
 *   post:
 *     summary: Create a new bill
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, amount, due_date]
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date
 *               is_recurring:
 *                 type: boolean
 *               recurrence_interval:
 *                 type: string
 *               is_paid:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Bill created successfully
 */
router.post("/bills", auth, userController.createUserBill);

/**
 * @swagger
 * /api/user/bills/{id}:
 *   put:
 *     summary: Update a bill
 *     description: Updates the fields of an existing bill for the authenticated user.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Bill ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Electricity Bill" }
 *               amount: { type: number, example: 950.00 }
 *               category: { type: string, example: "Utilities" }
 *               due_date: { type: string, format: date, example: "2025-11-20" }
 *               is_recurring: { type: boolean, example: true }
 *               recurrence_interval: { type: string, example: "monthly" }
 *               is_paid: { type: boolean, example: true }
 *     responses:
 *       200:
 *         description: Bill updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Bill not found
 */
router.put("/bills/:id", auth, userController.updateUserBill);

/**
 * @swagger
 * /api/user/bills/{id}:
 *   delete:
 *     summary: Delete a bill
 *     description: Deletes the specified bill from the authenticated user’s account.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bill deleted successfully
 *       404:
 *         description: Bill not found
 */
router.delete("/bills/:id", auth, userController.deleteUserBill);

/**
 * @swagger
 * /api/user/balances:
 *   get:
 *     summary: Get all balances for the authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved balances
 */
router.get("/balances", auth, userController.getUserBalances);

/**
 * @openapi
 * /api/user/balances/{year}/{month}:
 *   get:
 *     summary: Get user's balance for a specific month
 *     description: |
 *       Retrieves the balance record for a specific year and month belonging to the authenticated user.
 *       If no record exists for that period, a 404 response is returned.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2025
 *         description: The year of the balance record
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 10
 *         description: The month (1–12) of the balance record
 *     responses:
 *       200:
 *         description: Successfully retrieved user balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 12
 *                 user_id:
 *                   type: integer
 *                   example: 3
 *                 year:
 *                   type: integer
 *                   example: 2025
 *                 month:
 *                   type: integer
 *                   example: 10
 *                 balance:
 *                   type: number
 *                   format: float
 *                   example: 4567.89
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-26T12:00:00Z"
 *       401:
 *         description: Unauthorized – Missing or invalid authentication token
 *       404:
 *         description: Balance not found
 *       500:
 *         description: Internal server error
 */
router.get('/balances/:year/:month', auth, userController.getUserBalance);

/**
 * @swagger
 * /api/user/balances:
 *   post:
 *     summary: Create a new balance record
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [year, month, balance]
 *             properties:
 *               year:
 *                 type: integer
 *               month:
 *                 type: integer
 *               balance:
 *                 type: number
 *     responses:
 *       201:
 *         description: Balance created successfully
 */
router.post("/balances", auth, userController.createUserBalance);

/**
 * @swagger
 * /api/user/balances/{id}:
 *   delete:
 *     summary: Delete a monthly balance record
 *     description: Removes a balance entry for a specific month and year.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Balance record ID
 *     responses:
 *       200:
 *         description: Balance deleted successfully
 *       404:
 *         description: Balance not found
 */
router.delete("/balances/:id", auth, userController.deleteUserBalance);

module.exports = router;
