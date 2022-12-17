require('dotenv').config();
const express = require('express');
const cors=require('cors')
const bodyParser = require('body-parser');
const helmet = require('helmet');

// Routes import
const index = require('./routes/index');
const userRoute = require('./routes/users');
const contactRoute = require('./routes/contacts');


let app = express();

// middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Device");
    res.header("Access-Control-Expose-Headers","x-refresh-token")
    next();
});

// Healthcheck
app.use('/', index);

// routes
app.use('/users',userRoute);
app.use('/contacts',contactRoute)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.send({
      success: false,
      message: res.locals.message,
      error: res.locals.error
    });
    
});

module.exports = app;