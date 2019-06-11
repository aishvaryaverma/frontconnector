const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    // Get Token from header
    const token = req.header('x-auth-token');

    // check if no Token
    if(!token) {
        return res.status(401).json({ msg: "No Token, Authorization denied" })
    }

    // Verify Token
    try {
        const decoded = jwt.verify(token, config.get('jwtToken'));
        req.user = decoded.user;
        next();
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: "Token is not valid" })
    }
};