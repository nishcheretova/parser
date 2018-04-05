'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const Ad = mongoose.model('Ad');
const needle = require('needle');

exports.listAds = async(function* (req, res) {

});

exports.parseAds = async(function* (req, res, url) {
    needle.get()
    // exports.pa
});