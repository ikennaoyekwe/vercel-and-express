import React, { useEffect, useRef, useState } from 'react';
import "../assets/sass/animatedHeader.sass";
import { gsap } from 'gsap';
import { Link } from "react-router-dom";
import SvgImage from "../components/pages/pages_components/svg_image_header.jsx";

const AnimatedHeader = () => {
    const canvasRef = useRef(null);
    const navRef = useRef(null);
    const svgPathRef = useRef(null); // Ref for the SVG path

    const pointsRef = useRef({
        topLeft: 25,
        topY: 0,
        topRight: 75,
        bottomY: 37,
        bottomLeft: 25,
        bottomRight: 75,
        endX: 110,
        endY: 30,
    });

    // ... (Keep arrowRef, animationRef, and steps as they are) ...
    const arrowRef = useRef({ width: 30, height: 7, lineWidth: 3 });
    const animationRef = useRef({
        tl: null, openTL: null, progress: 0, maxTimeline: 0.6,
        winPointerY: 0, hover: false, isOpen: false,
        width: 0, height: 0, endX: 100, endY: 130,
    });

    const steps = [
        [0.25, 0, 0.25, 1.2, 0.75, 1.2, 0.75, 0],
        [-0.1, 0, 0.25, 1.2, 0.75, 1.2, 1.10, 0],
        [-0.1, 0.5, 0.25, 1.06, 0.75, 1.06, 1.10, 0.5],
        [-0.1, 0.66, 0.25, 1, 0.75, 1, 1.10, 0.66]
    ];

    const drawPath = () => {
        const canvas = canvasRef.current;
        if (!canvas || !svgPathRef.current) return;

        const ctx = canvas.getContext('2d');
        const { width, endY } = animationRef.current;
        const p = pointsRef.current;

        ctx.clearRect(0, 0, width, endY);

        // 1. Draw Background on Canvas
        ctx.beginPath();
        ctx.moveTo(p.topLeft, 0);
        ctx.lineTo(p.topLeft, p.topY);
        ctx.bezierCurveTo(p.bottomLeft, p.bottomY, p.bottomRight, p.bottomY, p.topRight, p.topY);
        ctx.lineTo(p.topRight, 0);
        ctx.lineTo(width, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 10;
        ctx.fill();

        // 2. Update SVG Path (This replaces the Mask Canvas)
        // We construct the path string manually
        const d = `M ${p.topLeft} 0 
                   L ${p.topLeft} ${p.topY} 
                   C ${p.bottomLeft} ${p.bottomY}, ${p.bottomRight} ${p.bottomY}, ${p.topRight} ${p.topY} 
                   L ${p.topRight} 0 
                   L ${width} 0 
                   L 0 0 Z`;
        svgPathRef.current.setAttribute('d', d);

        // 3. Draw the Animated Border (Your existing logic)
        ctx.save();
        const time = Date.now() * 0.0015;
        const x0 = (Math.sin(time) * width * 0.8);
        const grd = ctx.createLinearGradient(x0, 0, x0 + width, 0);
        grd.addColorStop(0, "rgba(255, 255, 255, 0)");
        grd.addColorStop(0.2, "rgba(99, 102, 241, 0.8)");
        grd.addColorStop(0.4, "rgba(236, 72, 153, 0.9)");
        grd.addColorStop(0.6, "rgba(0, 212, 255, 1)");
        grd.addColorStop(0.8, "rgba(52, 211, 153, 0.8)");
        grd.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.strokeStyle = grd;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p.topLeft, p.topY);
        ctx.bezierCurveTo(p.bottomLeft, p.bottomY, p.bottomRight, p.bottomY, p.topRight, p.topY);
        ctx.stroke();
        ctx.restore();

        // Draw Arrow
        drawArrow(ctx);
    };

    const drawArrow = (ctx) => {
        const { width, endY } = animationRef.current;
        const arrow = arrowRef.current;
        ctx.save();
        const x = width / 2;
        const y = endY - 24;
        ctx.beginPath();
        ctx.moveTo(x - arrow.width / 2, y - arrow.height / 2);
        ctx.lineTo(x, y + arrow.height / 2);
        ctx.lineTo(x + arrow.width / 2, y - arrow.height / 2);
        ctx.strokeStyle = '#696969';
        ctx.lineWidth = arrow.lineWidth;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();
    };

    // ... (Keep offsetCoords, stretchCoords, setRatio, render, and useEffect exactly as they are) ...
    // Just remove references to maskCanvasRef inside setRatio
    const offsetCoords = (val, i) => {
        const { endX, endY } = animationRef.current;
        if (i % 2 === 0) {
            if (val <= 0 || val >= 1) val = endX * val;
            else val = (endX / 2) - ((0.5 - val) * (endY * Math.PI));
        } else {
            val = val * endY;
        }
        return val;
    };

    const stretchCoords = (val, i) => val * (i % 2 === 0 ? animationRef.current.endX : animationRef.current.endY);

    const setRatio = () => {
        const width = window.innerWidth;
        const endY = 130;
        animationRef.current.width = width;
        animationRef.current.endX = width;
        animationRef.current.endY = endY;

        if (canvasRef.current) {
            canvasRef.current.width = width;
            canvasRef.current.height = endY;
        }

        pointsRef.current.endX = width;
        pointsRef.current.endY = endY;

        const processedSteps = steps.map((coords, i) =>
            coords.map(i === 0 ? offsetCoords : stretchCoords)
        );

        const tl = gsap.timeline({ paused: true, onUpdate: drawPath });
        const openTL = gsap.timeline({ paused: true });
        openTL.to(tl, { duration: 0.6, progress: 1, ease: 'none' });

        processedSteps.forEach((step, i) => {
            const obj = {
                topLeft: step[0], topY: step[1],
                bottomLeft: step[2], bottomY: step[3],
                bottomRight: step[4], topRight: step[6],
                ease: i === 1 ? 'power2.in' : (i === 3 ? 'elastic.out(1.2, 0.4)' : 'none')
            };
            if (i === 0) tl.set(pointsRef.current, obj);
            else if (i === 3) openTL.to(pointsRef.current, { duration: 0.8, ...obj, onUpdate: drawPath });
            else tl.to(pointsRef.current, { duration: 1, ...obj });
        });
        openTL.to(arrowRef.current, { duration: 0.4, height: -7 }, 0.4);
        animationRef.current.tl = tl;
        animationRef.current.openTL = openTL;
        drawPath();
    };

    const render = () => {
        const { height, winPointerY, maxTimeline, isOpen, tl, openTL } = animationRef.current;
        const t = window.innerHeight / 2;
        const targetProgress = Math.max(0, (t - winPointerY) / t);
        animationRef.current.progress += (targetProgress - animationRef.current.progress) * 0.1;

        if (animationRef.current.progress >= maxTimeline) {
            if (!isOpen) {
                openTL.play();
                animationRef.current.isOpen = true;
            }
        } else {
            if (isOpen) {
                openTL.reverse();
                animationRef.current.isOpen = false;
            }
            tl.progress(animationRef.current.progress);
        }
    };

    useEffect(() => {
        setRatio();
        const handleResize = () => setRatio();
        const handlePointerMove = (e) => {
            animationRef.current.winPointerY = e.touches ? e.touches[0].clientY : e.clientY;
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handlePointerMove);
        gsap.ticker.add(render);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handlePointerMove);
            gsap.ticker.remove(render);
        };
    }, []);

    return (
        <header className="headerr">
            {/* SVG Definition for the Mask */}
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <clipPath id="header-mask" clipPathUnits="userSpaceOnUse">
                        <path ref={svgPathRef} />
                    </clipPath>
                </defs>
            </svg>

            {/* Background Canvas */}
            <canvas ref={canvasRef} style={{ position: 'absolute', top: -18, left: 0, pointerEvents: 'none' }} />

            {/* Nav using the SVG Clip Path */}
            <nav className="navv" ref={navRef} style={{ clipPath: 'url(#header-mask)', WebkitClipPath: 'url(#header-mask)' }}>
                <div className="logo">
                    <SvgImage/>
                </div>
                <ul className="list">
                    {['Home', 'About', 'Tech-Stack', 'Contact'].map((item) => (
                        <li key={item}>
                            <Link to={item.toLowerCase()} className="links">
                                {item}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default AnimatedHeader;