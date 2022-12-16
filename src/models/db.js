/**
 * Database config and initialization
 */
 require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const URI = process.env.ODB_URI;

const opt = {
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
    connectTimeoutMS: 10000,
    
    socketTimeoutMS: (process.env.NODE_ENV === "production" ? 3000000 : 30000),
};

let connstring = URI;

mongoose.connect(connstring, opt, function (err) {
    if (err) {
        console.log(err);
        console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
    } else {
        console.info("Connected to MongoDB");
    }
});

module.exports = mongoose;