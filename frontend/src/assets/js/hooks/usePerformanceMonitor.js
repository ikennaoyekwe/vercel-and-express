import { useState, useEffect } from 'react';

export function usePerformanceMonitor() {
    const [isLowPower, setIsLowPower] = useState(false);

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

            // Every 500ms, calculate the FPS for that chunk
            if (elapsed >= 500) {
                const fps = (frameCount / elapsed) * 1000;
                measurements.push(fps);
                // Reset for next chunk
                startTime = time;
                frameCount = 0;
                // Stop monitoring after duration is reached
                const totalTime = performance.now() - initTime;
                if (totalTime > MONITOR_DURATION) {
                    // Calculate average FPS of all chunks
                    const avgFps = measurements.reduce((a, b) => a + b, 0) / measurements.length;

                    console.log("Average FPS detected:", Math.round(avgFps));

                    if (avgFps < FPS_THRESHOLD) {
                        setIsLowPower(true);
                    }
                    return; // Stop the loop
                }
            }
            frameId = requestAnimationFrame(measure);
        };

        const initTime = performance.now();
        frameId = requestAnimationFrame(measure);

        return () => cancelAnimationFrame(frameId);
    }, []);

    return isLowPower;
}