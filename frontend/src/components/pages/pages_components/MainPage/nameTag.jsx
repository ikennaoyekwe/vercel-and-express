import React from "react";
import {isMobile} from "react-device-detect";

const NameTag = ({svgOpacity, classNames}) => (
    <div className={`${classNames}`}>
        <span style={{fontSize: "1.5em",textShadow: "1px 10px 8px black",marginLeft: "1em",color: "gray", opacity: svgOpacity}}>Ikenna</span>
    </div>
);

export default NameTag;