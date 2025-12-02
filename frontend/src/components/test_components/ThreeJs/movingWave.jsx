import React, {useEffect, useRef, useState} from "react";
import {init} from "./movingWaves.js";

export default function MovingWave() {

    const canvasRef = useRef();

    useEffect(()=>{
        init(canvasRef);
    });

    return (
        <canvas id="background" ref={canvasRef} style={{width: "100%", height: "100%"}} />
    );
}