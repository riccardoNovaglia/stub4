const express = require('express');
var bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json())

app.get('/test', function(req, res) {
  res.status(200).json({ hello: 'world' });
});

app.post('/new-stub', function(req, res, err) {
    const {method, url, responseBody} = req.body;

    if (!method || method === "GET") {
        app.get(url, (_, myRes) => {
            return myRes.json(responseBody);
        });
    } else if (method === 'POST') {
        app.post(url, (_, myRes) => {
            return myRes.json(responseBody);
        });
    }
    
    res.sendStatus(200);
});

module.exports = app;