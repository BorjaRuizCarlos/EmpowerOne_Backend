const adminModel = require('../models/admin.model');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const adminController = {

    login: (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
            return res.status(401).json({ error: 'Invalid admin credentials' });
        }

        // Generate JWT with admin role
        const token = jwt.sign(
            { username, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '8h' } // adjust expiration as needed
        );

        return res.json({ success: true, token });
  },  

  getAllUsers: async (req, res) => {
    try {
      const users = await adminModel.getAllUsers();
      res.json({ success: true, data: users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  getUserById: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await adminModel.getUserById(id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      res.json({ success: true, data: user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  getAllGoals: async (req, res) => {
    try {
      const goals = await adminModel.getAllGoals();
      res.json({ success: true, data: goals });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  getGoalById: async (req, res) => {
    const { id } = req.params;
    try {
      const goal = await adminModel.getGoalById(id);
      if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
      res.json({ success: true, data: goal });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  getAllTransactions: async (req, res) => {
    try {
      const transactions = await adminModel.getAllTransactions();
      res.json({ success: true, data: transactions });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  getTransactionById: async (req, res) => {
    const { id } = req.params;
    try {
      const transaction = await adminModel.getTransactionById(id);
      if (!transaction)
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      res.json({ success: true, data: transaction });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  getAllBills: async (req, res) => {
    try {
      const bills = await adminModel.getAllBills();
      res.json({ success: true, data: bills });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  getBillById: async (req, res) => {
    const { id } = req.params;
    try {
      const bill = await adminModel.getBillById(id);
      if (!bill)
        return res.status(404).json({ success: false, message: 'Bill not found' });
      res.json({ success: true, data: bill });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  getAllBalances: async (req, res) => {
    try {
      const balances = await adminModel.getAllBalances();
      res.json({ success: true, data: balances });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  getBalanceById: async (req, res) => {
    const { id } = req.params;
    try {
      const balance = await adminModel.getBalanceById(id);
      if (!balance)
        return res.status(404).json({ success: false, message: 'Balance not found' });
      res.json({ success: true, data: balance });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
};

module.exports = adminController;