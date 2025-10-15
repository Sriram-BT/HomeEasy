import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../Api/axios";

export default function SighIn() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState(true);
    const navigate = useNavigate();
    const [userData,setUserData]=useState([])


       useEffect(()=>{
        fetchUserDetails()
    },[])


    async function fetchUserDetails(){
        const res = await api.get("/usersData")
        setUserData(res.data)
        console.log("data",userData)
    }

    

     function Login(e) {
        e.preventDefault(); 
        const user = userData.find(u=> u.Name===name)
        console.log("user",user)
        if(user){
            if(user.Password === password){
                console.log("login Success",user)
                navigate("/home")
            }else{
                setLogin(false)
            }
        } 
    }




    return (
        <>
            <div style={{
                backgroundColor: 'grey',
                width: '280px',
                margin: '10% auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: '8px',
                boxShadow: '0px 2px 8px rgba(0,0,0,0.2)'
            }}>
                <form
                    onSubmit={Login}
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <input
                        style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
                        value={name}
                        placeholder="Enter the user name"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
                        type="password"
                        value={password}
                        placeholder="Enter the password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {!login && (
                        <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>
                            Entered password is wrong
                        </p>
                    )}

                    <button
                        type="submit"
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#333',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Log In
                    </button>
                </form>

                <p style={{ fontSize: '12px', marginTop: '15px', textAlign: 'center' }}>
                    If you don’t have an account create a new one
                </p>
                <Link
                    style={{
                        fontSize: '13px',
                        textDecoration: 'none',
                        marginTop: '5px',
                        color: 'purple'
                    }}
                    to='/create'
                >
                    Create new account
                </Link>
            </div>
        </>
    );
}
