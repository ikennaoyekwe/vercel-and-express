import React, { useState } from "react";
import Header from "../../layouts/Header.jsx";
import Footer from "../../layouts/Footer.jsx";
import { Outlet } from "react-router-dom";
import "../../assets/css/mainpage.css";

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
            <main onClick={closeMenu} className="mainWindow">
                <Outlet />
            </main>
            <Footer/>
        </div>
    )
}