'use strict';

const path = require('path');

var development = require('./env/development');
var production = require('./env/production');

var defaults = {
    root: path.normalize(__dirname + '/..')
};

module.exports = {
    development: Object.assign({}, development, defaults),
    test: Object.assign({}, test, defaults)
}[process.env.NODE_ENV || 'development'];