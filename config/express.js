'use strict';

/**
 * Module dependencies.
 */
const express = require('express');
const session = require('express-session');
const compression = require('compression');
const cors = require('cors');

const pkg = require('../package.json');


module.exports = function (app) {
    
    // Compression middleware (should be placed before express.static)
    app.use(compression({
        threshold: 512
    }));

    app.use(cors({
        origin: ['http://localhost:3000', 'https://reboil-demo.herokuapp.com'],
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        credentials: true
    }));
};