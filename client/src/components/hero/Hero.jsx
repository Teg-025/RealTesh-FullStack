import React from "react";
import Button from "../button/Button";
import AchievmentStats from "../achievmentStats/AchievmentStats";
import ImageContainer from "../imageContainer/ImageContainer";
import {motion} from 'framer-motion'
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import "./Hero.css"


const achievments = [{title: "Property Listings", start: 5950, end: 6000},
    {title: "Happy Customers", start: 3950, end: 4000},
    {title: "Awards Won", start: 15, end: 28}
]

export default function Hero(){
    return(
        <div className="hero-section">

            <div className="left-hero-section">
                <div className="head">
                    <div className="orange-circle"></div>
                    <motion.h1
                        initial = {{y: "2rem", opacity:0}}
                        animate = {{y: 0, opacity: 1}}
                        transition={{
                            duration:2, type: "ease-in"
                        }}
                    >
                        Discover <br /> Where You Belong
                    </motion.h1>
                </div>
                <div className="tagline">Explore a diverse selection of properties tailored to your needs, breezing past the home-search hassle</div>

                <div className="search-bar">
                    <FmdGoodIcon style={{color: "#1d3895", fontSize: "1.8rem"}}/>
                    <input name="searchLocation" id="search-location" type="text" className="search-location"/>
                    <Button text="Search"/>
                </div>

                <div className="stats-container">
                {
                    achievments.map((achievment, index)=>{
                        return(
                            <AchievmentStats
                                key = {index}
                                achievmentName = {achievment.title}
                                startCount = {achievment.start}
                                endCount = {achievment.end}
                            />
                    )})
                }
                </div>
            </div>

            <div className="right-hero-section">
                <ImageContainer 
                    image = {"/hero-img.jpg"}
                    alt = {"hero-img"}
                />
            </div>

        </div>
    )
}