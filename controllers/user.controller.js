const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const userController = {
    // Get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await User.getAll();
            res.json(users);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    // Register user
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Check if user exists
            const existingUser = await User.getByEmail(email);
            if (existingUser) return res.status(400).json({ error: 'Email already exists' });

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({ name, email, password: hashedPassword });
            res.status(201).json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    // Login user
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

            const user = await User.getByEmail(email);
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

    // Protected route example
    getProfile: async (req, res) => {
        try {
            const user = await User.getById(req.user.id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    }
};

module.exports = userController;