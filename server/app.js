const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const app = express();
app.use(bodyParser.json());

app.get('/test', function(req, res) {
    res.status(200).json({ hello: 'world' });
});

app.post('/new-stub', function(req, res) {
    const method = _.get(req.body, 'requestMatchers.method', 'GET');
    const url = _.get(req.body, 'requestMatchers.url');

    const body = _.get(req.body, 'response.body', {});

    if (!method || method === 'GET') {
        app.get(url, (_, myRes) => {
            return myRes.json(body);
        });
    } else if (method === 'POST') {
        app.post(url, (_, myRes) => {
            return myRes.json(body);
        });
    }

    res.sendStatus(200);
});

module.exports = app;
