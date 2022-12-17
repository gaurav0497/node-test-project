let uuid = require('uuid').v1;
let mongoose = require("./db");
mongoose.pluralize(null);

// grab the things we need
let Schema = mongoose.Schema;
const collection_name = "contacts"

// create a schema
let schema = new Schema({
  uuid: String,
  name:String,
  email:String,
  phone:String,
  user_id:String,
  relation:String,
  is_deleted:Boolean,
  deleted_by: Number,
  created_at: Date,
  updated_at: String,
});

schema.pre("save", function (next) {
  this.uuid = uuid();
  // get the current date
  let currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  next();
});

// the schema is useless so far
// we need to create a model using it
let env = process.env.DB_ENV || "development";
module.exports = mongoose.model(`${collection_name}_${env}`, schema);
