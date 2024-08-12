import React, {useState, useEffect} from "react";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import OutsideClickHandler from "react-outside-click-handler";
import MenuItemsHeader from "../menuItemsHeader/MenuItemsHeader";
import "./Header.css"

export default function Header(){

    
    const [menuOpened, setMenuOpened] = useState(false)
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 820)

    function handleResize(){
        setIsWideScreen(window.innerWidth > 820);
    }
    useEffect(()=>{
        // useEffect is triggered each time there is a resize or change in state
        window.addEventListener('resize', handleResize) 
    }, [])

    function openMenu(){
        setMenuOpened((prev)=>{
            return !prev;
        })
    }

    return(
        <div className="navbar">
            <div className="left-box">
                <a href="/"><img src="/realtesh-high-resolution-logo-transparent.png" alt="logo" width={160}/></a>
            </div>
            {   (isWideScreen == false)
                ?   (menuOpened
                    ? (
                        <OutsideClickHandler onOutsideClick={()=>{setMenuOpened(false)}}>
                            <MenuItemsHeader />
                        </OutsideClickHandler>
                        )
                    : null)
                :   <MenuItemsHeader />
            }

            <div className="menu-icon">
                {
                    menuOpened
                    ? <MenuIcon onClick={openMenu} style={{color: "#eeeeeec9"}}/>
                    : <MenuOpenIcon onClick={openMenu} style={{color: "#eeeeeec9"}}/>
                }
            </div>
        </div>
    )
}