const request = require('request'),
    Promise = require('promise');

module.exports = (url) => {
    return new Promise((success, failure) => {
        request(url, (error, response, body) => {
            if (response.statusCode == 400)
                success(JSON.stringify({
                    error: "There is no result"
                }));
            else if (!error)
                success(body);
            else
                failure(error);
        });
    });
};