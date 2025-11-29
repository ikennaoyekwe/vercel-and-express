import React, { useEffect, useRef } from 'react';

const RotatingIconSphere = () => {
    const containerRef = useRef(null);
    const iconsRef = useRef([]);

    useEffect(() => {
        if (!containerRef.current) return;

        // Icons data with image URLs from Simple Icons CDN
        const icons = [
            { img: 'https://cdn.simpleicons.org/react/61DAFB', name: 'React' },
            { img: 'https://cdn.simpleicons.org/javascript/F7DF1E', name: 'JavaScript' },
            { img: 'https://cdn.simpleicons.org/css3/1572B6', name: 'CSS' },
            { img: 'https://cdn.simpleicons.org/html5/E34F26', name: 'HTML' },
            { img: 'https://cdn.simpleicons.org/nodedotjs/339933', name: 'Node.js' },
            { img: 'https://cdn.simpleicons.org/python/3776AB', name: 'Python' },
            { img: 'https://cdn.simpleicons.org/git/F05032', name: 'Git' },
            { img: 'https://cdn.simpleicons.org/docker/2496ED', name: 'Docker' },
            { img: 'https://cdn.simpleicons.org/amazonwebservices/FF9900', name: 'AWS' },
            { img: 'https://cdn.simpleicons.org/postgresql/4169E1', name: 'PostgreSQL' },
            { img: 'https://cdn.simpleicons.org/typescript/3178C6', name: 'TypeScript' },
            { img: 'https://cdn.simpleicons.org/vuedotjs/4FC08D', name: 'Vue' },
            { img: 'https://cdn.simpleicons.org/nextdotjs/000000', name: 'Next.js' },
            { img: 'https://cdn.simpleicons.org/rust/000000', name: 'Rust' },
            { img: 'https://cdn.simpleicons.org/firebase/FFCA28', name: 'Firebase' },
        ];

        const container = containerRef.current;
        const radius = 200;
        let angleX = 0;
        let angleY = 0;
        let targetAngleX = 0;
        let targetAngleY = 0;
        let autoRotateX = 0;
        let autoRotateY = 0;

        // Create icon elements
        icons.forEach((icon, i) => {
            // Fibonacci sphere distribution
            const phi = Math.acos(1 - 2 * (i + 0.5) / icons.length);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;

            const iconEl = document.createElement('div');
            iconEl.className = 'icon-item';
            iconEl.innerHTML = `
        <div class="icon-content">
          <img src="${icon.img}" alt="${icon.name}" class="icon-image" />
          <span class="icon-label">${icon.name}</span>
        </div>
      `;

            iconEl.dataset.phi = phi;
            iconEl.dataset.theta = theta;

            container.appendChild(iconEl);
            iconsRef.current.push(iconEl);
        });

        // Update icon positions
        const updatePositions = () => {
            iconsRef.current.forEach((iconEl) => {
                const phi = parseFloat(iconEl.dataset.phi);
                const theta = parseFloat(iconEl.dataset.theta);

                // Calculate 3D position with auto-rotation
                const x = radius * Math.sin(phi) * Math.cos(theta + angleY + autoRotateY);
                const y = radius * Math.sin(phi) * Math.sin(theta + angleY + autoRotateY);
                const z = radius * Math.cos(phi);

                // Rotate around X axis with auto-rotation
                const rotatedY = y * Math.cos(angleX + autoRotateX) - z * Math.sin(angleX + autoRotateX);
                const rotatedZ = y * Math.sin(angleX + autoRotateX) + z * Math.cos(angleX + autoRotateX);

                // Calculate distance from center (0, 0) - icons at center get larger
                const distanceFromCenter = Math.sqrt(x * x + rotatedY * rotatedY);
                const maxDistance = radius * 1.2;

                // Scale based on Z position (depth) but keep consistent size
                const depthScale = 0.7 + (rotatedZ + radius) / (radius * 2) * 0.6;

                // Additional scale boost when near center
                const centerBoost = Math.max(0, 1 - distanceFromCenter / 150) * 0.5;
                const finalScale = depthScale + centerBoost;

                // Opacity based on depth
                const opacity = 0.4 + (rotatedZ + radius) / (radius * 2) * 0.6;

                iconEl.style.transform = `translate(-50%, -50%) translate(${x}px, ${rotatedY}px) scale(${finalScale})`;
                iconEl.style.opacity = opacity;
                iconEl.style.zIndex = Math.floor(rotatedZ);
            });
        };

        let isMouseOver = false;

        // Mouse move handler
        const handleMouseMove = (e) => {
            if (!isMouseOver) return;

            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            targetAngleY = ((e.clientX - centerX) / rect.width) * 2;
            targetAngleX = ((e.clientY - centerY) / rect.height) * 2;
        };

        // Mouse enter/leave handlers
        const handleMouseEnter = () => {
            isMouseOver = true;
        };

        const handleMouseLeave = () => {
            isMouseOver = false;
            targetAngleX = 0;
            targetAngleY = 0;
        };

        window.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        // Animation loop
        let animationId;
        const animate = () => {
            // Always auto-rotate
            autoRotateY += 0.01;
            autoRotateX += 0.005;

            // Smooth interpolation for mouse control
            angleX += (targetAngleX - angleX) * 0.05;
            angleY += (targetAngleY - angleY) * 0.05;

            updatePositions();
            animationId = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationId);
            iconsRef.current.forEach(icon => icon.remove());
            iconsRef.current = [];
        };
    }, []);

    return (
        <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center overflow-hidden">
            <div className="text-center mb-8 z-10">
                <h1 className="text-5xl font-bold text-white mb-4">My Skills</h1>
                <p className="text-gray-300 text-lg">Move your mouse to interact with the sphere</p>
            </div>

            <div
                ref={containerRef}
                className="relative w-full max-w-3xl h-[500px]"
                style={{ perspective: '1000px' }}
            />

            <div className="mt-8 text-center text-gray-400 text-sm z-10">
                <p>Interactive 3D Skill Sphere • Pure CSS & JavaScript</p>
            </div>

            <style jsx>{`
        .icon-item {
          position: absolute;
          left: 50%;
          top: 50%;
          transition: opacity 0.3s;
          pointer-events: none;
        }

        .icon-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .icon-image {
          width: 56px;
          height: 56px;
          display: block;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
          object-fit: contain;
        }

        .icon-label {
          font-size: 14px;
          font-weight: 600;
          color: white;
          white-space: nowrap;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        }
      `}</style>
        </div>
    );
};

export default RotatingIconSphere;