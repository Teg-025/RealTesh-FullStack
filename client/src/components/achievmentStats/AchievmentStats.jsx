import React from "react";
import CountUp from "react-countup";
import "./AchievmentStats.css"

export default function AchievmentStats(props){
    return(
        <div className="achievments">
            <div className="stat">
                <CountUp 
                    start={props.startCount} 
                    end={props.endCount} 
                    duration={4} 
                />
                <span id="plus-sign">+</span>
            </div>
            <div className="achievment-name">{props.achievmentName}</div>
        </div>
    )
}