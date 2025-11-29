
import React, { useRef, useEffect, useState } from 'react';
import {Particle, initializingAndResizeHandling, animationLoop} from "./pages_components/js/Particles.js";
import Svg_mainPage from "./pages_components/svg_mainPage.jsx";
import MainPage_cube from "./pages_components/mainpage_cube.jsx";

export default function MainPage() {

    const canvasRef = useRef(null);
    const particlesArrayRef = useRef([]);
    const animationFrameIdRef = useRef(null);
    const [canvasDimensions, setCanvasDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        initializingAndResizeHandling(canvasRef, canvasDimensions, particlesArrayRef, setCanvasDimensions, animationFrameIdRef);
    }, [canvasDimensions]);

    useEffect(() => {
        animationLoop(canvasRef, particlesArrayRef, animationFrameIdRef);
    }, [canvasDimensions]);

    return (
        <div>
            <div className="flex flex-col text-center min-h-[90vh] justify-center items-center">
                <div className="w-1/4 min-w-[350px] z-20">
                    <Svg_mainPage />
                </div>
                <div className="mt-6">
                    <MainPage_cube/>
                </div>
                <canvas ref={canvasRef} className="fixed top-0 left-0 z-10" />
            </div>
        </div>
    );
}