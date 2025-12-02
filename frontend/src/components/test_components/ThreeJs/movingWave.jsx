import React, { useEffect, useRef } from "react";
import { init } from "./movingWaves.js";
import MyThreeJs from "./myThreeJs.jsx";

export default function MovingWave() {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Pass the current DOM element, not the ref object
        // We capture the cleanup function returned by init
        const cleanup = init(canvasRef.current);

        return () => {
            // Run the cleanup when component unmounts
            cleanup();
        };
    }, []);

    return (
        <>
            <MyThreeJs/>
            <canvas
                id="background"
                ref={canvasRef}
                className="fixed top-0 left-0 w-full h-full"
                style={{ width: "100%", height: "100%"}}
            />
        </>
    );
}