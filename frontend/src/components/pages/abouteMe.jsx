import React, { useEffect, useRef, useState } from "react";
import { pageVariants, pageTransition } from "../../utils/framer-motion-objects.js";
import AboutMe_Slider from './pages_components/aboutMe_Slider.jsx';
import AboutMe_main from "./pages_components/aboutMe_main.jsx";
import { motion } from "framer-motion";
import DotedGlobe from "../testComponent/dotedGlobe.jsx";

export default function AboutMe() {
    const [shapes, setShapes] = useState([]);
    const shapeIdRef = useRef(0);
    const intervalRef = useRef(null);

    const colors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)',
        'rgba(83, 102, 255, 0.7)',
        'rgba(255, 99, 255, 0.7)',
        'rgba(132, 255, 99, 0.7)'
    ];

    const createShape = () => {
        const isSquare = Math.random() < 0.5;
        let width, height;
        if (isSquare) {
            const size = Math.random() * 150 + 50;
            width = size;
            height = size;
        } else {
            width = Math.random() * 200 + 50;
            height = Math.random() * 200 + 50;
        }

        // --- EXCLUSION LOGIC START ---
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        // Define the "Forbidden Zone" (Center of the screen)
        // We use 0.5 (50%) of the screen size as the "blocked" area
        const forbiddenRadiusX = screenW * 0.25;
        const forbiddenRadiusY = screenH * 0.25;
        const centerX = screenW / 2;
        const centerY = screenH / 2;

        let x, y;
        let isValid = false;
        let attempts = 0;

        // Try to find a valid position that doesn't overlap the center
        while (!isValid && attempts < 20) {
            x = Math.random() * (screenW - width);
            y = Math.random() * (screenH - height);

            // Check if the shape's rectangle overlaps with the center forbidden rectangle
            const overlapsX = x < centerX + forbiddenRadiusX && x + width > centerX - forbiddenRadiusX;
            const overlapsY = y < centerY + forbiddenRadiusY && y + height > centerY - forbiddenRadiusY;

            if (!(overlapsX && overlapsY)) {
                isValid = true;
            }
            attempts++;
        }

        // If we couldn't find a spot after 20 tries, don't spawn this shape
        if (!isValid) return;
        // --- EXCLUSION LOGIC END ---

        const color = colors[Math.floor(Math.random() * colors.length)];
        const id = shapeIdRef.current++;

        const newShape = {
            id,
            width,
            height,
            x,
            y,
            color,
            isSquare,
            created: Date.now()
        };

        setShapes(prev => [...prev, newShape]);

        setTimeout(() => {
            setShapes(prev => prev.filter(shape => shape.id !== id));
        }, 3000);
    };

    useEffect(() => {
        intervalRef.current = setInterval(createShape, 400);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => setShapes([]);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
            <style>{`
                @keyframes squareAppear {
                    0% { opacity: 0; transform: scale(0) rotate(0deg); }
                    20% { opacity: 1; transform: scale(0.5) rotate(180deg); }
                    100% { opacity: 1; transform: scale(1) rotate(360deg); }
                }
            `}</style>

            {/* Container for the background shapes */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
                {shapes.map(shape => (
                    <div
                        key={shape.id}
                        className="absolute rounded-lg shadow-2xl"
                        style={{
                            width: `${shape.width}px`,
                            height: `${shape.height}px`,
                            left: `${shape.x}px`,
                            top: `${shape.y}px`,
                            background: `linear-gradient(45deg, ${shape.color}, ${shape.color.replace('0.7', '0.9')})`,
                            backdropFilter: 'blur(5px)',
                            animation: 'squareAppear 3s ease-out forwards',
                        }}
                    />
                ))}
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
                <AboutMe_Slider />
                <AboutMe_main />
                <DotedGlobe />
            </div>
        </motion.div>
    );
}