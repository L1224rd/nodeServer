//======================== IMPORT EXTERN MODULES ========================//

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

//========================= IMPORT LOCAL MODULES =========================//

// var alertProvider = require('./routes/alert');
// var userProvider = require('./routes/user');
var vjsTodo = require('./routes/vjsTodo');

var app = express();

//================== SET ENGINE TO RENDER HTML CONTENT ==================//

app.set('view engine', 'ejs');

//======================== MIDDLEWARE ========================//

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

//======================== HOME PAGE ========================//

app.get('/', function (req, res) {
    res.render('home');
});

//======================== ROUTES ========================//

// app.use('/alert', alertProvider);
// app.use('/user', userProvider);
app.use('/vjs_todo', vjsTodo);

//======================== 404 ========================//

app.get('*', function (req, res) {
    res.render('404', { url: req.url, ip: req.ip });
});

//======================== LISTENING PORT ========================//

app.listen(3000);

