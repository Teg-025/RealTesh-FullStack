import React, { useState, useEffect } from "react";
import Header from './header/Header';
import Footer from "./footer/Footer";
import { useParams, useNavigate } from "react-router-dom";
import ProfileListing from "./profileListing/ProfileListing";
import { toast } from "react-toastify";
import { PuffLoader } from "react-spinners";
import './ProfilePage.css';

export default function ProfilePage() {
    const [wishList, setWishList] = useState([]);
    const [userListing, setUserListing] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { userId } = useParams();
    const navigate = useNavigate();
    const [isWishListLoading, setIsWishListLoading] = useState(true);
    const [isUserListLoading, setIsUserListLoading] = useState(true);
    let userEmail;

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

        // Check if the user is logged in
        if (!loggedInUser) {
            toast.error("Please login to access profile!");
            navigate('/')
            return;
        }

        userEmail = loggedInUser.email;
        setIsAuthenticated(true);

        async function fetchWishList() {
            try {
                const response = await fetch("http://localhost:8000/wishList/getWishList", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId })
                });
                const data = await response.json();
                console.log(data);
                setWishList(data.wishListings);
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            } finally {
                setIsWishListLoading(false);
            }
        }

        async function fetchUserListings() {
            try {
                const response = await fetch("http://localhost:8000/get/checkUserListings", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userEmail })
                });
                const data = await response.json(); 
                setUserListing(data.userListings);
            } catch (error) {
                console.log(error);
            } finally{
                setIsUserListLoading(false)
            }
        }

        fetchWishList();
        fetchUserListings();

    }, [userId, navigate]);

    if (!isAuthenticated) {
        return null;
    }


    return (
        <div className="profile-page-container">
            <Header />
            <div className="profile-page-body">
                {
                    isWishListLoading
                    ?   <div className="flexCenter">
                            <PuffLoader 
                                height={80}
                                width={80}
                                radius={1}
                                color="#4066ff"
                                aria-label="puff-loading"
                            />
                        </div>
                    :   <ProfileListing 
                            heading="Your Wishlist"
                            profileListings={wishList}
                            userEmail={userEmail}
                            headingColor="#4086c1"
                            notExistText="Properties marked as favourite will appear here"
                        />
                }
                {
                    isUserListLoading
                    ?   <div className="flexCenter">
                            <PuffLoader 
                                height={80}
                                width={80}
                                radius={1}
                                color="#4066ff"
                                aria-label="puff-loading"
                            />
                        </div>
                    :   <ProfileListing
                            heading="Your Listings"
                            profileListings={userListing}
                            userEmail={userEmail}
                            headingColor="#db7f51"
                            notExistText="Listings made by you will appear here"
                        />
                }
            </div>
            <Footer />
        </div>
    );
}