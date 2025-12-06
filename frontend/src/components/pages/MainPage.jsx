import React, { useRef, useEffect } from 'react';
import { initParticles } from "../../assets/js/Particles.js"; // Import the new single function
import Svg_mainPage from "./pages_components/svg_mainPage.jsx";
import MovingWave from "./pages_components/movingWave.jsx";

export default function MainPage() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const cleanup = initParticles(canvas);
        return () => cleanup;
    }, []);

    return (
        <div>
            <div className="flex flex-col text-center min-h-[68.4vh] justify-center items-center">
                <div className="w-1/4 min-w-[350px]">
                    <Svg_mainPage />
                </div>
                <MovingWave/>
                <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none"/> {/* Particles Canvas */}
            </div>
        </div>
    );
}