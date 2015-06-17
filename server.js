var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var fs         = require('fs');
var port       = process.env.PORT || 3000;
var _          = require('lodash');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    console.log(req.method + ' request on ' + req.url);
    next();
});

var routePath = "./routes/"; //add one folder then put your route files there my router folder name is routers
fs.readdirSync(routePath).forEach(function (file) {
    var fileName = (file !== 'index.js') ?
        file.substring(0, file.lastIndexOf('.')) :
        '';
    var route    = require(routePath + file);

    _.forIn(route, function (func, method) {
        app.route('/' + fileName)[method](func);
    });
});

app.use(function (req, res) {
    res.status(404);
    res.json({
        'message': 'Failed to ' + req.method + ' on ' + req.url
    });
});

app.listen(port);

console.log('Magic happens on port ' + port);
