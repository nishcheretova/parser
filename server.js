'use strict';

/**
 * Module dependencies
 */

require('dotenv').config();
const mongooseConnection = require('./mongoose_connet');

const fs = require('fs');
const join = require('path').join;
const mongoose = require('mongoose');
const express = require('express');
const config = require('./config');

const models = join(__dirname, 'app/models');
const port = process.env.PORT || 3000;


const app = express();

module.exports = app;

// Bootstrap models
fs.readdirSync(models)
    .filter(file => ~file.search(/^[^\.].*\.js$/))
    .forEach(file => require(join(models, file)));

// Bootstrap routes
require('./config/express')(app);
require('./config/routes')(app);

mongooseConnection.on("connected", function(ref) {
    listen();
});

function listen () {
    if (app.get('env') === 'test') return;
    app.listen(port);
    console.log('Express app started on port ' + port);
}
