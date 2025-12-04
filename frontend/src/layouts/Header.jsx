import React, { useState } from "react";
import {Link} from "react-router-dom";
import CustomLink from "./CustomLink.jsx";
import SvgImage from "../components/pages/pages_components/svg_image.jsx";

export default function Header({ isMenuOpen, toggleMenu }) {

    return (
        <>
            <style>
                {`
                    @keyframes gradient-shift {
                        0% {
                            background-position: 0% 50%;
                        }
                        50% {
                            background-position: 100% 50%;
                        }
                        100% {
                            background-position: 0% 50%;
                        }
                    }

                    .gradient-shadow {
                        position: relative;
                    }

                    .gradient-shadow::after {
                        content: '';
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        height: 20px;
                        background: linear-gradient(90deg, #1e40af, #3b82f6, #60a5fa, #93c5fd, #3b82f6, #1e40af);
                        background-size: 200% 200%;
                        animation: gradient-shift 4s ease infinite;
                        filter: blur(15px);
                        opacity: 0.7;
                        z-index: -1;
                    }

                    
                `}
            </style>
            <div className="bg-gray-800 items-center justify-center">

                <header className="sticky top-0 z-20 drop-shadow-lg text-center gradient-shadow border-b border-gray-600/30">
                    <nav className="p-4">
                        <div className="flex items-center justify-between">
                            <Link to="/" name="main page">
                                <SvgImage/>
                            </Link>
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