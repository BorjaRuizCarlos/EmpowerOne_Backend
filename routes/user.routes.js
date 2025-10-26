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

module.exports = router;
