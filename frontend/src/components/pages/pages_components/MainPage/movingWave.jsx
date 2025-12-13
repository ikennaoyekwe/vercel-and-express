import React, { useEffect, useRef } from "react";
import { init, useInitialize_andUpdate_wave, useUpdateOnScroll } from "../../../../assets/js/mainPage/movingWaves.js";

// Accepts scrollState as a prop (number 0 to 100)
export default function MovingWave({ scrollState = 0 }) {

    const {canvasRef, waveController} = useInitialize_andUpdate_wave();
    useUpdateOnScroll(waveController, scrollState);


    return (
        <canvas
            id="wave-canvas"
            ref={canvasRef}
            className="fixed bottom-0 w-full h-full z-10"
            style={{ width: "100%", height: "100%" }}
        />
    );
}