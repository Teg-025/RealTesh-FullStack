import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import FavoriteButton from "../favouriteButton/FavouriteButton";
import './ImageCarousel.css';

export default function ImageCarousel({ images, listingId, handleCardClick }) {
    return (
        <div className="image-carousel">
            <FavoriteButton listingId={listingId} color={"white"} />
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{
                    dynamicBullets: true,
                    clickable: true
                  }}
            >
                {images.map((imgSrc, index) => (
                    <SwiperSlide key={index} >
                        <div className="carousel-slide">
                            <img 
                                src={imgSrc} 
                                alt="propertyImg"
                                onClick={()=>handleCardClick()}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}