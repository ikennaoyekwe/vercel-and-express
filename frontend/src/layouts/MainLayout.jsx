import React, { useState } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu}/>
            <main style={{overflow: 'hidden'}} onClick={closeMenu} className="mainWindow flex-grow">
                <Outlet />
            </main>
            <Footer/>
        </div>
    )
}