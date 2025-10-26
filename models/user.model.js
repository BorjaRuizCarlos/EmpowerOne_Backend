const { use } = require('react');
const pool = require('../config/db');

const userModel = {
    getUserById: async (id) => {
        const result = await pool.query(
            'SELECT id, name, email, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    },
    getUserByEmail: async (email) => {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    },
    createUser: async (user) => {
        const { name, email, password } = user;
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
            [name, email, password]
        );
        return result.rows[0];
    },
    getUserGoals: async (user_id) => {
        const result = await pool.query(
            `SELECT * FROM goals WHERE user_id = $1`,
            [user_id]
        );
        return result.rows;
    },
    getUserGoal: async (goal_id) => {
        const result = await pool.query(
            `SELECT * FROM goals WHERE id = $1`,
            [goal_id]
        );
        return result.rows[0];
    },
    getUserGoalsByType: async (user_id, type) => {
        let query = '';
        switch (type) {
            case 'saving_goals':
                query = `
                    SELECT g.*, sg.target_amount, sg.current_amount, sg.deadline
                    FROM goals g
                    JOIN saving_goals sg ON g.id = sg.goal_id
                    WHERE g.user_id = $1 AND g.type = $2;
                `;
                break;
            case 'debt_reduction_goals':
                query = `
                    SELECT g.*, drg.debt_name, drg.initial_debt, drg.remaining_debt, drg.monthly_payment_target
                    FROM goals g
                    JOIN debt_reduction_goals drg ON g.id = drg.goal_id
                    WHERE g.user_id = $1 AND g.type = $2;
                `;
                break;
            case 'spending_control_goals':
                query = `
                    SELECT g.*, scg.category, scg.spending_limit, scg.period
                    FROM goals g
                    JOIN spending_control_goals scg ON g.id = scg.goal_id
                    WHERE g.user_id = $1 AND g.type = $2;
                `;
                break;
            default:
                throw new Error('Invalid goal type');
        }

        const result = await pool.query(query, [user_id, type]);
        return result.rows;

    },
    getUserGoalsDetails: async (user_id) => {
        const query = `
            SELECT g.*, sg.target_amount, sg.current_amount, sg.deadline,
                NULL::text AS debt_name,
                NULL::numeric AS initial_debt,
                NULL::numeric AS remaining_debt,
                NULL::numeric AS monthly_payment_target,
                NULL::text AS category,
                NULL::numeric AS spending_limit,
                NULL::text AS period
            FROM goals g
            LEFT JOIN saving_goals sg ON g.id = sg.goal_id
            WHERE g.user_id = $1

            UNION ALL

            SELECT g.*, NULL::numeric AS target_amount,
                NULL::numeric AS current_amount,
                NULL::date AS deadline,
                drg.debt_name, drg.initial_debt, drg.remaining_debt, drg.monthly_payment_target,
                NULL::text AS category,
                NULL::numeric AS spending_limit,
                NULL::text AS period
            FROM goals g
            LEFT JOIN debt_reduction_goals drg ON g.id = drg.goal_id
            WHERE g.user_id = $1

            UNION ALL

            SELECT g.*, NULL::numeric AS target_amount,
                NULL::numeric AS current_amount,
                NULL::date AS deadline,
                NULL::text AS debt_name,
                NULL::numeric AS initial_debt,
                NULL::numeric AS remaining_debt,
                NULL::numeric AS monthly_payment_target,
                scg.category,
                scg.spending_limit,
                scg.period
            FROM goals g
            LEFT JOIN spending_control_goals scg ON g.id = scg.goal_id
            WHERE g.user_id = $1;
        `;

        const result = await pool.query(query, [user_id]);
        return result.rows;
    },
    getUserGoalDetails: async (goal_id) => {
        const query = `
            SELECT g.*, 
                sg.target_amount, sg.current_amount, sg.deadline,
                drg.debt_name, drg.initial_debt, drg.remaining_debt, drg.monthly_payment_target,
                scg.category, scg.spending_limit, scg.period
            FROM goals g
            LEFT JOIN saving_goals sg ON g.id = sg.goal_id
            LEFT JOIN debt_reduction_goals drg ON g.id = drg.goal_id
            LEFT JOIN spending_control_goals scg ON g.id = scg.goal_id
            WHERE g.id = $1;
        `;

        const result = await pool.query(query, [goal_id]);
        return result.rows[0];
    },
    createUserGoal: async (user_id, { type, title, description, extraData }) => {
        const conn = await pool.connect();

        try {
            await conn.query('BEGIN');

            const goal_result = await conn.query(
                `INSERT INTO goals (user_id, type, title, description, created_at)
                 VALUES ($1, $2, $3, $4, NOW()) RETURNING id`,
                [user_id, type, title, description]
            );

            console.log(goal_result)
            const goal_id = goal_result.rows[0].id;

            if (type === "saving_goals") {
                const { target_amount, current_amount, deadline } = extraData;
                await conn.query(
                    `INSERT INTO saving_goals (goal_id, target_amount, current_amount, deadline)
                     VALUES ($1, $2, $3, $4)`,
                    [goal_id, target_amount, current_amount, deadline]
                );
            } else if (type === "debt_reduction_goals") {
                const { debt_name, initial_debt, remaining_debt, monthly_payment_target } = extraData;
                await conn.query(
                    `INSERT INTO debt_reduction_goals (goal_id, debt_name, initial_debt, remaining_debt, monthly_payment_target)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [goal_id, debt_name, initial_debt, remaining_debt, monthly_payment_target]
                );
            } else if (type === "spending_control_goals") {
                const { category, spending_limit, period } = extraData;
                await conn.query(
                    `INSERT INTO spending_control_goals (goal_id, category, spending_limit, period)
                     VALUES ($1, $2, $3, $4)`,
                    [goal_id, category, spending_limit, period]
                );
            }

            await conn.query('COMMIT');
            return { goal_id };
        } catch (err) {
            await conn.query('ROLLBACK');
            throw err;
        } finally {
            conn.release();
        }
    },
    updateUserGoal: async (goal_id, { type, title, description }) => {
        const result = await pool.query(
            `UPDATE goals
            SET type = $1, title = $2, description = $3
            WHERE id = $4
            RETURNING *;`,
            [type, title, description, goal_id]
        );
        return result.rows[0];
    },
    deleteUserGoal: async (goal_id) => {
        const [rows] = await pool.query(`SELECT type FROM goals WHERE id = $1`, [goal_id]);
        if (!rows.length) throw new Error("Goal not found");

        const result = await pool.query(`DELETE FROM goals WHERE id = $1`, [goal_id]);

        return result.rows[0];
    },
    getUserTransactions: async (user_id) => {
        const result = await pool.query(
            `SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC`,
            [user_id]
        );
        return result.rows;
    },
    getUserTransaction: async (transaction_id) => {
        const result = await pool.query(
            `SELECT * FROM transactions WHERE id = $1`,
            [transaction_id]
        );
        return result.rows[0];
    },
    createUserTransaction: async ({ user_id, goal_id = null, type, category, amount, occurred_at, description }) => {
        const result = await pool.query(
            `INSERT INTO transactions (user_id, goal_id, type, category, amount, occurred_at, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [user_id, goal_id, type, category, amount, occurred_at, description]
        );
        return result.rows[0];
    },
    updateUserTransaction: async (transaction_id, fields) => {
        const keys = Object.keys(fields);
        const values = Object.values(fields);
        if (!keys.length) return null;

        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
        const query = `UPDATE transactions SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
        const result = await pool.query(query, [...values, transaction_id]);
        return result.rows[0];
    },
    deleteUserTransaction: async (transaction_id) => {
        const result = await pool.query(`DELETE FROM transactions WHERE id = $1 RETURNING *`, [transaction_id]);
        return result.rows[0];
    },
    getUserBills: async (user_id) => {
        const result = await pool.query(
            `SELECT * FROM bills WHERE user_id = $1 ORDER BY due_date ASC`,
            [user_id]
        );
        return result.rows;
    },
    getUserBill: async (bill_id) => {
        const result = await pool.query(`SELECT * FROM bills WHERE id = $1`, [bill_id]);
        return result.rows[0];
    },
    createUserBill: async ({ user_id, name, amount, category, due_date, is_recurring, recurrence_interval }) => {
        const result = await pool.query(
            `INSERT INTO bills (user_id, name, amount, category, due_date, is_recurring, recurrence_interval)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [user_id, name, amount, category, due_date, is_recurring, recurrence_interval]
        );
        return result.rows[0];
    },
    updateUserBill: async (bill_id, fields) => {
        const keys = Object.keys(fields);
        const values = Object.values(fields);
        if (!keys.length) return null;

        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
        const query = `UPDATE bills SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
        const result = await pool.query(query, [...values, bill_id]);
        return result.rows[0];
    },
    deleteUserBill: async (bill_id) => {
        await pool.query(`DELETE FROM bills WHERE id = $1`, [bill_id]);
        return { message: "Bill deleted successfully" };
    },
    getUserBalances: async (user_id) => {
        const result = await pool.query(
            `SELECT * FROM balances WHERE user_id = $1 ORDER BY year DESC, month DESC`,
            [user_id]
        );
        return result.rows;
    },
    getUserBalance: async (user_id, year, month) => {
        const result = await pool.query(
            `SELECT * FROM balances WHERE user_id = $1 AND year = $2 AND month = $3`,
            [user_id, year, month]
        );
        return result.rows[0];
    },
    createUserBalance: async ({ user_id, year, month, balance }) => {
        const result = await pool.query(
            `INSERT INTO balances (user_id, year, month, balance)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, year, month)
            DO UPDATE SET balance = EXCLUDED.balance
            RETURNING *`,
            [user_id, year, month, balance]
        );
        return result.rows[0];
    },
    deleteUserBalance: async (user_id, year, month) => {
        await pool.query(`DELETE FROM balances WHERE user_id = $1 AND year = $2 AND month = $3`, [user_id, year, month]);
        return { message: "Balance entry deleted successfully" };
    },
};

module.exports = userModel;