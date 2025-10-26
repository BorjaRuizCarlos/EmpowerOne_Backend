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
};

module.exports = userController;