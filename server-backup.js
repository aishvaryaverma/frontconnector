const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const connectDb = require('./config/db');

// Connect Database
connectDb();

/**
 * CORS
 */
// const whitelist = ['http://127.0.0.1:3000', 'http://localhost:3000',];
// const corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// };
// Initialization
app.use(cors());
// app.use(cors(corsOptions));

// Init Middleware
app.use(express.json({ extended: false }));


// Get Request
app.get('/', (req, res) => res.send('API Running'));
app.get('/api/giftcards', async (req, res) => {
    // const name = req.query.name || 'World';
    // res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    const result = await axios.get('https://fulfilment-admin.azurewebsites.net/api/giftcards');
    res.json(result.data);
});

// Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));

// Listening for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));