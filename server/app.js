const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const app = express();
app.use(bodyParser.json());

app.get('/test', function(req, res) {
    res.status(200).json({ hello: 'world' });
});

app.post('/new-stub', function(req, res) {
    const method = _.get(req.body, 'requestMatcher.method', 'GET');
    const url = _.get(req.body, 'requestMatcher.url');

    if (!url)
        return res
            .status(500)
            .json({ error: 'A request matcher url must be provided!' });

    const response = setupResponse(req);

    method === 'GET' ? app.get(url, response) : app.post(url, response);

    res.sendStatus(200);
});

function setupResponse(req) {
    const responseType = _.get(req.body, 'response.type', 'json');

    return prepareResponse(
        _.get(req.body, 'response.body', responseType === 'json' ? {} : ''),
        responseType === 'json' ? 'application/json' : 'text/plain'
    );
}
function prepareResponse(body, contentType) {
    return (req, res) => {
        return res.set('Content-Type', contentType).send(body);
    };
}

module.exports = app;
