var express = require('express');
var UAParser = require('ua-parser-js');
var LRU = require('lru-cache');

var cache = LRU(100);

var db = require('./db');
var app = express();

function Item(path) {

  var rule = db[path];
  var index = rule.reduce(function(memo, item) {
    memo[item['os.name']] = item.target;
    return memo;
  }, {});

  this.index = index;
}

Item.prototype.get = function(osname) {
  return this.index[osname];
};

app.listen('54677');

app.use(function(req, res, next) {
  var parser = new UAParser();
  ua = req.headers['user-agent'];
  req.userAgent = parser.setUA(ua).getResult();
  return next();
});

app.get('/:key', function(req, res) {
  console.log(req.userAgent);
  var key = req.params.key;
  var item = new Item(key);
  var url = item.get(req.userAgent.os.name);

  console.log(url);

  if (url) {
    res.redirect(url);
    return;
  }
  return res.status(404).json({
    message: 'not found'
  });
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
