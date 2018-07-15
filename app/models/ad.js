'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Ad Schema
 */
const AdSchema = new Schema({
    title: {type: String},
    body: {type: String},
    location: {type: String, coordinates: [Number]},
    createdAt: {type: Date}
});

/**
 * Validations
 */
AdSchema.path('title').required(true, 'Ad title cannot be blank');
AdSchema.path('body').required(true, 'Ad body cannot be blank');

/**
 * Methods
 */
AdSchema.methods = {};

/**
 * Statics
 */
AdSchema.statics = {};
const Ad = mongoose.model('Ad', AdSchema);
module.exports = Ad;


