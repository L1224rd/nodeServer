var express = require('express');
var mongoose = require('../dbInfo');

var app = express();

var Alert = mongoose.model('Alert', new mongoose.Schema({
    msg: String,
    time: Number
}));

app.get('/', function (req, res) {
    var query = req.query;
    Alert.find({}, function (error, data) {
        if (error) throw error;
        res.send(JSON.stringify(data));
    });
});

app.post('/', function (req, res) {
    var newAlert = new Alert(req.body).save(function (error, data) {
        if (error) throw error;
        res.json(data);
    });
});

app.delete('/delete/:id', function (req, res) {
    Alert.find({ _id: req.params.id.replace(/\-/g, " ") }).remove(function (error, data) {
        if (error) throw error;
        res.json(data);
    });
});

module.exports = app;