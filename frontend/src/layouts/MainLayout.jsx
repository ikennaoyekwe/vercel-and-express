import React, { useState } from "react";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";
import DesktopHeader from "./DesktopHeader.jsx";

export default function MainLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {setIsMenuOpen(!isMenuOpen)};
    const closeMenu = () => {setIsMenuOpen(false)};

    return (
        <div className="flex flex-col min-h-screen">
            {/*{ isMobile ? <MobileHeader isMenuOpen={isMenuOpen} toggleMenu={toggleMenu}/> : <DesktopHeader /> }*/}
            <DesktopHeader/>
            <main style={{overflow: 'hidden'}} onClick={closeMenu} className="mainWindow flex-grow">
                <Outlet />
            </main>
            <Footer/>
        </div>
    )
}