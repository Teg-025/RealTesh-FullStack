import React, { useEffect, useState } from "react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { toast } from "react-toastify"; // Add this import for toast notifications
import './FavouriteButton.css';

export default function FavoriteButton({ listingId}) {
    const [isFavourited, setIsFavourited] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

        // Check if the user is logged in
        if (!loggedInUser) {
            return;
        }

        const userEmail = loggedInUser.email;
        setUserId(userEmail); // Set userId in state
        setIsAuthenticated(true);

        async function fetchFavouriteStatus() {
            try {
                const response = await fetch("http://localhost:8000/wishList/isFavourited", {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ userId: userEmail, listingId })
                });
                const data = await response.json();
                setIsFavourited(data.isFavourited);
            } catch (error) {
                console.log(error);
            }
        }

        fetchFavouriteStatus();
    }, [listingId]); // userId is now set within the effect, so only listingId is a dependency


    async function handleFavourite(event) {
        event.stopPropagation();
        if(!isAuthenticated){
            toast.error("Please login to add to favourite!");
            return;
        }
        try {
            let response;
            if (isFavourited === false) {
                response = await fetch("http://localhost:8000/wishList/pushToWishList", {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ userId, listingId })
                });
            } else {
                response = await fetch("http://localhost:8000/wishList/deleteFromWishList", {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ userId, listingId })
                });
            }

            if (response.ok) {
                setIsFavourited(prevValue => !prevValue);
                console.log("Added/Removed to wishlist: " + isFavourited);
            }
        } catch (error) {
            console.log(error);
        }
    }
    

    return (
        <>
            {isAuthenticated ? (
                <button className="favourite-button" onClick={handleFavourite}>
                    {isFavourited ? (
                        <FavoriteIcon style={{ color: "#fe385c", transition: "2s ease" }} />
                    ) : (
                        <FavoriteBorderIcon style={{ color: "white", transition: "2s ease" }} />
                    )}
                </button>
            ) : (
                <button className="favourite-button" onClick={handleFavourite}>
                    <FavoriteBorderIcon style={{ color: "white", transition: "2s ease" }} />
                </button>
            )}
        </>
    );
}
