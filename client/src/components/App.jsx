import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from './HomePage';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import AddListingPage from './AddListingPage';
import PropertiesPage from "./PropertiesPage";
import PropertyPage from "./PropertyPage";
import ProfilePage from "./ProfilePage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';


export default function App(){
    return(
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/addListing" element={<AddListingPage />} />
                    <Route path="/properties" element={<PropertiesPage />} />
                    <Route path="/properties/:listingId" element={<PropertyPage />} />
                    <Route path="/profile/:userId" element={<ProfilePage />} />
                </Routes>
            </BrowserRouter>
            <ToastContainer
                position = "bottom-right"
                autoClose = {4000}
                hideProgressBar
                closeOnClick
                pauseOnHover
                draggable
            />
        </div>
    )
}
