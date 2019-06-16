const express = require('express');
const connectDb = require('./config/db');
var cors = require('cors');
const app = express();

connectDb();

app.use(cors())

// Init Middleware
app.use(express.json({ extended: false }));

// Get Request
app.get('/', (req, res) => res.send('API Running'))

// Routes
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/users', require('./routes/api/users'))

// Listening for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));