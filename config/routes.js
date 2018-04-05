
'use strict';

/*
 * Module dependencies.
 */

const ads = require('../app/controllers/ads');

/**
 * Expose
 */
module.exports = function (app) {
    app.get('/api/ads', ads.listAds);
    app.get('/api/parse', ads.parseAds);
};