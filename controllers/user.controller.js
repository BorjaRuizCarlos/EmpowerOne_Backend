const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const userController = {
    // Register user
    registerUser: async (req, res) => {
        try {
            console.log("REGISTER USER");

            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Check if user exists
            const existingUser = await userModel.getUserByEmail(email);
            if (existingUser) return res.status(400).json({ error: 'Email already exists' });

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await userModel.createUser({ name, email, password: hashedPassword });
            res.status(201).json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    // Login user
    loginUser: async (req, res) => {
        try {
            console.log("LOGIN USER");

            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

            const user = await userModel.getUserByEmail(email);
            if (!user) return res.status(400).json({ error: 'Invalid credentials' });

            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(400).json({ error: 'Invalid credentials' });

            // Generate JWT
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

            res.json({ token: token });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    // Get user profile
    getUserDetails: async (req, res) => {
        try {
            console.log("GET USER DETAILS");

            const user_id = req.user.id;

            const user = await userModel.getUserById(user_id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    // Get user goals
    getUserGoals: async (req, res) => {
        try {
            console.log("GET USER GOALS");

            const user_id = req.user.id;

            const goals = await userModel.getUserGoals(user_id);
            res.json(goals);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    // Get specific goal
    getUserGoal: async (req, res) => {
        try {
            console.log("GET USER GOAL");

            const { goal_id } = req.params; 

            const goal = await userModel.getUserGoal(goal_id);
            if (!goal) return res.status(404).json({ error: 'Goal not found' });
            res.json(goal);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    // Get user goals by type
    getUserGoalsByType: async (req, res) => {
        try {
            console.log("GET USER GOALS BY TYPE");

            const user_id = req.user.id;
            const { type } = req.params;

            const goals = await userModel.getUserGoalsByType(user_id, type);
            res.json(goals);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    // Get user goals full details
    getUserGoalsDetails: async (req, res) => {
        try {
            console.log("GET USER GOALS DETAILS");

            const user_id = req.user.id;

            const goals = await userModel.getUserGoalsDetails(user_id);
            res.json(goals);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    // Get specific goal full details
    getUserGoalDetails: async (req, res) => {
        try {
            console.log("GET USER GOAL DETAILS");

            const { goal_id } = req.params;

            const goal = await userModel.getUserGoalDetails(goal_id);
            if (!goal) return res.status(404).json({ error: 'Goal not found' });
            res.json(goal);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    // Create a new goal
    createUserGoal: async (req, res) => {
        try {
            console.log("CREATE USER GOAL");

            const user_id = req.user.id;
            const { type, title, description, extraData } = req.body;

            if (!type || !title) {
                return res.status(400).json({ error: 'Missing required fields (type, title)' });
            }

            const goal = await userModel.createUserGoal(user_id, { type, title, description, extraData });
            res.status(201).json(goal);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    // Update existing goal
    updateUserGoal: async (req, res) => {
        try {
            console.log("UPDATE USER GOAL");

            const { goal_id } = req.params;
            const { type, title, description } = req.body;

            const goal = await userModel.updateUserGoal(goal_id, { type, title, description });
            if (!goal) return res.status(404).json({ error: 'Goal not found' });

            res.json(goal);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    // Delete a goal
    deleteUserGoal: async (req, res) => {
        try {
            console.log("DELETE USER GOAL");

            const { goal_id } = req.params;
            const deleted = await userModel.deleteUserGoal(goal_id);

            res.json({ message: 'Goal deleted successfully', deleted });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    // Get user transactions
    getUserTransactions: async (req, res) => {
        try {
            console.log("GET USER TRANSACTIONS");

            const user_id = req.user.id;

            const transactions = await userModel.getUserTransactions(user_id);
            res.json(transactions);
        } catch (err) {
            console.error("Error fetching transactions:", err);
            res.status(500).json({ error: "Failed to fetch transactions" });
        }
    },

    // Get specific transaction
    getUserTransaction: async (req, res) => {
        try {
            console.log("GET USER TRANSACTION");

            const { transaction_id } = req.params;
            const transaction = await userModel.getUserTransaction(transaction_id);
            if (!transaction) return res.status(404).json({ error: "Transaction not found" });
            res.json(transaction);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch transaction" });
        }
    },

    // Create a new transaction
    createUserTransaction: async (req, res) => {
        try {
            console.log("CREATE USER TRANSACTION");

            const user_id = req.user.id;
            const transaction = await userModel.createUserTransaction({ user_id, ...req.body });
            res.status(201).json(transaction);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to create transaction" });
        }
    },

    // Update existing transaction
    updateUserTransaction: async (req, res) => {
        try {
            console.log("UPDATE USER TRANSACTION");

            const { transaction_id } = req.params;
            const updated = await userModel.updateUserTransaction(transaction_id, req.body);
            if (!updated) return res.status(404).json({ error: "Transaction not found or not updated" });
            res.json(updated);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to update transaction" });
        }
    },

    // Delete a transaction
    deleteUserTransaction: async (req, res) => {
        try {
            console.log("DELETE USER TRANSACTION");

            const { transaction_id } = req.params;
            const result = await userModel.deleteUserTransaction(transaction_id);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to delete transaction" });
        }
    },

    // Get user bills
    getUserBills: async (req, res) => {
        try {
            console.log("GET USER BILLS");

            const user_id = req.user.id;
            const bills = await userModel.getUserBills(user_id);
            res.json(bills);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch bills" });
        }
    },

    // Get specific bill
    getUserBill: async (req, res) => {
        try {
            console.log("GET USER BILL");

            const { bill_id } = req.params;
            const bill = await userModel.getUserBill(bill_id);
            if (!bill) return res.status(404).json({ error: "Bill not found" });
            res.json(bill);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch bill" });
        }
    },

    // Create a new bill
    createUserBill: async (req, res) => {
        try {
            console.log("CREATE USER BILL");

            const user_id = req.user.id;
            const bill = await userModel.createUserBill({ user_id, ...req.body });
            res.status(201).json(bill);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to create bill" });
        }
    },

    // Update existing bill
    updateUserBill: async (req, res) => {
        try {
            console.log("UPDATE USER BILL");

            const { bill_id } = req.params;
            const updated = await userModel.updateUserBill(bill_id, req.body);
            if (!updated) return res.status(404).json({ error: "Bill not found or not updated" });
            res.json(updated);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to update bill" });
        }
    },

    // Delete a bill
    deleteUserBill: async (req, res) => {
        try {
            console.log("DELETE USER BILL");

            const { bill_id } = req.params;
            const result = await userModel.deleteUserBill(bill_id);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to delete bill" });
        }
    },

    // Get user balances
    getUserBalances: async (req, res) => {
        try {
            console.log("GET USER BALANCES");

            const user_id = req.user.id;
            const balances = await userModel.getUserBalances(user_id);
            res.json(balances);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch balances" });
        }
    },

    // Get specific balance
    getUserBalance: async (req, res) => {
        try {
            console.log("GET USER BALANCE");

            const user_id = req.user.id;
            const { year, month } = req.params;
            const balance = await userModel.getUserBalance(user_id, year, month);
            if (!balance) return res.status(404).json({ error: "Balance not found" });
            res.json(balance);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch balance" });
        }
    },

    // Create or update user balance
    createUserBalance: async (req, res) => {
        try {
            console.log("CREATE USER BALANCE");

            const user_id = req.user.id;
            const balance = await userModel.createUserBalance({ user_id, ...req.body });
            res.status(201).json(balance);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to create or update balance" });
        }
    },

    // Delete a balance
    deleteUserBalance: async (req, res) => {
        try {
            console.log("DELETE USER BALANCE");

            const user_id = req.user.id;
            const { year, month } = req.params;
            const result = await userModel.deleteUserBalance(user_id, year, month);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to delete balance" });
        }
    },
};

module.exports = userController;