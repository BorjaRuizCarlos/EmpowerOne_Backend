const express = require('express');
const cors = require('cors');
require('dotenv').config();
const router = require('./routes/index.router.js');
const setupSwagger = require('./swagger.js');

const app = express();

const corsOptions = {
  origin: ['http://localhost:8000'], // Add your frontend URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api', router);

setupSwagger(app)

app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));