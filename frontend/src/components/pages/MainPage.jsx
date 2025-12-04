import React, { useRef, useEffect } from 'react';
import { initParticles } from "./pages_components/js/Particles.js"; // Import the new single function
import Svg_mainPage from "./pages_components/svg_mainPage.jsx";
import MainPage_cube from "./pages_components/mainpage_cube.jsx";
import MovingWave from "../test_components/ThreeJs/movingWave.jsx";

export default function MainPage() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const cleanup = initParticles(canvas);
        return () => cleanup;
    }, []);

    return (
        <div>
            <div className="flex flex-col text-center min-h-[87.4vh] justify-center items-center">
                <div className="w-1/4 min-w-[350px]">
                    <Svg_mainPage />
                </div>
                <MovingWave/>
                <canvas
                    ref={canvasRef}
                    className="fixed top-0 left-0 w-full h-full pointer-events-none"
                />
            </div>
        </div>
    );
}