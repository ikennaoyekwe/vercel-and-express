import React, {useEffect, useRef, useState} from "react";
import AboutMe_Slider from './pages_components/aboutMe_Slider.jsx';
import AboutMe_main from "./pages_components/aboutMe_main.jsx";
import {motion} from "framer-motion";
import "../../assets/css/abouteMeStyles.css";

const pageVariants = {
    initial: {
        opacity: 0,
        x: -100
    },
    animate: {
        opacity: 1,
        x: 0
    },
    exit: {
        opacity: 0,
        x: 100
    }
};

const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.6
};

export default function AbouteMe() {

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
        const isSquare = Math.random() < 0.5; // 50% chance for square or rectangle

        let width, height;
        if (isSquare) {
            const size = Math.random() * 150 + 50; // 50-200px squares
            width = size;
            height = size;
        } else {
            width = Math.random() * 200 + 50; // 50-250px rectangles
            height = Math.random() * 200 + 50;
        }

        const x = Math.random() * (window.innerWidth - width);
        const y = Math.random() * (window.innerHeight - height);
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

        // Remove shape after animation completes
        setTimeout(() => {
            setShapes(prev => prev.filter(shape => shape.id !== id));
        }, 3000);
    };

    useEffect(() => {
        // Start creating shapes at fast speed (800ms intervals)
        intervalRef.current = setInterval(createShape, 400);

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setShapes([]);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>

            <div className="relative justify-center text-center items-center">
                {shapes.map(shape => (
                    <div
                        key={shape.id}
                        className="absolute rounded-lg shadow-2xl animate-square-appear"
                        style={{
                            width: `${shape.width}px`,
                            height: `${shape.height}px`,
                            left: `${shape.x}px`,
                            top: `${shape.y}px`,
                            background: `linear-gradient(45deg, ${shape.color}, ${shape.color.replace('0.7', '0.9')})`,
                            backdropFilter: 'blur(5px)',
                            animation: 'squareAppear 3s ease-out forwards'
                        }}
                    />
                ))}
                <AboutMe_Slider/>
                <AboutMe_main/>
            </div>

        </motion.div>
    )
}