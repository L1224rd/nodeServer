var express = require('express');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var mongoose = require('../dbInfo');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

var User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String,
    profile: {
        name: String,
        email: String,
        address: String
    }
}));

app.post('/register', function (req, res) {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        var user = {
            username: req.body.username,
            password: hash,
            profile: {
                name: '',
                email: '',
                address: ''
            }
        };
        var newUser = User(user).save(function (error, data) {
            if (error) throw error;
            bcrypt.hash(data.password + '_ls', 10, function (errorLocalStorage, hashLocalStorage) {
                res.json({
                    status: true,
                    msg: 'Success',
                    userLocalStorageHash: hashLocalStorage
                });
            });
        });
    });
});

app.post('/login', function (req, res) {
    User.findOne({ username: req.body.username }, function (error, data) {
        if (data !== null && data !== undefined) {
            bcrypt.compare(req.body.password, data.password, function (err, bcResponse) {
                if (bcResponse) {
                    res.json({
                        status: true,
                        msg: 'Success',
                        userProfile: data.profile
                    });
                } else {
                    res.json({
                        status: false,
                        msg: 'Incorrect password'
                    });
                }
            });
        } else {
            res.send({
                status: false,
                msg: 'User not found'
            });
        }
    });
});

app.post('/profile', (req, res) => {
    User.findById(req.body.id, (errorMongoose, data) => {
        if (data !== null && data !== undefined) {
            bcrypt.compare(data.password + '_ls', req.body.localStorageHash, (errorCompare, result) => {
                if (result) {
                    res.json({
                        status: true,
                        userProfile: data.profile
                    });
                } else {
                    res.json({
                        status: false,
                        msg: 'Access Denied'
                    });
                }
            });
        } else {
            res.json({
                status: false,
                msg: 'Id not found'
            })
        }
    });
});

app.patch('/edit', (req, res) => {
    User.findById(req.body.id, (errorMongoose, data) => {
        if (data !== null && data !== undefined) {
            User.update(
                { _id: req.body.id },
                JSON.parse(req.body.data),
                (error, data) => {
                    res.json({
                        status: true,
                        msg: 'Success'
                    });
                }
            );
        } else {
            res.json({
                status: false,
                msg: 'Id not found'
            })
        }
    });
});


module.exports = app;