import React, {useEffect, useState} from "react";

export default function PerformanceMonitor({setIsLowPower}) {
    const [runCount, setRunCount] = useState(0);
    const [fps, setFps] = useState(0);

    useEffect(() => {
        let frameId;
        let frameCount = 0;
        let startTime = performance.now();
        let measurements = [];

        const MONITOR_DURATION = 3000;
        const FPS_THRESHOLD = 30;

        const measure = (time) => {
            frameCount++;
            const elapsed = time - startTime;
            if (elapsed >= 500) {
                const currentFps = (frameCount / elapsed) * 1000;
                measurements.push(currentFps);

                startTime = time;
                frameCount = 0;

                const totalTime = performance.now() - initTime;

                if (totalTime > MONITOR_DURATION) {
                    const avgFps = measurements.reduce((a, b) => a + b, 0) / measurements.length;
                    setFps(Math.round(avgFps));

                    if (avgFps < FPS_THRESHOLD) {
                        setIsLowPower(true);
                    }

                    setRunCount(prevState => prevState + 1);
                    return;
                }
            }
            frameId = requestAnimationFrame(measure);
        };

        const initTime = performance.now();
        frameId = requestAnimationFrame(measure);

        return () => cancelAnimationFrame(frameId);
    }, [runCount]);

    return (
        <div className="flex flex-col text-center min-h-[90vh] justify-center items-center z-10">
            <h2 className="font-bold text-xl z-10">
                {fps} FPS
            </h2>
        </div>
    );
}