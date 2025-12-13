import { useState, useEffect } from 'react';

export function usePerformanceMonitor() {
    const MAX_LOOP = 3;
    const [isLowPower, setIsLowPower] = useState(false);
    const [maxRun, setMaxRun] = useState(0);

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
                const fps = (frameCount / elapsed) * 1000;
                measurements.push(fps);
                startTime = time;
                frameCount = 0;
                const totalTime = performance.now() - initTime;
                if (totalTime > MONITOR_DURATION) {
                    const avgFps = measurements.reduce((a, b) => a + b, 0) / measurements.length;
                    console.log("Average FPS detected:", Math.round(avgFps));
                    if (avgFps < FPS_THRESHOLD) {
                        setIsLowPower(true);
                    }
                    // my added loop
                    if(maxRun < MAX_LOOP)
                        setMaxRun(prevState => prevState + 1);
                    // end loop
                    return; // Stop the loop
                }
            }
            frameId = requestAnimationFrame(measure);
        };

        const initTime = performance.now();
        frameId = requestAnimationFrame(measure);

        return () => cancelAnimationFrame(frameId);
    }, [maxRun]);

    return isLowPower;
}