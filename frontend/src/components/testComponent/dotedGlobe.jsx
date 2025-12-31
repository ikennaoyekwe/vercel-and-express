import React, { useEffect, useRef } from 'react';

const DotedGlobe = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const requestRef = useRef(null);
    const dotsRef = useRef([]);
    const startTimeRef = useRef(null);

    // --- CONFIGURATION ---
    const DOT_RADIUS = 2.5;       // Adjusted for better density
    const CYCLE_DURATION = 10000;
    const TEXT_STAY = 3000;
    const GLOBE_STAY = 2000;
    const MORPH_TIME = 3000;

    class Dot {
        constructor(x, y, z, params) {
            this.x = x; this.y = y; this.z = z;
            this.params = params;
            this.targetX = 0;
            this.targetY = 0;

            // Gradient: Blue to Purple
            const hue = 200 + ((y + params.GLOBE_RADIUS) / (params.GLOBE_RADIUS * 2)) * 80;
            this.color = `hsl(${hue}, 80%, 60%)`;
        }

        easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        draw(ctx, sin, cos, progress) {
            const { GLOBE_CENTER_Z, FIELD_OF_VIEW, PROJECTION_CENTER_X, PROJECTION_CENTER_Y } = this.params;

            const rotX = cos * this.x + sin * (this.z - GLOBE_CENTER_Z);
            const rotZ = -sin * this.x + cos * (this.z - GLOBE_CENTER_Z) + GLOBE_CENTER_Z;
            const sizeProjection = FIELD_OF_VIEW / (FIELD_OF_VIEW - rotZ);

            const globeX = (rotX * sizeProjection) + PROJECTION_CENTER_X;
            const globeY = (this.y * sizeProjection) + PROJECTION_CENTER_Y;

            const p = this.easeInOutCubic(progress);
            const finalX = globeX + (this.targetX - globeX) * p;
            const finalY = globeY + (this.targetY - globeY) * p;

            const alpha = Math.max(0.15, (rotZ - (GLOBE_CENTER_Z - this.params.GLOBE_RADIUS)) / (this.params.GLOBE_RADIUS * 2));
            const finalSize = (DOT_RADIUS * sizeProjection) * (1 + p * 0.3);

            ctx.fillStyle = this.color;
            ctx.globalAlpha = alpha;
            ctx.fillRect(finalX - finalSize/2, finalY - finalSize/2, finalSize, finalSize);
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height, GLOBE_RADIUS, GLOBE_CENTER_Z, PROJECTION_CENTER_X, PROJECTION_CENTER_Y, FIELD_OF_VIEW;

        const getTextPoints = (text, screenW, screenH) => {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');

            // Higher resolution sampling for crisp text
            const sampleW = 1200;
            const sampleH = 400;
            tempCanvas.width = sampleW;
            tempCanvas.height = sampleH;

            tempCtx.textAlign = 'center';
            tempCtx.textBaseline = 'middle';
            tempCtx.fillStyle = 'white';
            tempCtx.font = `bold ${sampleW / 4.5}px "Courier New", monospace`;
            tempCtx.fillText(text, sampleW / 2, sampleH / 2);

            const imageData = tempCtx.getImageData(0, 0, sampleW, sampleH).data;
            const points = [];

            // Responsive text scaling: smaller on mobile (screenW < 600)
            const scaleFactor = screenW < 600 ? 0.9 : 0.7;
            const textScale = (screenW * scaleFactor) / sampleW;

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

                const x = params.GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
                const y = params.GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
                const z = (params.GLOBE_RADIUS * Math.cos(phi)) + params.GLOBE_CENTER_Z;

                const dot = new Dot(x, y, z, params);
                const target = textPoints[i % textPoints.length];
                dot.targetX = target.x;
                dot.targetY = target.y;
                newDots.push(dot);
            }
            dotsRef.current = newDots;
        };

        const handleResize = () => {
            // Get actual dimensions of the viewport
            width = window.innerWidth;
            height = window.innerHeight;

            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            // Responsive Radius: Use 0.35 of the SMALLEST dimension to ensure no cutoff
            GLOBE_RADIUS = Math.min(width, height) * 0.35;
            GLOBE_CENTER_Z = -GLOBE_RADIUS;
            PROJECTION_CENTER_X = width / 2;
            PROJECTION_CENTER_Y = height / 2;

            // Field of view changes based on aspect ratio
            FIELD_OF_VIEW = width > height ? width * 0.8 : height * 0.8;

            const params = { GLOBE_RADIUS, GLOBE_CENTER_Z, PROJECTION_CENTER_X, PROJECTION_CENTER_Y, FIELD_OF_VIEW };
            createDots(params);
        };

        const render = (time) => {
            if (!startTimeRef.current) startTimeRef.current = time;
            const elapsed = (time - startTimeRef.current) % CYCLE_DURATION;

            ctx.clearRect(0, 0, width, height);

            let progress = 0;
            if (elapsed < GLOBE_STAY) {
                progress = 0;
            } else if (elapsed < GLOBE_STAY + MORPH_TIME) {
                progress = (elapsed - GLOBE_STAY) / MORPH_TIME;
            } else if (elapsed < GLOBE_STAY + MORPH_TIME + TEXT_STAY) {
                progress = 1;
            } else {
                progress = 1 - (elapsed - (GLOBE_STAY + MORPH_TIME + TEXT_STAY)) / (CYCLE_DURATION - (GLOBE_STAY + MORPH_TIME + TEXT_STAY));
            }

            const rotation = time * 0.0004;
            const sinRot = Math.sin(rotation);
            const cosRot = Math.cos(rotation);

            for (let i = 0; i < dotsRef.current.length; i++) {
                dotsRef.current[i].draw(ctx, sinRot, cosRot, progress);
            }
            ctx.globalAlpha = 1.0;

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
        <div
            ref={containerRef}
            style={{
                width: '100vw',
                height: '100vh',
                position: 'fixed', // Use fixed to act as a background if needed
                top: 0,
                left: 0,
                zIndex: 0,
                pointerEvents: 'none' // Allows clicking through to buttons behind it
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    display: 'block'
                }}
            />
        </div>
    );
};

export default DotedGlobe;