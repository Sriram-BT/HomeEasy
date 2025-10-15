
const mongoose=require('mongoose')

const UsersData =new mongoose.Schema({
    Name:{type:String,require:true},
    Age:{type:Number,requre:true},
    Email:{type:String,require:true},
    PhoneNumber:{type:Number,require:true},
    Password:{type:String,require:true}
})




module.exports=mongoose.model("UsersData",UsersData)