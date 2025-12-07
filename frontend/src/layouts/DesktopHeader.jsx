import React from "react";
import verticalMenuUseRefs, {changeWithForMobileUseEffect, changeHoveredItemUseEffect} from "../assets/js/verticalMenuFunctions.js";
import {menuItems, menuButtons, hangingStringUseEffect} from "../assets/js/hanging_String.jsx";
import returnIcon from "../assets/js/headerIcons.js";
import {useLocation} from "react-router-dom";

export default function VerticalHangingMenu() {

    const location = useLocation();
    const {imgSrc, imgAlt, imgWidth = "60px", imgHeight = "60px"} = returnIcon(location.pathname);
    const {canvasRef, containerRef, menuItemsRef, requestRef, hoveredItemRef, endIconRef, hoveredItem, setHoveredItem} = verticalMenuUseRefs();

    changeWithForMobileUseEffect(containerRef);
    changeHoveredItemUseEffect(hoveredItem, hoveredItemRef);
    hangingStringUseEffect(canvasRef, containerRef, requestRef, hoveredItemRef, menuItemsRef, menuItems, endIconRef);


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
