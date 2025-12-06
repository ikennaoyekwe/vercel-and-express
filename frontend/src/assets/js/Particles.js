// ------------------------------------------------------------
//  CONFIGURATION
// ------------------------------------------------------------
const PARTICLE_RADIUS = 2.5;
const PARTICLE_SPEED_FACTOR = 0.5;
const CONNECTION_DISTANCE = 180;
const PARTICLE_COLOR = 'rgba(191, 219, 254, 0.8)';
const LINE_COLOR_BASE = 'rgba(160,200,220,';
const PARTICLES_PER_SQ_PIXEL = 15000;
const MIN_PARTICLES = 35;
const MAX_PARTICLES = 1166;

// radius of the “gravity” zone around the mouse
const MOUSE_RADIUS = 250;

// **new** – overall strength of the mouse pull (0 = no pull, 1 = full original speed)
const MOUSE_PULL_FACTOR = 0.5;

// ------------------------------------------------------------
//  PARTICLE CLASS
// ------------------------------------------------------------
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

        // **new density range – much smaller**
        this.density = (Math.random() * 4) + 1;   // 1 … 5
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // mouse is passed in each frame
    update(mouse) {
        // ------------------------------------------------
        // 1️⃣ Edge bouncing (unchanged)
        // ------------------------------------------------
        if (this.x + this.radius > this.canvasWidth || this.x - this.radius < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.radius > this.canvasHeight || this.y - this.radius < 0) {
            this.directionY = -this.directionY;
        }

        // ------------------------------------------------
        // 2️⃣ Mouse attraction – now slower
        // ------------------------------------------------
        if (mouse.x !== undefined && mouse.y !== undefined) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.hypot(dx, dy);

            if (distance < mouse.radius) {
                // unit vector toward the mouse
                const forceDirX = dx / distance;
                const forceDirY = dy / distance;

                // strength grows as the particle gets closer (0 … 1)
                const rawForce = (mouse.radius - distance) / mouse.radius;

                // **apply global pull factor and density**
                const pull = rawForce * this.density * MOUSE_PULL_FACTOR;

                this.x += forceDirX * pull;
                this.y += forceDirY * pull;
            }
        }

        // ------------------------------------------------
        // 3️⃣ Standard drift movement (unchanged)
        // ------------------------------------------------
        this.x += this.directionX;
        this.y += this.directionY;
    }
}

// ------------------------------------------------------------
//  INITIALISATION / ANIMATION
// ------------------------------------------------------------
export function initParticles(canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationId;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    const mouse = { x: undefined, y: undefined, radius: MOUSE_RADIUS };

    // -----------------------------------------------------------------
    // Helper: create the particle pool
    // -----------------------------------------------------------------
    const createParticles = () => {
        particlesArray = [];
        const screenArea = width * height;
        let numParticles = Math.floor(screenArea / PARTICLES_PER_SQ_PIXEL);

        const isMobile = width < 768;
        const currentMin = isMobile ? 35 : 60;
        const currentMax = isMobile ? 100 : MAX_PARTICLES;

        numParticles = Math.max(currentMin, Math.min(numParticles, currentMax));

        for (let i = 0; i < numParticles; i++) {
            const radius = PARTICLE_RADIUS;
            const x = Math.random() * (width - radius * 2) + radius;
            const y = Math.random() * (height - radius * 2) + radius;
            const directionX = (Math.random() - 0.5) * 2 * PARTICLE_SPEED_FACTOR;
            const directionY = (Math.random() - 0.5) * 2 * PARTICLE_SPEED_FACTOR;

            particlesArray.push(
                new Particle(x, y, directionX, directionY, radius, PARTICLE_COLOR, width, height)
            );
        }
    };

    // -----------------------------------------------------------------
    // Helper: draw connecting lines
    // -----------------------------------------------------------------
    const connectParticles = () => {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.hypot(dx, dy);

                if (distance < CONNECTION_DISTANCE) {
                    const opacity = 1 - distance / CONNECTION_DISTANCE;
                    ctx.strokeStyle = `${LINE_COLOR_BASE} ${opacity.toFixed(2)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    };

    // -----------------------------------------------------------------
    // Main animation loop
    // -----------------------------------------------------------------
    const animate = () => {
        animationId = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);

        particlesArray.forEach(p => {
            p.update(mouse);
            p.draw(ctx);
        });

        connectParticles();
    };

    // -----------------------------------------------------------------
    // Resize handling
    // -----------------------------------------------------------------
    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        createParticles();
    };

    // -----------------------------------------------------------------
    // Mouse event handling
    // -----------------------------------------------------------------
    const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
        mouse.x = undefined;
        mouse.y = undefined;
    };

    // -----------------------------------------------------------------
    // Initial setup
    // -----------------------------------------------------------------
    canvas.width = width;
    canvas.height = height;

    createParticles();
    animate();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    // -----------------------------------------------------------------
    // Cleanup function (returned to caller)
    // -----------------------------------------------------------------
    return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseout', handleMouseLeave);
        particlesArray = [];
    };
}
