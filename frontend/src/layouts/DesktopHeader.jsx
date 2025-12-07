import React, {useEffect, useRef, useState} from "react";
import hanging_String, {menuItems, menuButtons} from "../assets/js/hanging_String.jsx";
import returnIcon from "../assets/js/headerIcons.js";
import {useLocation} from "react-router-dom";

export default function VerticalHangingMenu() {

    const location = useLocation();
    const {imgSrc, imgAlt, imgWidth = "60px", imgHeight = "60px"} = returnIcon(location.pathname);

    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const menuItemsRef = useRef([]);
    const requestRef = useRef(null);
    const hoveredItemRef = useRef(null);
    const endIconRef = useRef(null);
    const [hoveredItem, setHoveredItem] = useState(null);

    useEffect(() => { hoveredItemRef.current = hoveredItem }, [ hoveredItem ]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const cleanup = hanging_String(canvas, requestRef, container, hoveredItemRef, menuItemsRef, menuItems, endIconRef);
        return () => cleanup();
    }, []);

    useEffect(() => {
       if(window.innerWidth < 700){
           containerRef.current.classList.remove('h-[25vh]');
           containerRef.current.classList.add('h-[35vh]');
       }
    },[]);

    return (
        <div
            ref={containerRef}
            className="fixed top-0 right-0 h-[25vh] w-48 z-50 pointer-events-none"
            aria-label="Side Navigation"
        >
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full block"/>
            {menuButtons(hoveredItem, menuItemsRef, setHoveredItem)}
            <div
                ref={endIconRef}
                className="absolute top-0 left-0 pointer-events-none origin-top"
                style={{ willChange: "transform" }}
            >
                <img src={imgSrc} alt={imgAlt} style={{width: imgWidth, height: imgHeight}} />
            </div>
        </div>
    );
}
