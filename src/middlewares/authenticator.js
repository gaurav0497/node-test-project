'use strict'
const users = require('../controllers/users')

module.exports = function () {
  return function (req, res, next) {
    if (!req.data.request) {
      console.log("Invalid Request");
      var response = {
        success: false,
        message: 'Failed to authenticate token at Lv0'
      };
      return res.status(401).send(response);
    }

    let user_request = req.data.request;
    let user_ip = user_request.ip;
    let token = req.headers['x-access-token'];
    let account_id = req.headers['x-access-user'];
    let device_id = req.headers['x-device_id'];
    let device_session = req.headers['x-device_session'];
    let session_token = req.headers['x-session-token'];

    if (!token) {
      if (req.query['x-access-token']) {
        token = req.query['x-access-token'];
        account_id = req.query['x-access-user'];
      }
    }

    if (token) {
      // verify the token
      let payload = {
        token: token,
        account_id: account_id,
        req: req.data,
        user_ip: user_ip,
        device_id: device_id,
        device_session: device_session,
        session_token: session_token
      }
      users.validate_token_v2(payload, function (err, response) {
        if (err || !response.data) {
          console.log(err);
          var response = {
            success: false,
            message: 'Failed to authenticate token at Lv1'
          };
          return res.status(401).send(response);
        }
        if (response.data.refresh_token) {
          res.setHeader('x-refresh-token', response.data.refresh_token)
        }
        req.data.auth = response.data;
        next();
      });
    } else {
      // if there is no token
      // return an error
      var response = {
        success: false,
        message: 'Not Authorized'
      };
      return res.status(401).send(response);
    }

  }
}