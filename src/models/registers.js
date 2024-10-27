const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema
({
    User_name:
    {
        type:String,
        required:true
    },
    email:
    {
        type:String,
        required:true,
        unique:true
    },
    password:
    {
        type:String,
        required:true
    }
});

const Register = new mongoose.model('userdata',UserSchema);
module.exports = Register;