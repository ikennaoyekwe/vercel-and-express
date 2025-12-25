import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AnimatedNavbar = () => {
    const canvasRef = useRef(null);
    const maskCanvasRef = useRef(null);
    const navRef = useRef(null);

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

    const arrowRef = useRef({ width: 30, height: 7, lineWidth: 3 });

    const animationRef = useRef({
        tl: null,
        openTL: null,
        progress: 0,
        gradientOffset: 0, // Used to animate the stroke colors
        maxTimeline: 0.6,
        winPointerY: 0,
        isOpen: false,
        width: 0,
        height: 0,
        endX: 100,
        endY: 130,
    });

    const steps = [
        [0.25, 0, 0.25, 1.2, 0.75, 1.2, 0.75, 0],
        [-0.1, 0, 0.25, 1.2, 0.75, 1.2, 1.10, 0],
        [-0.1, 0.5, 0.25, 1.06, 0.75, 1.06, 1.10, 0.5],
        [-0.1, 0.66, 0.25, 1, 0.75, 1, 1.10, 0.66]
    ];

    const drawPath = () => {
        const canvas = canvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        if (!canvas || !maskCanvas) return;

        const ctx = canvas.getContext('2d');
        const maskCtx = maskCanvas.getContext('2d');
        const { width, endY, gradientOffset } = animationRef.current;
        const p = pointsRef.current;

        ctx.clearRect(0, 0, width, endY);
        maskCtx.clearRect(0, 0, width, endY);

        const drawShape = (context, isMask) => {
            context.beginPath();
            context.moveTo(p.topLeft, 0);
            context.lineTo(p.topLeft, p.topY);
            context.bezierCurveTo(p.bottomLeft, p.bottomY, p.bottomRight, p.bottomY, p.topRight, p.topY);
            context.lineTo(p.topRight, 0);
            context.lineTo(width, 0);
            context.lineTo(0, 0);
            context.closePath();

            if (!isMask) {
                // 1. ADD OPACITY TO FILL
                context.fillStyle = 'rgba(255, 255, 255, 0.85)';

                // 2. GLOWING SHADOW
                context.shadowColor = 'rgba(102, 126, 234, 0.5)';
                context.shadowBlur = 20;
                context.fill();

                // 3. MOVING GRADIENT BORDER (The "Moving Line")
                // We create a gradient that shifts based on gradientOffset
                const grad = context.createLinearGradient(
                    gradientOffset * width, 0,
                    (gradientOffset + 0.5) * width, endY
                );
                grad.addColorStop(0, '#667eea'); // Purple/Blue
                grad.addColorStop(0.5, '#764ba2'); // Deep Purple
                grad.addColorStop(1, '#667eea'); // Loop back

                context.strokeStyle = grad;
                context.lineWidth = 3;
                context.lineCap = 'round';
                context.shadowBlur = 0; // Disable shadow for the stroke line itself
                context.stroke();
            } else {
                context.fillStyle = '#000';
                context.fill();
            }
        };

        ctx.save();
        drawShape(ctx, false);
        ctx.restore();

        maskCtx.save();
        drawShape(maskCtx, true);
        maskCtx.restore();

        // Draw arrow
        const arrow = arrowRef.current;
        ctx.save();
        const ax = width / 2;
        const ay = endY - 24;
        ctx.beginPath();
        ctx.moveTo(ax - arrow.width / 2, ay - arrow.height / 2);
        ctx.lineTo(ax, ay + arrow.height / 2);
        ctx.lineTo(ax + arrow.width / 2, ay - arrow.height / 2);
        ctx.strokeStyle = '#696969';
        ctx.lineWidth = arrow.lineWidth;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();

        // Update CSS Mask
        const maskDataUrl = maskCanvas.toDataURL();
        const maskStyle = `url(${maskDataUrl}) top left / 100% 130px no-repeat`;
        const nav = navRef.current;
        if(nav) {
            nav.style.webkitMask = maskStyle;
            nav.style.mask = maskStyle;
        }
    };

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
        const height = window.innerHeight;
        const width = window.innerWidth;
        const endY = 130;

        animationRef.current.height = height;
        animationRef.current.width = width;
        animationRef.current.endX = width;
        animationRef.current.endY = endY;

        [canvasRef, maskCanvasRef].forEach(ref => {
            if (ref.current) {
                ref.current.width = width;
                ref.current.height = endY;
            }
        });

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

        // INFINITE GRADIENT ANIMATION
        gsap.to(animationRef.current, {
            gradientOffset: 2, // Moves the gradient points across the width
            duration: 3,
            repeat: -1,
            ease: "none",
            onUpdate: drawPath
        });

        animationRef.current.tl = tl;
        animationRef.current.openTL = openTL;
        drawPath();
    };

    const render = () => {
        const { height, winPointerY, maxTimeline, isOpen, tl, openTL } = animationRef.current;
        const t = height / 2;
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
        <header style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100px',
            zIndex: 0, pointerEvents: 'none', overflow: 'visible'
        }}>
            <canvas ref={maskCanvasRef} style={{ display: 'none' }} />
            <canvas ref={canvasRef} style={{ position: 'absolute', top: -18, left: 0 }} />

            <nav ref={navRef} style={{
                position: 'relative', width: '100%', height: '100%',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                padding: '35px 50px', pointerEvents: 'none',
                transform: 'translateY(-18px)', paddingTop: '30px',
                backdropFilter: 'blur(5px)' // Optional: adds a glassmorphism effect
            }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a', pointerEvents: 'auto', cursor: 'pointer', transform: 'translateY(2px)' }}>
                    MyBrand
                </div>
                <ul style={{ display: 'flex', gap: '40px', listStyle: 'none', pointerEvents: 'auto', margin: 0, padding: 0, transform: 'translateY(8px)' }}>
                    {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => (
                        <li key={item}>
                            <a href={`#${item.toLowerCase()}`} style={{ color: '#333', textDecoration: 'none', fontSize: '16px', fontWeight: 600 }}>
                                {item}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default AnimatedNavbar;