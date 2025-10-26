const pool = require('../config/db');

const adminModel = {
    getAllUsers: async () => {
        const result = await pool.query(
            'SELECT * FROM users'
        );
        return result.rows;
    },

    getUserById: async (id) => {
        const result = await pool.query(
            'SELECT id, name, email, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    },

    getAllGoals: async () => {
        const query = `
            SELECT g.*, 
                sg.target_amount, sg.current_amount, sg.deadline,
                drg.debt_name, drg.initial_debt, drg.remaining_debt, drg.monthly_payment_target,
                scg.category, scg.spending_limit, scg.period
            FROM goals g
            LEFT JOIN saving_goals sg ON g.id = sg.goal_id
            LEFT JOIN debt_reduction_goals drg ON g.id = drg.goal_id
            LEFT JOIN spending_control_goals scg ON g.id = scg.goal_id;
            `;
        const result = await pool.query(query);
        return result.rows;
    },

    
    getGoalById: async (goal_id) => {
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

    getAllTransactions: async () => {
        const result = await pool.query(`
            SELECT t.*, u.name AS user_name, g.title AS goal_title
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            LEFT JOIN goals g ON t.goal_id = g.id
            ORDER BY t.occurred_at DESC
        `);
        return result.rows;
    },

  getTransactionById: async (id) => {
    const result = await pool.query(`
        SELECT t.*, u.name AS user_name, g.title AS goal_title
        FROM transactions t
        JOIN users u ON t.user_id = u.id
        LEFT JOIN goals g ON t.goal_id = g.id
        WHERE t.id = $1
    `, [id]);
    return result.rows[0];
  },

  getAllBills: async () => {
    const result = await pool.query(`
        SELECT b.*, u.name AS user_name
        FROM bills b
        JOIN users u ON b.user_id = u.id
        ORDER BY b.due_date ASC
    `);
    return result.rows;
  },

  getBillById: async (id) => {
    const result = await pool.query(`
      SELECT b.*, u.name AS user_name
      FROM bills b
      JOIN users u ON b.user_id = u.id
      WHERE b.id = $1
    `, [id]);
    return result.rows[0];
  },

  getAllBalances: async () => {
    const result = await pool.query(`
      SELECT bal.*, u.name AS user_name
      FROM balances bal
      JOIN users u ON bal.user_id = u.id
      ORDER BY bal.year DESC, bal.month DESC
    `);
    return result.rows;
  },

  getBalanceById: async (id) => {
    const result = await pool.query(`
      SELECT bal.*, u.name AS user_name
      FROM balances bal
      JOIN users u ON bal.user_id = u.id
      WHERE bal.id = $1
    `, [id]);
    return result.rows[0];
  }
};

module.exports = adminModel;