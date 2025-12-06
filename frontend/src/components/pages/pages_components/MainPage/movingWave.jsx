import React, { useEffect, useRef } from "react";
import { init } from "../../../../assets/js/movingWaves.js";

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
            <canvas
                id="background"
                ref={canvasRef}
                className="fixed top-0 left-0 w-full h-full z-10"
                style={{ width: "100%", height: "100%"}}
            />
        </>
    );
}