import React, {useEffect, useRef, useState} from "react";

export default function VerticalHangingMenu() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const menuItemsRef = useRef([]);
    const requestRef = useRef(null);

    const [hoveredItem, setHoveredItem] = useState(null);
    const hoveredItemRef = useRef(null);

    // 1. REMOVED 'position' from data. Only content remains.
    const menuItems = [
        {name: "Home", color: "#ef4444"},
        {name: "About Me", color: "#3b82f6"},
        {name: "Tech Stack", color: "#10b981"},
        {name: "Contact", color: "#8b5cf6"},
    ];

    useEffect(() => {
        hoveredItemRef.current = hoveredItem;
    }, [hoveredItem]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d", {alpha: true});

        const resizeCanvas = () => {
            const {width, height} = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        let time = 0;

        const getWaveX = (y, t) => {
            const height = canvas.offsetHeight;
            const width = canvas.offsetWidth;
            const normalized = y / height;
            const baseX = width - 50;
            const sway = Math.sin(t * 0.8) * 20 * normalized;
            const ripple = Math.cos(normalized * Math.PI * 5 - t * 2) * 5;
            const hoverEffect =
                hoveredItemRef.current !== null ? Math.sin(t * 10) * 2 : 0;
            const dampener = normalized;
            return baseX + (sway + ripple + hoverEffect) * dampener;
        };

        const animate = () => {
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;
            const baseX = width - 50;

            ctx.clearRect(0, 0, width, height);
            time += 0.02;

            // --- Draw Ceiling Mount ---
            ctx.fillStyle = "#475569";
            ctx.beginPath();
            ctx.rect(baseX - 10, 0, 20, 8);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = "#6366f1";
            ctx.arc(baseX, 0, 4, 0, Math.PI * 2);
            ctx.fill();

            // --- Draw Ghost Waves ---
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.15;
            [-8, 8].forEach((offset) => {
                ctx.beginPath();
                ctx.strokeStyle = "#818cf8";
                for (let y = 0; y <= height; y += 5) {
                    const scale = y / height;
                    const x = getWaveX(y, time + offset * 0.002) + offset * scale;
                    if (y === 0) ctx.moveTo(baseX, 0);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            });

            ctx.globalAlpha = 1;

            // --- Draw Main String ---
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#6366f1";
            ctx.strokeStyle = "#6366f1";
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(baseX, 0);
            for (let y = 0; y <= height; y += 4) {
                const x = getWaveX(y, time);
                ctx.lineTo(x, y);
            }
            ctx.stroke();

            // --- 2. CALCULATE POSITIONS DYNAMICALLY ---
            const totalItems = menuItems.length;
            // Define range: Start at 15% height, end at 90% height
            const startY = 0.15;
            const endY = 0.9;
            const totalRange = endY - startY;

            menuItems.forEach((item, idx) => {
                // Calculate normalized position (0.0 to 1.0) based on index
                const step = totalRange / (totalItems - 1);
                const normalizedPos = startY + step * idx;

                const y = normalizedPos * height;
                const waveX = getWaveX(y, time);
                const isHovered = hoveredItemRef.current === idx;

                // Canvas Dot
                ctx.fillStyle = isHovered ? "#ffffff" : item.color;
                ctx.shadowColor = item.color;
                ctx.shadowBlur = isHovered ? 25 : 10;

                ctx.beginPath();
                ctx.arc(waveX, y, isHovered ? 6 : 4, 0, Math.PI * 2);
                ctx.fill();

                // Move DOM Element
                if (menuItemsRef.current[idx]) {
                    menuItemsRef.current[
                        idx
                        ].style.transform = `translate3d(${waveX}px, ${y}px, 0) translate(-100%, -50%)`;
                }
            });

            requestRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed top-0 right-0 h-[25vh] w-48 z-50 pointer-events-none"
            aria-label="Side Navigation"
        >
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full block"/>

            {menuItems.map((item, idx) => (
                <div
                    key={item.name}
                    ref={(el) => (menuItemsRef.current[idx] = el)}
                    className="absolute top-0 left-0 pointer-events-auto flex items-center justify-end pr-6 will-change-transform"
                    onMouseEnter={() => setHoveredItem(idx)}
                    onMouseLeave={() => setHoveredItem(null)}>
                    <button
                        className={`group relative px-4 py-2 rounded-lg transition-all duration-300 ease-out flex items-center gap-3`}
                        style={{transform: hoveredItem === idx ? "scale(1.1) translateX(-10px)" : "scale(1)",}}>
            <span
                className="font-bold tracking-wide whitespace-nowrap transition-colors duration-300"
                style={{
                    color: hoveredItem === idx ? item.color : "#FFFFFF",
                    textShadow: hoveredItem === idx ? `0 0 20px ${item.color}` : "none",
                }}>
              {item.name}
            </span>
                        <div
                            className="absolute inset-0 -z-10 rounded-lg transition-all duration-300 border border-white/10 backdrop-blur-sm"
                            style={{
                                backgroundColor: hoveredItem === idx ? `${item.color}20` : "rgba(15, 23, 42, 0.6)",
                                borderColor: hoveredItem === idx ? item.color : "rgba(255,255,255,0.1)",
                                boxShadow: hoveredItem === idx ? `0 0 20px ${item.color}40` : "none",
                            }}
                        />
                    </button>
                </div>
            ))}
        </div>
    );
}
