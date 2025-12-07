import React from "react";
import { isMobile } from "react-device-detect";

export default function renderAccordingToWidth() {
    if (isMobile) {
        return (
            <div>
                <h1>Ikenna</h1>
            </div>
        );
    }else{
        return(
            <div>
                <span style={{fontSize: "1.5em",textShadow: "1px 10px 8px black",marginLeft: "1em",color: "gray", opacity: svgOpacity}}>Ikenna</span>
            </div>
        );
    }
}