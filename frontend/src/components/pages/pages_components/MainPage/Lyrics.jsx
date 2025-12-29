import React, { useEffect, useRef, useState } from "react";
import "../../../../assets/sass/lyrics.scss";
import SvgGlobe from "./svgGlobe.jsx";
// import SvgGlobe from "./svgGlobe.jsx";

export default function Lyrics({ svgOpacity, ip }) {
    const messageRef = useRef(null);
    const [runCount, setRunCount] = useState(0);
    const fpsRef = useRef(0);

    useEffect(() => {
        let frameId;
        let frameCount = 0;
        let startTime = performance.now();
        let measurements = [];
        const initTime = performance.now();

        const MONITOR_DURATION = 3000;

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
                    fpsRef.current = Math.round(avgFps); // Store latest FPS in Ref
                    setRunCount(prev => prev + 1); // Trigger next 3s measurement cycle
                    return;
                }
            }
            frameId = requestAnimationFrame(measure);
        };

        frameId = requestAnimationFrame(measure);
        return () => cancelAnimationFrame(frameId);
    }, [runCount]);

    // --- 2. TEXT FORMATTING LOGIC ---
    const formatText = (text) => {
        const lines = text.trim().split("\n");
        return lines.map((line) => {
            const chars = line.split("").map((c) =>
                c === " " ? "<i>&nbsp;</i>" : `<i>${c}</i>`
            ).join("");
            return `<span>${chars}</span>`;
        }).join("<br/>");
    };

    // This function updates the HTML content with current IP and latest FPS from Ref
    const updateContent = () => {
        if (!ip || !ip.ip || !messageRef.current) return;

        const currentFps = fpsRef.current;
        const fpsText = currentFps > 0 ? `${currentFps} Frame/Sec` : "Measuring Fps ...";

        const textToAnimate = `${ip.ip}\n${ip.country_name} ${ip.city || ''}\n${fpsText} ${window.navigator.hardwareConcurrency}Core ${window.navigator.deviceMemory}GB\nWelcome `;
        messageRef.current.innerHTML = formatText(textToAnimate);
    };

    // --- 3. ANIMATION FLOW LOGIC ---
    const replayAnimation = () => {
        const el = messageRef.current;
        if (!el) return;

        // Step A: Update the text content right before the animation starts
        // This picks up the latest FPS from the ref
        updateContent();

        // Step B: Reset CSS classes
        el.classList.remove("animate");
        requestAnimationFrame(() => {
            void el.offsetHeight; // Force reflow
            requestAnimationFrame(() => {
                el.classList.add("animate");
            });
        });
    };

    // Triggered only when IP data first arrives
    useEffect(() => {
        if (ip && ip.ip) {
            updateContent();
            messageRef.current?.classList.add("animate");
        }
    }, [ip]);

    // The 4-second loop
    useEffect(() => {
        const interval = setInterval(() => {
            replayAnimation();
        }, 5000);
        return () => clearInterval(interval);
    }, [ip]); // Added ip as dependency to ensure updateContent works inside replay

    return (
        <div className="component select-none mt-0">
            <p ref={messageRef} className="typewriter js-typewriter">
                Loading....
            </p>
            <div className="under-hd:hidden">
                {svgOpacity !== 1 && (<SvgGlobe svgOpacity={0} ip={ip} />)}
            </div>
        </div>
    );
}