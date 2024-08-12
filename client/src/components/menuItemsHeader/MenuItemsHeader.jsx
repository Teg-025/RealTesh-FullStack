import React, { useEffect, useState } from "react";
import "./MenuItemsHeader.css";
import { json, useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';

export default function MenuItemsHeader(){

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect( () => {
        if(localStorage.getItem('loggedInUser')){
            setIsLoggedIn(true);
            const id = JSON.parse(localStorage.getItem('loggedInUser'))._id;
            setUserId(id)
        }
    }, [])

    const navigate = useNavigate();
    

    function handleLogOut(){
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        setIsLoggedIn(false);
        toast.success('Logged out successfully!');
        navigate('/');
    }

    return(
        <div className="right-menu-box">
            <a href="/properties">Properties</a>
            <a href="/addListing">Add Listing</a>
            <a href={`/profile/${userId}`}>Your Listings</a>
            {
                isLoggedIn
                ? (
                    <>
                        <a href={`/profile/${userId}`}>Wishlist</a>
                        <button className="btn" onClick={handleLogOut}>Logout</button>
                    </>
                )
                : (
                    <>
                        <a href="/register">Sign Up</a>
                        <a href="/login" ><button className="btn">Login</button> </a> 
                    </>
                )
            }
        </div>
    )
}