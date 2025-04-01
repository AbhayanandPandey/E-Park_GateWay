const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { log } = require('handlebars');
const UserSchema = new mongoose.Schema
({
    User_name:
    {type:String,required:true},
    email:
    {type:String,required:true,unique:true},
    password:
    {type:String,required:true},
    lastLogin: { type: Date, default: null },
    tokens:[{token:{type:String,required:true}}]
});
UserSchema.pre("save", async function(next){
    if(this.isModified("password"))
    {
        console.log(this.password)
        this.password =await bcrypt.hash(this.password,10)
        console.log(this.password)
    }
    next()
})
UserSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({_id:this._id.toString()},"token")
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        console.log(error)
    }
}
const Register = new mongoose.model('userdata1',UserSchema);
module.exports = Register;
