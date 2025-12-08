import React, {useCallback, useState} from "react";
import "../../assets/css/testCss.css";

export default function PlayGround() {

    const [dynamicText, setDynamicText] = useState("Hello This Is Some Text In A State");

    const styleFunction = useCallback((node) => {
        if(!node) return;
        const color = node.dataset.color;
        if(color) node.style.color = color;
    },[]);

    return (
            <div className="flex flex-col text-center min-h-[90vh] justify-center items-center">
                <h1 data-color="red" ref={node => styleFunction(node)}>Welcome To The PlayGround </h1>
                <div data-color="green" ref={node => styleFunction(node)}>
                    Some Text Goes Here
                </div>
                <br/>
                <div className="myContainer" style={{"--myColor": "gray"}}>
                    {dynamicText}
                </div>
            </div>
    )
}
