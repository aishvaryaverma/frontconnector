const express = require('express');
const connectDb = require('./config/db');
const path = require('path');
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
// app.use(cors());

// Init Middleware
app.use(express.json({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));

// Serving static assets in production

if(process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
    
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Listening for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));