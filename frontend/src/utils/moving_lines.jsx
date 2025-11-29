import React, { useEffect, useRef } from 'react';

export default function AnimatedLineBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        class Line {
            constructor() {
                this.reset();
            }

            reset() {
                this.segments = [];
                this.maxSegments = 200;
                this.speed = 4;
                this.color = `hsl(${200 + Math.random() * 60}, 100%, 50%)`;
                this.isTurning = false;
                this.turnProgress = 0;
                this.turnTimer = 0;
                this.turnInterval = 60 + Math.random() * 80;

                const edge = Math.floor(Math.random() * 4);
                const positions = [
                    { x: Math.random() * canvas.width, y: 0, dir: Math.PI / 2 },
                    { x: canvas.width, y: Math.random() * canvas.height, dir: Math.PI },
                    { x: Math.random() * canvas.width, y: canvas.height, dir: -Math.PI / 2 },
                    { x: 0, y: Math.random() * canvas.height, dir: 0 }
                ];

                const pos = positions[edge];
                this.x = pos.x;
                this.y = pos.y;
                this.direction = pos.dir;
            }

            update() {
                this.segments.push({ x: this.x, y: this.y });
                if (this.segments.length > this.maxSegments) this.segments.shift();

                this.turnTimer++;
                if (this.turnTimer > this.turnInterval) {
                    this.turnDirection = Math.random() < 0.5 ? -1 : 1;
                    this.oldDirection = this.direction;
                    this.direction += this.turnDirection * Math.PI / 2;
                    this.turnTimer = 0;
                    this.turnInterval = 60 + Math.random() * 80;
                    this.isTurning = true;
                    this.turnProgress = 0;
                }

                if (this.isTurning) {
                    this.turnProgress += 0.08;
                    if (this.turnProgress >= 1) this.isTurning = false;
                }

                let angle;
                if (this.isTurning) {
                    const t = this.turnProgress;
                    const curve = Math.sin(t * Math.PI) * 0.3;
                    const eased = t * t * (3 - 2 * t);
                    angle = this.oldDirection + (this.direction - this.oldDirection) * eased + this.turnDirection * curve;
                } else {
                    angle = Math.round(this.direction / (Math.PI / 2)) * (Math.PI / 2);
                }

                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;

                if (this.x < -100 || this.x > canvas.width + 100 || this.y < -100 || this.y > canvas.height + 100) {
                    this.reset();
                }
            }

            draw() {
                if (this.segments.length < 2) return;

                ctx.lineWidth = 2;
                ctx.lineCap = 'round';

                for (let i = 1; i < this.segments.length; i++) {
                    const alpha = i / this.segments.length;
                    ctx.strokeStyle = this.color.replace('50%)', `50%, ${alpha})`);
                    ctx.beginPath();
                    ctx.moveTo(this.segments[i - 1].x, this.segments[i - 1].y);
                    ctx.lineTo(this.segments[i].x, this.segments[i].y);
                    ctx.stroke();
                }
            }
        }

        const lines = Array.from({ length: 8 }, () => new Line());

        function animate() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            lines.forEach(line => {
                line.update();
                line.draw();
            });

            requestAnimationFrame(animate);
        }

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ display: 'block', background: '#000' }}
        />
    );
}