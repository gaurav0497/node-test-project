const mongoose = require('../models/db');

module.exports = function(req, res, next) {
    if(mongoose.connection.readyState === 1){
        next();
    }else{
        return res.status(400).send({
            success: false, 
            message: 'Mongo not running.'
        });
    }
}