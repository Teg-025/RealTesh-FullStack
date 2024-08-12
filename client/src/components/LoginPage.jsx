import React, { useState } from "react";
import Button from "./button/Button";
import {useNavigate} from 'react-router-dom';
import { toast } from "react-toastify";
import './RegisterPage.css'

export default function LoginPage(){
    
    const [loginData, setLoginData] = useState({email: "",password: ""})

    function handleChange(event){
        const {value, name} = event.target;
        setLoginData((prevLoginData)=>{
            return {...prevLoginData, [name]: value}
        })
    }

    const navigate = useNavigate();
    
    async function handleSubmit(event){
        event.preventDefault();
        console.log(loginData)

        try{

            const response = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            })
            
            // Get data as token and user 
            // after authentication from server
            const LoggedIn = await response.json();

            if(LoggedIn.successful == 0){
                toast.error(LoggedIn.message)
            }
            else{
                const {token, existingUser} = LoggedIn;
                localStorage.setItem('token', token);
                localStorage.setItem('loggedInUser', JSON.stringify(existingUser));
                toast.success("Login successful!");
                navigate('/');
            }

        }
        catch(error){
            console.log(error);
        }
    }

    return(
        <div className="register-page">
            <form className="register-container" onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    name="email"
                    className="registerInput"
                    placeholder="Email" 
                    required
                    value={loginData.email}
                    onChange={handleChange}
                />
                <input 
                    type="password" 
                    name="password"
                    className="registerInput"
                    placeholder="Password" 
                    required
                    value={loginData.password}
                    onChange={handleChange}
                />
                <Button 
                    text = "LOG IN"
                    // disabled = {!passwordMatch}
                />
                <div className="login-ref">
                    Don't have an account ? Sign-up <a href="/register">here</a>
                </div>
            </form>
        </div>
    )
}