const express = require('express');
const connectDb = require('./config/db');
// const cors = require('cors');
const app = express();

// Connect Database
connectDb();

// CORS
// var whitelist = ['http://localhost:3000', 'http://127.0.0.1:3000']
// var corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// }
// app.use(cors(corsOptions));

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