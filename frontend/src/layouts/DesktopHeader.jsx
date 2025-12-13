import React from "react";
import {menuButtons, useHangingStringRenderer, useChangeMobilHeight, useHoveredItem,} from "../assets/js/header/hanging_String.jsx";
import returnIcon from "../assets/js/header/headerIcons.js";
import {useLocation} from "react-router-dom";

export default function VerticalHangingMenu() {

    const location = useLocation();
    const {imgSrc, imgAlt, imgWidth = "60px", imgHeight = "60px"} = returnIcon(location.pathname);

    const containerRef = useChangeMobilHeight();
    const {hoveredItem, setHoveredItem, hoveredItemRef} = useHoveredItem();
    const {canvasRef, menuItemsRef, endIconRef} = useHangingStringRenderer(containerRef, hoveredItemRef);


    return (
        <div
            ref={containerRef}
            className="fixed top-0 right-0 h-[25vh] w-48 z-20 pointer-events-none"
            aria-label="Side Navigation"
        >
            <canvas id="header-canvas" ref={canvasRef} className="absolute top-0 left-0 w-full h-full block"/>
            {menuButtons(hoveredItem, setHoveredItem, menuItemsRef)}
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
