// import models
const userModel = require("../models/users")
const sessionModel = require("../models/sessions")

const mute = require("immutable");
// Helpers

const { validateEmail,generate_account_id,validatePassword,generatePassword,comparePassword,encryptData,generate_random_signature } = require("../helpers/security")

const responseStruct = mute.Map({
    signature: null,
    success: null,
    message: "",
    type: "users",
    action: null,
    id: null,
    data: null,
    metadata: null,
    status: null
});

const createUser = function(data,response,cb){
    if(!cb){
        cb = response
    }
    const data_to_save = new userModel({
        name:data.name,
        account_id:data.account_id,
        email:data.email,
        phone:data.phone,
        password:data.password,
        salt:data.salt,
    })
    data_to_save.save().then((_userData)=>{
       return cb(null,responseStruct
        .merge({
            
            action: "createUser",
            status: 204,
            success: true,
            message: "ok"
        }).toJS()
        );
    })
    .catch((err)=>{
        return cb(null,responseStruct
            .merge({
                // 
                action: "createUser",
                status: 500,
                success: false,
                message: "something went wrong."+process.env.NODE_ENV=="development"?err:""
            }).toJS()
        );
    })
}
exports.createUser = createUser;

const signup = function (data, response, cb, type = 1) {
    let msg = "";
    let error_msg = false;
    if (!cb) {
        cb = response;
    }
    if (!data.email || !validateEmail(data.email)) {
        msg = "Please enter valid email";
        error_msg = true;
    }
    if (!data.password || !validatePassword(data.password)) {
        msg = msg != "" ? msg : "Please enter valid password";
        error_msg = true;
    }

    if (!data.email || !data.name || !data.phone) {
        return cb(
            responseStruct
                .merge({
                    
                    action: "signup",
                    status: 402,
                    success: false,
                    message: "Params missing",
                })
                .toJS()
        );
    }

    if (error_msg) {
        return cb(
            responseStruct
                .merge({
                    
                    action: "signup",
                    status: 400,
                    success: false,
                    message: msg,
                })
                .toJS()
        );
    }
   
    let where = {
        $or:[{email:data.email.toLowerCase()},{phone:data.phone}]
    }
    userModel.find(where).then((_res)=>{
        if(_res.length>0){
            return cb(
                responseStruct
                    .merge({
                        
                        action: "signup",
                        status: 400,
                        success: false,
                        message: "Email or Phone Number already exists",
                    })
                    .toJS()
            );
        }
        else{
            generate_account_id(function (err, account_id) {
                if (err) {
                    console.log(err);
                    return cb(
                        responseStruct
                            .merge({
                                
                                action: "signup",
                                status: 400,
                                success: false,
                                message: "Something Went Wrong",
                            })
                            .toJS()
                    );
                }
    
                let insert_data = {
                    email: data.email.toLowerCase(),
                    name: data.name || "",
                    phone: data.phone || null,
                    account_id: account_id,
                };
                generatePassword(data.password, function (err, gen) {
                    if (err) {
                        console.log(err);
                        return cb(
                            responseStruct
                                .merge({
                                    
                                    action: "signup",
                                    status: 400,
                                    success: false,
                                    message: "Something Went Wrong",
                                })
                                .toJS()
                        );
                    }
                    insert_data.password = gen.hash;
                    insert_data.salt = gen.salt;
                    createUser(insert_data, function (err, _res) {
                        if (err) {
                            return cb(
                                responseStruct
                                    .merge({
                                        
                                        action: "signup",
                                        status: 400,
                                        success: false,
                                        message: "Something Went Wrong",
                                    })
                                    .toJS()
                            );
                        }
                        return cb(
                            responseStruct
                                .merge(null, {
                                    
                                    action: "signup",
                                    status: 204,
                                    success: true,
                                    data: _res,
                                    message: "User Added successfully",
                                })
                                .toJS()
                        );
                    }); 
                });
            });
        }
    })
    .catch((err)=>{
        return cb(
            responseStruct
                .merge({
                    // 
                    action: "signup",
                    status: 400,
                    success: false,
                    message: "Something Went Wrong",
                })
                .toJS()
        );
    })
};
exports.signup = signup;

const login = function (data, response, cb) {
    let msg = "";
    let error_msg = false;
    if (!cb) {
        cb = response;
    }

    if (!data.email || !data.password) {
        return cb(
            responseStruct
                .merge({
                    action: "login",
                    status: 400,
                    success: false,
                    message: "params missing",
                })
                .toJS()
        );
    }

    let return_data = {
        email: data.email.toLowerCase(),
    };
    userModel.find({ email: return_data.email }, function (err, user_details) {
        if (err) {
            return cb(
                responseStruct
                    .merge({
                        signature: data.req.signature,
                        action: "login",
                        status: 401,
                        success: false,
                        message: "Invalid Credentials",
                    })
                    .toJS()
            );
        }
        if (user_details.length <= 0) {
            return cb(
                responseStruct
                    .merge({
                        signature: data.req.signature,
                        action: "login",
                        status: 401,
                        success: false,
                        message: "Invalid Credentials",
                    })
                    .toJS()
            );
        }
        comparePassword(data.password, user_details[0].password, function (err, is_ok) {
            if (err || !is_ok) {
                return cb(
                    responseStruct
                        .merge({
                            signature: data.req.signature,
                            action: "login",
                            status: 401,
                            success: false,
                            message: "Invalid Credentials",
                        })
                        .toJS()
                );
            }
            return_data = {
                ...return_data,
                id: user_details[0].id,
                name: user_details[0].name,
                account_id: user_details[0].account_id,
                phone: user_details[0].phone,
            };

            let data_to_encrypt = {
                id: user_details[0].id,
                name: user_details[0].name,
                account_id: user_details[0].account_id,
                phone: user_details[0].phone,
                email: user_details[0].email,
                timestamp: Date.now(),
            };

            encryptData(data_to_encrypt, user_details[0].salt, function (err, token) {
                if (err || !token) {
                    console.log(err);
                    return cb(
                        responseStruct
                            .merge({
                                signature: data.req.signature,
                                action: "login",
                                status: 401,
                                success: false,
                                message: "Invalid Credentials",
                            })
                            .toJS()
                    );
                }
                // store token
                let forward_data = {
                    signature: data.req.signature,
                    action: "login",
                    status: 200,
                    success: true,
                    message: "",
                    data: {
                        ...return_data,
                        token: token,
                    },
                    id: user_details[0].id,
                };
                return create_session(data, forward_data, cb);
            });
        });
    });
};
exports.login = login;

const create_session = function (data, response, cb) {
    if (!cb) {
        cb = response;
    }
    // create new session
    let user_ip = data.req.ip || data.req.request.ip;
    let device_id = "di_" + generate_random_signature(7);
    let device_session = "ds_" + generate_random_signature(8);
    let token_type = "auth";
    let token = response.data.token;
    let id = response.data.account_id;
    // let signature = response.signature;
    let device_info = "";

    if (data.req?.request) {
        device_info = data.req.request.headers["user-agent"];
    }
    
    let sessionData = new sessionModel({
        user: id,
        token: token,
        token_type: token_type,
        user_ip: user_ip,
        browser: data.req.request.browser,
        os: data.req.request.os,
        device_id: device_id,
        device_session: device_session,
        device_info: device_info,
        is_active: true,
    });
    sessionData.save().then((_res)=>{
        let forward_response = response;
        forward_response.data.device_id = sessionData.device_id;
        forward_response.data.device_session = sessionData.device_session;
        delete forward_response.data.id;
        forward_response.id = response.data.account_id;
        return cb(null, forward_response);
    })
    .catch((err)=>{
        console.log("sessions.insert", err);
            return cb(
                responseStruct
                    .merge({
                        signature: data.req.signature,
                        action: "sessions",
                        status: 500,
                        success: false,
                        message: "Something went wrong!",
                    })
                    .toJS()
            );
    })
};
exports.create_session = create_session;

const logout = function (data, response, cb) {
    if (!cb) {
        cb = response;
    }

    if (!data.req.signature || !data.req.request.headers) {
        return cb(
            responseStruct
                .merge({
                    signature: data.req.signature,
                    action: "logout",
                    status: 400,
                    success: false,
                    message: "params missing",
                })
                .toJS()
        );
    }

    let exp_sess_data = {
        token: data.req.request.headers["x-access-token"]
    };
    sessionModel.findOneAndUpdate(exp_sess_data,{is_active:false,end_reason: "user_logged_out"}, function (err, res) {
        if (err) {
            return cb(
                responseStruct
                    .merge({
                        signature: data.req.signature,
                        action: "logout",
                        status: 500,
                        success: false,
                        message: "Something went wrong",
                    })
                    .toJS()
            );
        }
    });
    return cb(
        null,
        responseStruct
            .merge({
                signature: data.req.signature,
                action: "logout",
                status: 204,
                success: true,
                message: "Succesfully logged out.",
            })
            .toJS()
    );
};
exports.logout = logout;