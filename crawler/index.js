/*
TODO:
- startup express server
- read config file


*/
const fs = require('fs');
const { runScraper } = require('./runScraper.js');

let config;
/*
config = {
    status: "running" / "stop",
    minPrice: 0,
    maxPrice: 0,
    searchWord: "",
    excludeWords: [],
    autoBuy: false,
}
*/

// read config file every 5 seconds
setInterval(() => {
    fs.readFile('../config.json', (err, data) => {
        if (err) throw err;
        let tmp = JSON.parse(data);
        if (JSON.stringify(tmp) !== JSON.stringify(config)) {
            config = tmp;
            console.log('config updated');

            if (config.status === 'running') {
                // start searching
                runScraper({
                    minPrice: config.minPrice,
                    maxPrice: config.maxPrice,
                    searchWord: config.searchWord,
                    excludeWords: config.excludeWords,
                    autoBuy: config.autoBuy,
                })
            }
            else if (config.status === 'stop') {
                // stop searching
            }
        }
    });
}, 3000);


