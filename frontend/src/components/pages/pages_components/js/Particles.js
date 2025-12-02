const PARTICLE_RADIUS = 2.5;
const PARTICLE_SPEED_FACTOR = 0.5;
const CONNECTION_DISTANCE = 200;
const PARTICLE_COLOR = 'rgba(191, 219, 254, 0.8)'; // Tailwind blue-200
const LINE_COLOR_BASE = 'rgba(147, 197, 253,';    // Tailwind blue-300 (partial string for opacity injection)
const PARTICLES_PER_SQ_PIXEL = 15000;
const MIN_PARTICLES = 35; // adjusted lower bound
const MAX_PARTICLES = 200;

class Particle {
    constructor(x, y, directionX, directionY, radius, color, canvasWidth, canvasHeight) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.radius = radius;
        this.color = color;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Bounce off edges
        if (this.x + this.radius > this.canvasWidth || this.x - this.radius < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.radius > this.canvasHeight || this.y - this.radius < 0) {
            this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;
    }
}

export function initParticles(canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationId;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    // --- Helper Functions ---

    const createParticles = () => {
        particlesArray = [];
        const screenArea = width * height;

        // Calculate number of particles based on screen size
        let numParticles = Math.floor(screenArea / PARTICLES_PER_SQ_PIXEL);

        // Clamp particle count
        const isMobile = width < 768;
        const currentMin = isMobile ? 35 : 60;
        const currentMax = isMobile ? 100 : MAX_PARTICLES;

        numParticles = Math.max(currentMin, Math.min(numParticles, currentMax));

        for (let i = 0; i < numParticles; i++) {
            const radius = PARTICLE_RADIUS;
            // Ensure particles spawn inside the canvas
            const x = Math.random() * (width - radius * 2) + radius;
            const y = Math.random() * (height - radius * 2) + radius;
            const directionX = (Math.random() - 0.5) * 2 * PARTICLE_SPEED_FACTOR;
            const directionY = (Math.random() - 0.5) * 2 * PARTICLE_SPEED_FACTOR;

            particlesArray.push(
                new Particle(x, y, directionX, directionY, radius, PARTICLE_COLOR, width, height)
            );
        }
    };

    const connectParticles = () => {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < CONNECTION_DISTANCE) {
                    const opacityValue = 1 - (distance / CONNECTION_DISTANCE);
                    // Optimized string concatenation
                    ctx.strokeStyle = `${LINE_COLOR_BASE} ${opacityValue.toFixed(2)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    };

    const animate = () => {
        animationId = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);

        particlesArray.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });

        connectParticles();
    };

    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Option A: Re-initialize particles on resize (prevents stretching)
        createParticles();

        // Option B: Keep particles but update their boundaries (Smoother but tricky)
        // particlesArray.forEach(p => { p.canvasWidth = width; p.canvasHeight = height; });
    };

    // --- Initialization ---

    // Set initial size
    canvas.width = width;
    canvas.height = height;

    createParticles();
    animate();

    window.addEventListener('resize', handleResize);

    // --- Return Cleanup Function ---
    return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
        particlesArray = []; // Clear memory
    };
}