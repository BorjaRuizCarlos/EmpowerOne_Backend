const express = require('express');
const cors = require('cors');
require('dotenv').config();
const router = require('./routes/index.router.js');
const setupSwagger = require('./swagger.js');

const app = express();

const corsOptions = {
  origin: 
  // ['http://my-node-env.eba-7tri2szs.us-east-1.elasticbeanstalk.com'], // Add your frontend URLs
  ['http://localhost:5000'],
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));