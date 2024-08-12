import React from "react";
import Button from "../button/Button"
import "./SubscribeNewsletter.css"

export default function SubscribeNewsletter(){
    return(
        <div className="subscribe-container">
            <div className="subscribe">
                <div className="subscribe-head">Subscribe to RealTesh</div>
                <div className="subscribe-desc">Subscribe to our Newsletter for latest trends and updates in the real estate market</div>
                <input type="email" placeholder="Enter your email.." name="subscribeEmail" id="subscribe-email"/>
                <Button text="Subscribe Now"/>
            </div>
        </div>
    )
}