var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://l22:654321@ds141796.mlab.com:41796/lrn_node'); 

module.exports = mongoose;