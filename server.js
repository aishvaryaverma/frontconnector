const express = require('express');
const app = express();
const cors = require('cors');
const connectDb = require('./config/db');

// Connect Database
connectDb();

// CORS
app.use(cors());

// Init Middleware
app.use(express.json({ extended: false }));

// Get Request
app.get('/', (req, res) => res.send('API Running'));

// Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));

// Listening for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));