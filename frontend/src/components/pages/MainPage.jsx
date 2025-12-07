import React, {useRef, useEffect, useCallback} from 'react';
import { initParticles } from "../../assets/js/Particles.js";
import Svg_mainPage from "./pages_components/MainPage/svg_mainPage.jsx";
import MovingWave from "./pages_components/MainPage/movingWave.jsx";
import TypeWriter from "./pages_components/MainPage/typeWriter.jsx";

export default function MainPage() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const cleanup = initParticles(canvas);
        return () => cleanup();
    }, []);

    const mobileSize = useCallback((node) => {
        if(!node) return;
        window.innerWidth < 700 ? node.classList.add('mt-44') : node.classList.remove('mt-44');
    },[]);

    return (
        <div>
            <div className="flex flex-col min-h-[68.4vh] items-center justify-center">
                <div ref={node => mobileSize(node)} className="w-1/4 min-w-[350px]">
                    <Svg_mainPage />
                </div>
                <div className="w-full flex justify-center">
                    <div className="ml-5 w-full max-w-[420px]">
                        <TypeWriter/>
                    </div>
                </div>
                <MovingWave/>
                <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none"/>
            </div>
        </div>
    );
}