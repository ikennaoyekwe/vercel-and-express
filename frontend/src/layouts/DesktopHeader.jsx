import React, { useEffect, useRef, useState } from 'react';

export default function VerticalWaveMenu() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const menuItemsRef = useRef([]);
    const requestRef = useRef(null);

    // State for React rendering (CSS classes)
    const [hoveredItem, setHoveredItem] = useState(null);

    // Ref for Canvas Animation (to avoid re-triggering useEffect)
    const hoveredItemRef = useRef(null);

    const menuItems = [
        { name: 'Home', position: 0.15, color: '#ef4444' },
        { name: 'About', position: 0.35, color: '#f59e0b' },
        { name: 'Services', position: 0.55, color: '#10b981' },
        { name: 'Portfolio', position: 0.75, color: '#3b82f6' },
        { name: 'Contact', position: 0.90, color: '#8b5cf6' }
    ];

    // Sync Ref with State
    useEffect(() => {
        hoveredItemRef.current = hoveredItem;
    }, [hoveredItem]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d', { alpha: true });

        // Handle Resizing
        const resizeCanvas = () => {
            const { width, height } = container.getBoundingClientRect();
            // Increase resolution for sharpness, but keep style width/height locked
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            // Force immediate re-render to prevent flicker
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let time = 0;

        // Vertical Wave Math
        const getWaveX = (y, t) => {
            const height = canvas.offsetHeight;
            const width = canvas.offsetWidth;
            const normalized = y / height;

            // Base X is near the right side (width - padding)
            const baseX = width - 50;

            // Oscillate on X axis based on Y position
            const wave1 = Math.sin(normalized * Math.PI * 4 + t * 2) * 15;
            const wave2 = Math.cos(normalized * Math.PI * 2 - t * 1.5) * 10;
            const wave3 = Math.sin(normalized * Math.PI * 6 + t * 1) * 5;

            // Dampen waves at the very top and bottom so it looks attached
            const dampener = Math.sin(normalized * Math.PI);

            return baseX + (wave1 + wave2 + wave3) * dampener;
        };

        const animate = () => {
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;

            ctx.clearRect(0, 0, width, height);
            time += 0.02;

            // 1. Draw Ghost Waves (No shadow for performance)
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.15;

            // Draw a few echo lines
            [-15, 15].forEach(offset => {
                ctx.beginPath();
                ctx.strokeStyle = '#818cf8';
                for (let y = 0; y <= height; y += 5) {
                    const x = getWaveX(y, time + (offset * 0.002)) + offset;
                    if (y === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            });

            ctx.globalAlpha = 1;

            // 2. Draw Main String
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#6366f1';
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            // Reducing step size (y+=5) improves performance over iterating every pixel
            for (let y = 0; y <= height; y += 4) {
                const x = getWaveX(y, time);
                if (y === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // 3. Draw Nodes & Update DOM Elements
            menuItems.forEach((item, idx) => {
                const y = item.position * height;
                const waveX = getWaveX(y, time);

                const isHovered = hoveredItemRef.current === idx;

                // Canvas Dot
                ctx.fillStyle = isHovered ? '#ffffff' : item.color;
                ctx.shadowColor = item.color;
                ctx.shadowBlur = isHovered ? 25 : 10;

                ctx.beginPath();
                ctx.arc(waveX, y, isHovered ? 6 : 4, 0, Math.PI * 2);
                ctx.fill();

                // Move DOM Element
                // We update transform directly to avoid React Render Cycle causing lag
                if (menuItemsRef.current[idx]) {
                    // Position the button to the LEFT of the wave point
                    // translate3d uses GPU acceleration
                    menuItemsRef.current[idx].style.transform =
                        `translate3d(${waveX}px, ${y}px, 0) translate(-100%, -50%)`;
                }
            });

            requestRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []); // Empty dependency array = loops runs once and never restarts (Fixes jump)

    return (
        <div
            ref={containerRef}
            className="fixed top-0 right-0 h-[65vh] w-48 z-50 pointer-events-none"
            aria-label="Side Navigation"
        >
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full block"
            />

            {menuItems.map((item, idx) => (
                <div
                    key={item.name}
                    ref={(el) => (menuItemsRef.current[idx] = el)}
                    className="absolute top-0 left-0 pointer-events-auto flex items-center justify-end pr-6 will-change-transform"
                    onMouseEnter={() => setHoveredItem(idx)}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <button
                        className={`
                            group relative px-4 py-2 rounded-lg
                            transition-all duration-300 ease-out
                            flex items-center gap-3
                        `}
                        style={{
                            // Only apply changing styles via React to avoid layout thrashing
                            transform: hoveredItem === idx ? 'scale(1.1) translateX(-10px)' : 'scale(1)',
                        }}
                    >
                        {/* Label Text */}
                        <span
                            className={`
                                font-bold text-sm tracking-wide whitespace-nowrap
                                transition-colors duration-300
                            `}
                            style={{
                                color: hoveredItem === idx ? item.color : '#94a3b8',
                                textShadow: hoveredItem === idx ? `0 0 20px ${item.color}` : 'none'
                            }}
                        >
                            {item.name}
                        </span>

                        {/* Glassmorphic Background (Optional fancy styling) */}
                        <div
                            className={`
                                absolute inset-0 -z-10 rounded-lg transition-all duration-300
                                border border-white/10 backdrop-blur-sm
                            `}
                            style={{
                                backgroundColor: hoveredItem === idx ? `${item.color}20` : 'rgba(15, 23, 42, 0.6)',
                                borderColor: hoveredItem === idx ? item.color : 'rgba(255,255,255,0.1)',
                                boxShadow: hoveredItem === idx ? `0 0 20px ${item.color}40` : 'none'
                            }}
                        />
                    </button>
                </div>
            ))}
        </div>
    );
}