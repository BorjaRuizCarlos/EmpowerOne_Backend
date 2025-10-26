const pool = require('../db');

const User = {
    getAll: async () => {
        const result = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id');
        return result.rows;
    },

    getById: async (id) => {
        const result = await pool.query(
            'SELECT id, name, email, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    },

    getByEmail: async (email) => {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    },

    create: async (user) => {
        const { name, email, password } = user;
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
            [name, email, password]
        );
        return result.rows[0];
    }
};

module.exports = User;