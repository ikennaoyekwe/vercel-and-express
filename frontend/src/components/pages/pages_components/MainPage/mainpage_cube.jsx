import React from "react";
import '../../../../assets/css/cubeStyles.css';
import laravel from '../../../../assets/images/laravel4.webp';
import react from '../../../../assets/images/react2.png';
import javascript from '../../../../assets/images/js2.png';
import nodejs from '../../../../assets/images/nodejs.png';
import mysql from '../../../../assets/images/mysql.png';
import php from '../../../../assets/images/php.png';

export default function MainPage_cube() {
    return (
        <div id="cube-container" className="justify-center items-center mt-10 z-20">
            <div id="front" className="face"><img src={laravel} alt="Laravel" /></div>
            <div id="back" className="face"><img src={react} alt="React" /></div>
            <div id="right" className="face"><img src={javascript} alt="Javascript"/></div>
            <div id="left" className="face"><img src={nodejs} alt="Nodejs"/></div>
            <div id="top" className="face"><img src={mysql} alt="MySql"/></div>
            <div id="bottom" className="face"><img src={php} alt="Php"/></div>
        </div>
    );
}