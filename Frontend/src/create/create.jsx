
import React, { useState } from "react";
import api from "../Api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateUser(){
    const[userName,setUserName]=useState('')
    const [age,setAge]=useState('')
    const [mail,setMail]=useState('')
    const [phoneNumber,setPhoneNumber]=useState('')
    const [password,setPassword]=useState('')
    const navigate = useNavigate()

    async function submit(e){
        e.preventDefault();
        try{
            const res = await api.post("/usersData",{
                Name: userName,
                Age: age,
                Email: mail,
                PhoneNumber: phoneNumber,
                Password:password
            });
            console.log("userCreated",res.data)
                navigate('/sighin')
        }catch(err){
            console.log("err",err)
        }
    
    }
    return(
        <>
        <div style={{alignItems:'center',marginLeft:'30%',marginTop:'7%',backgroundColor:'grey',width:'30%',padding:'10px 30px 10px'}}>
        <form>
            <input style={{width:'100%',marginBottom:'10px'}} placeholder="Enter Your Name" type="text" value={userName} onChange={(e)=>{setUserName(e.target.value)}}>
            </input>
            <input style={{width:'100%',marginBottom:'10px'}} placeholder="Enter Your Age" type="number" value={age} onChange={(e)=>{setAge(e.target.value)}}>
            </input>
            <input style={{width:'100%',marginBottom:'10px'}} placeholder="Enter your E-mail" type="mail" value={mail} onChange={(e)=>{setMail(e.target.value)}}></input>
            <input style={{width:'100%',marginBottom:'10px'}} placeholder="Enter Your Phone Number" value={phoneNumber} onChange={(e)=>{setPhoneNumber(e.target.value)}}></input>
            <input style={{width:'100%',marginBottom:'10px'}} placeholder="Enter Your Password" value={password} onChange={(e)=>{setPassword(e.target.value)}}></input>
            <button onClick={submit} style={{marginLeft:'43%'}} type="submit">Submit</button>
        </form>
        </div>
        </>
    )
}