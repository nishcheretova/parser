require('./mongoose_connet');
const needle = require('needle');
const cheerio = require('cheerio');
const Ad = require('./app/models/ad');
const hostName = 'http://irr.by';
const countAds = process.argv[2] ? process.argv[2] : 50;

const options = {
    follow_max: 5,
    follow_set_cookies: true,
};

const countParam = countAds <= 20 ? '' : countAds < 60 ? "search/list=list/page_len40/" : "search/list=list/page_len60/";

const url = 'http://irr.by/realestate/longtime/' + countParam;

let adsPromise = getAdsByPageUrl(url, countAds);

adsPromise.then((ads) => saveAds(ads));

function saveAds(ads) {
    for (const ad in ads) {
        const adModel = new Ad(ads[ad]);
        adModel.save(function (err, ad) {
            if (err) return console.error(err);
        });
    }
}

function parseAd(src) {
    return new Promise((resolve, reject) => {
        needle.get(src, options, (err, resp) => {
            let $ = cheerio.load(resp.body);

            const geoX = $('#geo_x');
            const geoY = $('#geo_y');

            let adObject = {
                body: $('p.text').text()
            };

            if (geoX.length && geoY.length) {
                adObject.location = {
                    type: "Point",
                    coordinates: [
                        parseFloat(geoX.val()),
                        parseFloat(geoY.val())
                    ],
                };
            }
            resolve(adObject);
        });
    });
}

function getAdsByPageUrl(pageUrl, remaining) {

    return needle('get', pageUrl, options).then((response) => {
        const $ = cheerio.load(response.body);
        const ads = $('.add_list');
        let adsSet = [];

        ads.each((i, ad) => {
            if (i >= remaining) {
                return false;
            }
            let adCheckPromise = new Promise((resolve, reject) => {
                const adWrapper = $(ad);
                const src = adWrapper.find('.add_title').attr('href');

                parseAd(src).then((adObject) => {
                    adObject.createdAt = parseStringToDate(adWrapper.find('.add_data').text());
                    adObject.title = adWrapper.find('.add_title').text();
                    resolve(adObject);
                });
            });
            adsSet.push(adCheckPromise);
        });

        remaining -= ads.length;

        let adsPromise;

        if (remaining > 0) {
            const nextPageUrl = getNextPageUrl($);
            adsPromise = getAdsByPageUrl(hostName + nextPageUrl, remaining);
        }

        return new Promise((resolve, reject) => {
            if (adsPromise) {
                adsPromise.then((prevAds) => {
                    Promise.all(adsSet).then((parsedAds) => resolve(parsedAds.concat(prevAds)));
                })
            } else {
                Promise.all(adsSet).then((parsedAds) => resolve(parsedAds));
            }
        }).then((adsl) => adsl);
    });
}

function parseStringToDate(stringDate) {
    let arrayDateTime = stringDate.split(', ');
    let arrayDate = arrayDateTime[1].split('.');

    let timeISO = arrayDate[2] + '-' + arrayDate[1] + '-' + arrayDate[0] + 'T' + arrayDateTime[0];

    return new Date(timeISO);
}

function getNextPageUrl($) {
    const pageNumber = $('.paginator_loadMore').data('nextPage');
    return $('#page' + pageNumber).find('a').attr('href');
}