const bankService = require('../services/bank.service');

const bankController = {
    getAccounts: async (req, res) => {
        try {
            console.log("ACCOUNTS")
            const accounts = await bankService.getAccounts();
            res.json(accounts);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch accounts' });
        }
    },

    getAccountDetails: async (req, res) => {
        try {
            const { accountId } = req.params;
            const account = await bankService.getAccountDetails(accountId);
            res.json(account);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch account details' });
        }
    },

    getBills: async (req, res) => {
        try {
            console.log("BILLS")
            const transactions = await bankService.getBills();
            res.json(transactions);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch transactions' });
        }
    }
};

module.exports = bankController;