var express = require('express');
var _ = require('lodash');
var db = require('./db');
var app = express();

app.listen('54677');

_.each(db, function(url, key) {
  console.log('loaded:', key);
  app.get('/' + key, function(req, res) {
    res.redirect(url);
  });
});
