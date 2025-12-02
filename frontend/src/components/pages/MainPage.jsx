import React, { useRef, useEffect } from 'react';
import { initParticles } from "./pages_components/js/Particles.js"; // Import the new single function
import Svg_mainPage from "./pages_components/svg_mainPage.jsx";
import MainPage_cube from "./pages_components/mainpage_cube.jsx";

export default function MainPage() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const cleanup = initParticles(canvas);
        return () => cleanup;
    }, []);

    return (
        <div>
            <div className="flex flex-col text-center min-h-[90vh] justify-center items-center">
                <div className="w-1/4 min-w-[350px] z-20">
                    <Svg_mainPage />
                </div>
                <div className="mt-6">
                    <MainPage_cube/>
                </div>
                <canvas
                    ref={canvasRef}
                    className="fixed top-0 left-0 z-10 w-full h-full pointer-events-none"
                />
            </div>
        </div>
    );
}