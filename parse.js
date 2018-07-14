const needle = require('needle');
const cheerio = require('cheerio');
const hostName = 'http://irr.by';
const countAds = process.argv[2] ? process.argv[2] : 50;

const options = {
    follow_max: 5,
    follow_set_cookies: true,
}

const countParam = countAds <= 20 ? '' : countAds < 60 ? "search/list=list/page_len40/" : "search/list=list/page_len60/";

const url = 'http://irr.by/realestate/longtime/' + countParam;


let promise = new Promise((resolve, reject) => {

});

let ads = getAdsByPageUrl(url);

// console.log(ads);

// while (ads.length < countAds) {
//     const nextPageUrl = getNextPageUrl($);
//     getAdsByPageUrl(hostName + nextPageUrl);
// }

// needle.get(url, options, (error, response) => {
//     // if (error) throw err;
//     // if (!error && response.statusCode == 200)
//     //
//     const $ = cheerio.load(response.body);
//     const ads = $('.add_list');
//
//     console.log(ads);
//
//     const adsObjects = [];
//
//     while (ads.length < countAds) {
//         const nextPageUrl = getNextPageUrl($);
//         getAdsByPageUrl(hostName + nextPageUrl);
//     }
//
//     ads.each((i, ad) => {
//         const adWrapper = $(ad);
//         const src = adWrapper.find('.add_title').attr('href');
//
//         let adObject = parseAd(src);
//
//         // adObject.date = adWrapper.find('.add_data').text();
//         // console.log( adWrapper.find('.add_data').text());
//     });
//     // callback();
// });

function parseAd(src) {
    return new Promise((resolve, reject) => {
        needle.get(src, options, (err, resp) => {
            let $ = cheerio.load(resp.body);

            let adObject = {
                title: $('h1').text(),
                content: $('p.text').text(),
                geoX: $('#geo_x').val(),
                geoY: $('#geo_y').val(),
            };
            resolve(adObject);
        });
    });
}

function getAdsByPageUrl(pageUrl) {
    let ads = [];

     needle.get(pageUrl, options, (error, response) => {
         const $ = cheerio.load(response.body);
//     const ads = $('.add_list');

        while (ads.length < countAds) {
            const nextPageUrl = getNextPageUrl($);
            new Promise((resolve, reject) => {
                getAdsByPageUrl(hostName + nextPageUrl);
            })
        }
        // console.log(ads);

        ads.each((i, ad) => {
            const adWrapper = $(ad);
            const src = adWrapper.find('.add_title').attr('href');

           // let adObject = {};
           parseAd(src).then( adObjectResult => {
               const adObject = adObjectResult;
               console.log(adObject);
           });



            // adObject.date = adWrapper.find('.add_data').text();
            // console.log( adWrapper.find('.add_data').text());
        });
    });

    return ads;
}

function getNextPageUrl($) {
    const pageNumber = $('.paginator_loadMore').data('nextPage');
    return $('#page' + pageNumber).find('a').attr('href');
}