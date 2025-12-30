import React, { useEffect, useRef } from 'react';

const DotedGlobe = () => {
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const dotsRef = useRef([]);
    const startTimeRef = useRef(null);

    // --- CONFIGURATION ---
    const DOT_RADIUS = 2.2;        // Smaller dots look sharper when packed
    const CYCLE_DURATION = 10000;  // 10 seconds per full loop (Globe -> Text -> Globe)
    const TEXT_STAY = 3000;       // How long to stay on the word "ARASH" (ms)
    const GLOBE_STAY = 2000;      // How long to stay as a globe (ms)
    const MORPH_TIME = 2500;      // Speed of the fly-in/fly-out (ms)

    class Dot {
        constructor(x, y, z, params) {
            this.x = x; this.y = y; this.z = z; // 3D Position
            this.params = params;
            this.targetX = 0; // 2D Target X
            this.targetY = 0; // 2D Target Y
        }

        // Smooth movement easing
        easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        draw(ctx, sin, cos, progress) {
            const { GLOBE_CENTER_Z, FIELD_OF_VIEW, PROJECTION_CENTER_X, PROJECTION_CENTER_Y } = this.params;

            // 1. Calculate 3D Position on the globe
            const rotX = cos * this.x + sin * (this.z - GLOBE_CENTER_Z);
            const rotZ = -sin * this.x + cos * (this.z - GLOBE_CENTER_Z) + GLOBE_CENTER_Z;
            const sizeProjection = FIELD_OF_VIEW / (FIELD_OF_VIEW - rotZ);

            const globeX = (rotX * sizeProjection) + PROJECTION_CENTER_X;
            const globeY = (this.y * sizeProjection) + PROJECTION_CENTER_Y;

            // 2. Interpolate
            const p = this.easeInOutCubic(progress);
            const finalX = globeX + (this.targetX - globeX) * p;
            const finalY = globeY + (this.targetY - globeY) * p;

            // Optional: make dots slightly larger when they form the text
            const finalSize = sizeProjection + (1.2 - sizeProjection) * p;

            // ctx.beginPath();
            // ctx.arc(finalX, finalY, DOT_RADIUS * finalSize, 0, Math.PI * 2);
            // ctx.fill();
            // Bello code ( Much Faster )
            const size = DOT_RADIUS * finalSize * 2;
            ctx.fillRect(finalX - size/2, finalY - size/2, size, size);
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height, GLOBE_RADIUS, GLOBE_CENTER_Z, PROJECTION_CENTER_X, PROJECTION_CENTER_Y, FIELD_OF_VIEW;

        const getTextPoints = (text, screenW, screenH) => {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            const sampleW = 1600; // High resolution sampling
            const sampleH = 600;
            tempCanvas.width = sampleW;
            tempCanvas.height = sampleH;

            tempCtx.textAlign = 'center';
            tempCtx.textBaseline = 'middle';
            tempCtx.fillStyle = 'white';
            // Massive font size
            tempCtx.font = `bold ${sampleW / 4.5}px Arial`;
            tempCtx.fillText(text, sampleW / 2, sampleH / 2);

            const imageData = tempCtx.getImageData(0, 0, sampleW, sampleH).data;
            const points = [];
            // Huge scale factor
            const textScale = (screenW * 0.95) / sampleW;

            // Sample frequently for high dot density
            for (let y = 0; y < sampleH; y += 4) {
                for (let x = 0; x < sampleW; x += 4) {
                    const alpha = imageData[(y * sampleW + x) * 4 + 3];
                    if (alpha > 128) {
                        points.push({
                            x: (x - sampleW / 2) * textScale + screenW / 2,
                            y: (y - sampleH / 2) * textScale + screenH / 2
                        });
                    }
                }
            }
            return points;
        };

        const createDots = (params) => {
            const textPoints = getTextPoints("ARASH", width, height);
            const totalNeeded = textPoints.length;
            const newDots = [];

            for (let i = 0; i < totalNeeded; i++) {
                const theta = Math.random() * 2 * Math.PI;
                const phi = Math.acos((Math.random() * 2) - 1);
                // Enlarged globe (Radius 1.1x screen min to make it look massive/cutoff)
                const x = (params.GLOBE_RADIUS * 1.2) * Math.sin(phi) * Math.cos(theta);
                const y = (params.GLOBE_RADIUS * 1.2) * Math.sin(phi) * Math.sin(theta);
                const z = ((params.GLOBE_RADIUS * 1.2) * Math.cos(phi)) + params.GLOBE_CENTER_Z;

                const dot = new Dot(x, y, z, params);
                const target = textPoints[i];
                dot.targetX = target.x;
                dot.targetY = target.y;
                newDots.push(dot);
            }
            dotsRef.current = newDots;
        };

        const handleResize = () => {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            // Make globe "Zoomed in"
            GLOBE_RADIUS = Math.min(width, height) * 0.6;
            GLOBE_CENTER_Z = -GLOBE_RADIUS;
            PROJECTION_CENTER_X = width / 2;
            PROJECTION_CENTER_Y = height / 2;
            FIELD_OF_VIEW = width * 1.2;

            const params = { GLOBE_RADIUS, GLOBE_CENTER_Z, PROJECTION_CENTER_X, PROJECTION_CENTER_Y, FIELD_OF_VIEW };
            createDots(params);
        };

        const render = (time) => {
            if (!startTimeRef.current) startTimeRef.current = time;
            const elapsed = (time - startTimeRef.current) % CYCLE_DURATION;

            ctx.clearRect(0, 0, width, height);

            // --- REPEAT LOGIC (PHASES) ---
            let progress = 0;
            if (elapsed < GLOBE_STAY) {
                progress = 0; // Staying as Globe
            } else if (elapsed < GLOBE_STAY + MORPH_TIME) {
                progress = (elapsed - GLOBE_STAY) / MORPH_TIME; // Morphing to Text
            } else if (elapsed < GLOBE_STAY + MORPH_TIME + TEXT_STAY) {
                progress = 1; // Staying as Text
            } else {
                // Morphing back to Globe
                progress = 1 - (elapsed - (GLOBE_STAY + MORPH_TIME + TEXT_STAY)) / (CYCLE_DURATION - (GLOBE_STAY + MORPH_TIME + TEXT_STAY));
            }

            const rotation = time * 0.0003;
            const sinRot = Math.sin(rotation);
            const cosRot = Math.cos(rotation);

            ctx.fillStyle = "#000";
            // Drawing loop
            for (let i = 0; i < dotsRef.current.length; i++) {
                dotsRef.current[i].draw(ctx, sinRot, cosRot, progress);
            }

            requestRef.current = window.requestAnimationFrame(render);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        requestRef.current = window.requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: '100vw',
                height: '100vh',
                display: 'block',
                background: '#fff'
            }}
        />
    );
};

export default DotedGlobe;