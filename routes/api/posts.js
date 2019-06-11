const express = require('express');
const route = express.Router();

/**
 * @Route       get api/users
 * @desc        test Route
 * @access      Public
 */
route.get('/', (req, res) => res.send('Posts API'))

module.exports = route;