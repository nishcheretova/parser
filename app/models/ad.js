'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Ad Schema
 */
const AdSchema = new Schema({
    title: {type: String},
    body: {type: String},
    location: {
        type: {
            type: String,
            enum: 'Point',
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    createdAt: {type: Date}
});

/**
 * Validations
 */
AdSchema.path('title').required(true, 'Ad title cannot be blank');
AdSchema.path('body').required(true, 'Ad body cannot be blank');

AdSchema.index({ "location": "2dsphere" });
AdSchema.index({ createdAt: 1, title: -1 }, { unique: true });

/**
 * Methods
 */
AdSchema.methods = {
    getNearestList: (lat, long, radius) => {
        this.find({
            location: {
                $near: {
                    $maxDistance: radius,
                    $geometry: {
                        type: "Point",
                        coordinates: [lat, long]
                    }
                }
            }
        });
    }
};

/**
 * Statics
 */
AdSchema.statics = {};
const Ad = mongoose.model('Ad', AdSchema);
module.exports = Ad;
