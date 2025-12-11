import React, { useEffect, useRef } from "react";
import { init } from "../../../../assets/js/mainPage/movingWaves.js";

// Accepts scrollState as a prop (number 0 to 100)
export default function MovingWave({ scrollState = 0 }) {
    const canvasRef = useRef(null);
    const waveController = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            // Initialize and store the controller
            const { cleanup, update } = init(canvasRef.current);
            waveController.current = update;

            // Cleanup on unmount
            return () => {
                cleanup();
                waveController.current = null;
            };
        }
    }, []);

    // Update the wave whenever scrollState changes
    useEffect(() => {
        if (waveController.current) {
            waveController.current(scrollState);
        }
    }, [scrollState]);

    return (
        <canvas
            id="wave-canvas"
            ref={canvasRef}
            className="fixed bottom-0 w-full h-full z-10"
            style={{ width: "100%", height: "100%" }}
        />
    );
}