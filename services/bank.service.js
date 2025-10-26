const axios = require('axios');
require('dotenv').config();

const CAPITAL_ONE_API_KEY = process.env.CAPITAL_ONE_API_KEY;
const CAPITAL_ONE_BASE_URL = process.env.CAPITAL_ONE_BASE_URL;

const bankService = {
    getAccounts: async (params = null, enterprise = false) => {
        try {
            path = enterprise ? '/enterprise/accounts' : '/accounts';

            const queryParams = { key: CAPITAL_ONE_API_KEY, ...(params || {}) };

            const response = await axios.get(`${CAPITAL_ONE_BASE_URL + path}`, {
                params: queryParams
            });
            return response.data;
        } catch (err) {
            console.error('Capital One API error:', err.response?.data || err.message);
            throw err;
        }
    },

    getAccountDetails: async (accountId, enterprise = false) => {
        try {
            path = enterprise ? '/enterprise/accounts' : '/accounts';

            const response = await axios.get(`${CAPITAL_ONE_BASE_URL + path}/${accountId}`, {
                params: { key: CAPITAL_ONE_API_KEY }
            });
            return response.data;
        } catch (err) {
            console.error('Capital One API error:', err.response?.data || err.message);
            throw err;
        }
    },

    getBills: async (enterprise = false) => {
        try {
            path = enterprise ? '/enterprise/bills' : '/bills';

            const response = await axios.get(`${CAPITAL_ONE_BASE_URL + path}`, {
                params: { key: CAPITAL_ONE_API_KEY }
            });
            return response.data;
        } catch (err) {
            console.error('Capital One API error:', err.response?.data || err.message);
            throw err;
        }
    }
};

module.exports = bankService;