import React from "react";
import {Link} from "react-router-dom";

export default function Footer() {
    return (
        <div className="relative bg-gray-700 h-[5.43vh] text-center p-[1.5em] z-20">
            <div className="flex flex-col justify-center items-center h-full text-center text-shadow text-white">
                <div>
                    <span>Arash's About Me Website ( under construction )</span>
                    <Link to="/aboutme" className="ml-2">About Me</Link>
                </div>
            </div>
        </div>
    );
}