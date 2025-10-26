const bankService = require('../services/bank.service');

const bankController = {
    getAccountsCustomer: async (req, res) => {
        try {
            console.log("ACCOUNTS - CUSTOMER")

            const params = req.query;

            const accounts = await bankService.getAccounts(params);
            res.json(accounts);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch accounts' });
        }
    },
    getAccountsEnterprise: async (req, res) => {
        try {
            console.log("ACCOUNTS - ENTERPRISE")

            const params = req.query;

            const accounts = await bankService.getAccounts(params, enterprise=true);
            res.json(accounts);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch accounts' });
        }
    },
    getAccountDetailsCustomer: async (req, res) => {
        try {
            onsole.log("ACCOUNT DETAILS - CUSTOMER")

            const { accountId } = req.params;
            const account = await bankService.getAccountDetails(accountId);
            res.json(account);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch account details' });
        }
    },
    getAccountDetailsEnterprise: async (req, res) => {
        try {
            onsole.log("ACCOUNT DETAILS - ENTERPRISE")

            const { accountId } = req.params;
            const account = await bankService.getAccountDetails(accountId, enterprise=true);
            res.json(account);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch account details' });
        }
    },
    getBillsCustomer: async (req, res) => {
        try {
            console.log("BILLS - CUSTOMER")
            const transactions = await bankService.getBills();
            res.json(transactions);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch transactions' });
        }
    },
    getBillsEnterprise: async (req, res) => {
        try {
            console.log("BILLS - ENTERPRISE")
            const transactions = await bankService.getBills(enterprise=true);
            res.json(transactions);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch transactions' });
        }
    },
};

module.exports = bankController;