const needle = require('needle');
const cheerio = require('cheerio');
const hostName = 'http://irr.by';
const countAds = process.argv[2] ? process.argv[2] : 50;

const options = {
    follow_max: 5,
    follow_set_cookies: true,
};

const countParam = countAds <= 20 ? '' : countAds < 60 ? "search/list=list/page_len40/" : "search/list=list/page_len60/";

const url = 'http://irr.by/realestate/longtime/' + countParam;

let adsPromise = getAdsByPageUrl(url, countAds);

adsPromise.then((ads) => console.log(ads));

function parseAd(src) {
    return new Promise((resolve, reject) => {
        needle.get(src, options, (err, resp) => {
            let $ = cheerio.load(resp.body);

            let adObject = {
                content: $('p.text').text(),
                geoX: $('#geo_x').val(),
                geoY: $('#geo_y').val(),
            };
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
            console.log(i);
            if (i >= remaining) {
                return false;
            }
            let adCheckPromise = new Promise((resolve, reject) => {
                const adWrapper = $(ad);
                const src = adWrapper.find('.add_title').attr('href');

                parseAd(src).then((adObject) => {
                    adObject.date = adWrapper.find('.add_data').text();
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
                    adsSet = adsSet.concat(prevAds);
                    resolve(adsSet);
                })
            } else {
                Promise.all(adsSet).then((parsedAds) => resolve(parsedAds));
            }
        }).then((adsl) => adsl);
    });
}

function getNextPageUrl($) {
    const pageNumber = $('.paginator_loadMore').data('nextPage');
    return $('#page' + pageNumber).find('a').attr('href');
}