import React, { useState } from "react";
import {Link} from "react-router-dom";
import CustomLink from "./CustomLink.jsx";
import SvgImage from "../components/pages/pages_components/svg_image_header.jsx";

export default function MobileHeader({ isMenuOpen, toggleMenu }) {

    return (
        <>
            <div className="bg-gray-800 items-center justify-center">

                <header className="sticky top-0 z-20 drop-shadow-lg text-center gradient-shadow border-b border-gray-600/30">
                    <nav className="p-4">
                        <div className="flex items-center justify-between">
                            <Link to="/" name="main page">
                                <SvgImage/>
                            </Link>
                            {/* Mobile Menu Toggle Button */}
                            <div className="md:hidden">
                                <button
                                    onClick={toggleMenu}
                                    className="text-white focus:outline-none p-2 hover:bg-gray-600/50 rounded transition-colors duration-300"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                    </svg>
                                </button>
                            </div>
                            {/* Desktop Menu */}
                            <div className="hidden md:block">
                                <ul className="flex space-x-4 items-center">
                                    <CustomLink to="/aboutMe" name="About Me" />
                                    <CustomLink to="/techStacks" name="Tech stack" />
                                    <CustomLink to="/contactMe" name="Contact" />
                                    <CustomLink to="/play" name="Play" />
                                </ul>
                            </div>
                        </div>

                        {/* Mobile Menu */}
                        <div
                            className={`${
                                isMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
                            } transform origin-top transition-all duration-300 ease-in-out absolute left-0 right-0 top-full glass-effect shadow-lg md:hidden border-b border-gray-600/30`}
                        >
                            <ul className="sticky top-0 z-20 bg-gray-700 drop-shadow-lg text-center gradient-shadow border-b border-gray-600/30">
                                <CustomLink to="/aboutMe" name="About Me" toggleMenu={toggleMenu} />
                                <CustomLink to="/techStacks" name="Tech stack" toggleMenu={toggleMenu} />
                                <CustomLink to="/contactMe" name="Contact" toggleMenu={toggleMenu} />
                            </ul>
                        </div>
                    </nav>
                </header>
            </div>
        </>
    );
}