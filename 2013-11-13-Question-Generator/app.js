var express = require('express');
var mongoose = require('mongoose');

// model definitions
require('require-dir')('./models');

// route definitions
var home = require('./routes/home');
var assessments = require('./routes/assessments');

var app = express();
var RedisStore = require('connect-redis')(express);
mongoose.connect('mongodb://localhost/assessment');

// configure express
require('./config').initialize(app, RedisStore);

// routes
app.get('/', home.index);
app.get('/upload', assessments.index);
app.get('/input', assessments.displayTeacherDesign);
app.post('/input', assessments.create);


// start server & socket.io
var common = require('./sockets/common');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, {log: true, 'log level': 2});
server.listen(app.get('port'));
io.of('/app').on('connection', common.connection);
