'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const Ad = mongoose.model('Ad');
const needle = require('needle');
const cheerio = require('cheerio');
const config = require('./../../config');

exports.listAds = async(function* (req, res) {

});

exports.parseAds = async(function* (req, res) {
    needle.get(config.url, function (err, res) {
        if (err) throw err;
        callback();
    });
    // exports.pa
});