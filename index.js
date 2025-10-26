const express = require('express');
require('dotenv').config();
const userRoutes = require('./routes/user.routes');
const setupSwagger = require('./swagger');

const app = express();
app.use(express.json());

// Routes
app.use('/users', userRoutes);

setupSwagger(app)

app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));