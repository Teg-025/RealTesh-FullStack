import React from "react";
import { useNavigate } from "react-router-dom";
import CardService from "../cardService/CardService";
import "./Services.css"

const cardData = [{img: "/buy_a_home.png", head: "Buy a home", desc: "Find your place with an immersive photo experience and the most listings, including things you won’t find anywhere else.", buttonTxt: "Browse homes", id: 1},
    {img: "/sell_a_home.png", head: "Sell a home", desc: "Find your place with an immersive photo experience and the most listings, including things you won’t find anywhere else.", buttonTxt: "Sell Now", id: 2},
    {img: "/rent_a_home.png", head: "Rent a home", desc: "Find your place with an immersive photo experience and the most listings, including things you won’t find anywhere else.", buttonTxt: "Find rentals", id: 3}
]

export default function Services(){
    const navigate = useNavigate();

    function handleClick(head){
        if(head == "Buy a home"){
            navigate('/properties', {state: {type: 'sale'}})
        }
        else if(head == "Rent a home"){
            navigate('/properties', {state: {type: 'rent'}})
        }
        else if(head == "Sell a home"){
            navigate('/addListing')
        }

    }
    
    return(
        <div className="card-section-landing-page">
            <div className="card-section-head">Avail our services</div>
            <div className="card-container">
                {cardData.map((card, index)=>{
                    return(
                        <CardService
                            key = {card.id}
                            img = {card.img}
                            head = {card.head}
                            desc = {card.desc}
                            buttonTxt = {card.buttonTxt}
                            handleClick = {handleClick}
                        />
                    )
                })}
            </div>
        </div>
        
    )
}