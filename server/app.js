const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const app = express();
app.use(bodyParser.json());

app.get('/test', function(req, res) {
    res.status(200).json({ hello: 'world' });
});

function respondJson(body) {
    return (req, res) => {
        return res.json(body);
    };
}

function respondText(body) {
    return (req, res) => {
        return res.set('Content-Type', 'text/plain').send(body);
    };
}

app.post('/new-stub', function(req, res) {
    const method = _.get(req.body, 'requestMatchers.method', 'GET');
    const url = _.get(req.body, 'requestMatchers.url');

    const responseType = _.get(req.body, 'response.type', 'json');
    const body = _.get(
        req.body,
        'response.body',
        responseType === 'json' ? {} : ''
    );
    const response =
        responseType === 'json' ? respondJson(body) : respondText(body);

    if (method === 'GET') {
        app.get(url, response);
    } else if (method === 'POST') {
        app.post(url, response);
    }

    res.sendStatus(200);
});

module.exports = app;
