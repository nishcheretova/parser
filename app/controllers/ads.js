'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const {wrap: async} = require('co');
const Ad = mongoose.model('Ad');
const needle = require('needle');
const adModel = require('../models/ad');
const config = require('../../config');

const DEFAULT_LONG = 53.906643;
const DEFAULT_LAT = 27.458462;
const DEFAULT_RADIUS = 10;


exports.listAds = function (req, res) {
    let long = req.query.long || DEFAULT_LONG;
    let lat = req.query.lat || DEFAULT_LAT;
    let radius = req.query.radius || DEFAULT_RADIUS;

    return adModel.find({
        location: {
            $near: {
                $maxDistance: radius * 1000,
                $geometry: {
                    type: "Point",
                    coordinates: [long, lat]
                }
            }
        }
    }).then((models) => {
        res.json(models);
    });

};

exports.getAdsList = async(function* (req, res) {
    console.log(adModel.findAll());
    needle.get(config.url, function (err, res) {
        if (err) throw err;
        callback();
    });
});

exports.listWords = function (req, res) {
    var o = {};
    o.map = function () {
        var words = this.body.toLowerCase().split(/(\s|\.|\d)+/);

        for (var i = 0; i < words.length; i++) {
            var word = words[i].trim();
            if (word) {
                emit(word, 1);
            }

        }
    };
    o.reduce = function (k, vals) {
        return vals.length;
    };
    return adModel.mapReduce(o).then((results) => {
        results = results.sort((a, b) => {
            return a.value < b.value ? 1 : -1;
        });
        let set = {};
        for (let i in results) {
            set[results[i]._id] = results[i].value;
        }

        res.json(set);
    })
};