// import models
const userModel = require("../models/users")
const sessionModel = require("../models/sessions")
const contactModel = require("../models/contacts")

const mute = require("immutable");
// Helpers


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

const create = function(data,response,cb){
    if(!cb){
        cb = response
    }
    const data_to_save = new contactModel({
        name:data.name,
        email:data.email,
        phone:data.phone,
        relation:data.relation,
        user_id:data.user_id,
        is_deleted:false,
    })
    data_to_save.save().then((_userData)=>{
       return cb(null,responseStruct
        .merge({
            signature: data.req.signature,
            action: "create",
            status: 204,
            success: true,
            message: "ok"
        }).toJS()
        );
    })
    .catch((err)=>{
        return cb(null,responseStruct
            .merge({
                signature: data.req.signature,
                action: "create",
                status: 500,
                success: false,
                message: "something went wrong."+process.env.NODE_ENV=="development"?err:""
            }).toJS()
        );
    })
}
exports.create = create;

const createBulk = function(data,response,cb){
    if(!cb){
        cb = response
    }
    const data_to_save = new contactModel({
        name:data.name,
        email:data.email,
        phone:data.phone,
        relation:data.relation,
        user_id:data.user_id,
    })
    data_to_save.save().then((_userData)=>{
       return cb(null,responseStruct
        .merge({
            
            action: "create",
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
                action: "create",
                status: 500,
                success: false,
                message: "something went wrong."+process.env.NODE_ENV=="development"?err:""
            }).toJS()
        );
    })
}
exports.createBulk = createBulk;

const update = function(data,response,cb){
    if(!cb){
        cb = response
    }
    const update_data = {
       ...(data.name && {name:data.name}),
       ...(data.email && {email:data.email}),
       ...(data.phone && {phone:data.phone}),
       ...(data.relation && {relation:data.relation}),
    }
    contactModel.findOneAndUpdate({_id:data.id},update_data).then((_userData)=>{
       return cb(null,responseStruct
        .merge({
            signature: data.req.signature,
            action: "update",
            status: 200,
            success: true,
            message: "sucess"
        }).toJS()
        );
    })
    .catch((err)=>{
        return cb(null,responseStruct
            .merge({
                signature: data.req.signature,
                action: "update",
                status: 500,
                success: false,
                message: "something went wrong."+process.env.NODE_ENV=="development"?err:""
            }).toJS()
        );
    })
}
exports.update = update;

const deleted = function(data,response,cb){
    if(!cb){
        cb = response
    }
    contactModel.findOneAndUpdate({_id:data.id},{is_deleted:true,deleted_by:data.user_id||653412}).then((_userData)=>{
       return cb(null,responseStruct
        .merge({
            signature: data.req.signature,
            action: "delete",
            status: 200,
            success: true,
            message: "ok"
        }).toJS()
        );
    })
    .catch((err)=>{
        return cb(null,responseStruct
            .merge({
                signature: data.req.signature,
                action: "delete",
                status: 500,
                success: false,
                message: "something went wrong."+process.env.NODE_ENV=="development"?err:""
            }).toJS()
        );
    })
}
exports.deleted = deleted

const deleteBulk = function(data,response,cb){
    if(!cb){
        cb = response
    }
    contactModel.findByIdAndUpdate({user_id:data.id},{is_deleted:true,deleted_by:data.user_id||653412}).then((_userData)=>{
        return cb(null,responseStruct
         .merge({
             signature: data.req.signature,
             action: "delete",
             status: 200,
             success: true,
             message: "ok"
         }).toJS()
         );
     })
    .catch((err)=>{
        return cb(null,responseStruct
            .merge({
                // 
                action: "create",
                status: 500,
                success: false,
                message: "something went wrong."+process.env.NODE_ENV=="development"?err:""
            }).toJS()
        );
    })
}
exports.deleteBulk = deleteBulk
