import React from "react";
import PropertyCard from '../propertyCard/PropertyCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation, Pagination} from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ProfileListing.css'

export default function ProfileListing(props){

    const {heading, profileListings, userEmail, headingColor, notExistText} = props

    return(
            <div className="profile-listings-container">
            <div className="profile-page-heading head" style={{color: headingColor}}>{heading}</div>
            <div className="listing-container">
                {
                    profileListings.length===0
                    ? <div className="not-exists">{notExistText}</div>

                    : 
                        <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={20} 
                        slidesPerView={1}
                        breakpoints={{
                            480: {
                                slidesPerView: 1
                            }, 
                            800: {
                                slidesPerView: 2 
                            },
                            1450: {
                                slidesPerView: 3
                            }
                        }}
                        navigation
                        pagination={{ clickable: true }}
                    >
                        {
                            profileListings.map((listing) => {

                                return (
                                    <SwiperSlide key={listing._id}>
                                        <PropertyCard
                                            listing={listing}
                                            ImageUrls={listing.listingPhotosUrls}
                                            userId={userEmail}
                                        />
                                    </SwiperSlide>
                                )

                            })
                        }
                    </Swiper>
                }
                
            </div>

        </div>
    )
}