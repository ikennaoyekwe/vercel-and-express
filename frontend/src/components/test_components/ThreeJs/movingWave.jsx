import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
// import "./waves.js";

export default function MovingWave() {

    const myCanvasRef = useRef();

    return (
        <canvas id="background" ref={myCanvasRef} />
    );
}