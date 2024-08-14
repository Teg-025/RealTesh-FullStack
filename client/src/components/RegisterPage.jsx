import {React, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Button from './button/Button';
import './RegisterPage.css';

export default function RegisterPage(){

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [passwordMatch, setPasswordMatch] = useState(true);
    const navigate = useNavigate()

    useEffect(()=>{
        (formData.password === formData.confirmPassword || formData.confirmPassword === "") 
        ? setPasswordMatch(true)
        : setPasswordMatch(false)
    }, [formData.password, formData.confirmPassword])

    function handleChange(event){
        const {name, value} = event.target;
        setFormData((prevFormData)=>(
            {...prevFormData, [name]: value}
        ));
    }

    async function handleSubmit(event){
        event.preventDefault();

        try{
            const response = await fetch("https://realtesh.onrender.com/auth/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if(response.ok){
                navigate("/login")
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
                    type="text" 
                    name="firstName"
                    className="registerInput"
                    placeholder="First Name" 
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                />
                <input 
                    type="text" 
                    name="lastName"
                    className="registerInput"
                    placeholder="Last Name" 
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                />
                <input 
                    type="email" 
                    name="email"
                    className="registerInput"
                    placeholder="Email" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                />
                <input 
                    type="password" 
                    name="password"
                    className="registerInput"
                    placeholder="Password" 
                    required
                    value={formData.password}
                    onChange={handleChange}
                />
                <input 
                    type="password" 
                    name="confirmPassword"
                    className="registerInput"
                    placeholder="Confirm Password" 
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
                {
                    passwordMatch==false
                    ? (<p className="password-no-match">Passwords do not match</p>)
                    : null
                }
                <Button 
                    text = "Register"
                    disabled = {!passwordMatch}
                />
                <div className="login-ref">
                    Already have an account ? Login <a href="/login">here</a>
                </div>
            </form>
        </div>
    )
}