
const express= require('express')
const mongoose=require('mongoose')
const url='mongodb://localhost/e_commerse'
const cors = require('cors');


const app=express()
app.use(cors()); 
app.use(express.json());
app.use(express.json());
mongoose.connect(url,{ useNewUrlParser:true})

const con = mongoose.connection
con.on('open', () => {
    console.log("MongoDB connection established ✅");
});

const postUserData =require('./Routes/users')
app.use('/usersData',postUserData)

const showServices = require('./Routes/service')
app.use('/services',showServices)

app.listen(9000,()=>{
    console.log("listerning")
})