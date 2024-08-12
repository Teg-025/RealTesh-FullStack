import React from "react";
import Company from "../company/Company";
import "./Allies.css"

const companies = [{img: "/oberoi_realty_logo.jpg", ind: 1},
    {img: "/DLF_logo.png", ind: 2}, 
    {img: "/godrej_circle_logo.png", ind: 3},
    {img: "/brigade_logo.png", ind:4}
]


export default function Allies(){
    return(
        <div className="allied-companies">
            <div className="allied-head">Companies allied with us</div>
            <div className="allies">
                {
                    companies.map((company)=>{
                        return(
                            <Company key={company.ind} img={company.img}/>
                        )
                    })
                }
            </div>
        </div>
    )
}