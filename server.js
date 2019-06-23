const express = require('express');
const connectDb = require('./config/db');
// var cors = require('cors');
const app = express();
const axios = require('axios');

connectDb();

// app.use(cors())

// Init Middleware
app.use(express.json({ extended: false }));

// Get Request
app.get('/', (req, res) => res.send('API Running'))

app.get('/api/giftcards', async (req, res) => {
    // const name = req.query.name || 'World';
    // res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
    res.setHeader('Content-Type', 'application/json');
    const result = await axios.get('https://fulfilment-admin.azurewebsites.net/api/giftcards');
    res.json(result.data);
});

// Routes
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/users', require('./routes/api/users'))

// Listening for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));