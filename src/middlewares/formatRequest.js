const mute = require('immutable');
const crypto = require('crypto');
const utilities = require('../helpers/security');
const UA = require('ua-parser-js');

const responseStruct = mute.Map({
    signature: null,
    success: null,
    message: "",
    type: "validator",
    action: null,
    id: null,
    data: null,
    metadata: null,
    status: null
});

module.exports = function(req, res, next) {
    let browser = null;
    let os = "";
    let device_uid = "";
    if(req.headers['user-agent']){
        let current_ua = new UA(req.headers['user-agent']);
        browser = current_ua.getBrowser().name;
        browser = browser ? `${current_ua.getBrowser().name} ${current_ua.getBrowser().version}` : null;
        os = current_ua.getOS().name ? `${current_ua.getOS().name}` : null;
        if(req.headers['X-Device-UID']){
            device_uid = req.headers['X-Device-UID']
        }else{
            let format = JSON.stringify({
                ip: req.ip,
                ua: JSON.stringify(current_ua.getResult())
            })
            device_uid = crypto.createHash('md5').update(format).digest("hex");
        }
    }

    if(req.query.limit){
        if(!utilities.isNumber(req.query.limit)){
            return res.status(400).send(
                responseStruct.merge({
                    signature: data.req.signature,
                    action: "validate params",
                    status: 400,
                    success: false,
                    message: "Limit must be a number",
                }).toJS());
        }
        req.query.limit = parseInt(req.query.limit);
    }
    
    if(req.query.offset){
        if(!utilities.isNumber(req.query.offset)){
            return res.status(400).send(
                responseStruct.merge({
                    signature: data.req.signature,
                    action: "validate params",
                    status: 400,
                    success: false,
                    message: "Offset must be a number",
                }).toJS());
        }
        req.query.offset = parseInt(req.query.offset);
    }
    
    req.data = {};
    req.data.signature = gensig();
    req.data.request = {
        method: req.method,
        baseUrl: req.baseUrl,
        cookies: req.cookies,
        signedCookies: req.signedCookies,
        fresh: req.fresh,
        ip: req.ip,
        ips: req.ips,
        secure: req.secure,
        subdomains: req.subdomains,
        xhr: req.xhr,
        hostname: req.hostname,
        protocol: req.protocol,
        originalUrl: req.originalUrl,
        route: req.route,
        headers: req.headers,
        browser,
        os,
        device_uid
    }
    next();
}


const gensig = function(){
    const randomstring = require("randomstring");
    let sig = Date.now() + '.'
    sig += randomstring.generate({
        length: 13
    })
    return sig;
}