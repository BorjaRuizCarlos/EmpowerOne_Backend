const axios = require('axios');
require('dotenv').config();

const NESSIE_KEY = process.env.NESSIE_API_KEY;
const BASE_URL = process.env.NESSIE_BASE_URL;

const bankService = {
    getAccounts: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/enterprise/accounts`, {
                params: { key: NESSIE_KEY }
            });
            return response.data;
        } catch (err) {
            console.error('Nessie API error:', err.response?.data || err.message);
            throw err;
        }
    },

    getAccountDetails: async (accountId) => {
        try {
            const response = await axios.get(`${BASE_URL}/enterprise/accounts/${accountId}`, {
                params: { key: NESSIE_KEY }
            });
            return response.data;
        } catch (err) {
            console.error('Nessie API error:', err.response?.data || err.message);
            throw err;
        }
    },

    getBills: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/enterprise/bills`, {
                params: { key: NESSIE_KEY }
            });
            return response.data;
        } catch (err) {
            console.error('Nessie API error:', err.response?.data || err.message);
            throw err;
        }
    }
};

module.exports = bankService;