'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Ad Schema
 */
var AdSchema = new Schema({
    title: { type : String, default : '', trim : true },
    body: { type : String, default : '', trim : true },
    location: { type: { type: String, default:'Point' }, coordinates: [Number] },
    createdAt: { type: Date, default: Date.now }
});

/**
 * Validations
 */
AdSchema.path('title').required(true, 'Ad title cannot be blank');
AdSchema.path('body').required(true, 'Ad body cannot be blank');

/**
 * Methods
 */
AdSchema.methods = {

};

/**
 * Statics
 */
AdSchema.statics = {

};

mongoose.model('Ad', AdSchema);
