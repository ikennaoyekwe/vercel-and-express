import React, { useEffect, useRef } from 'react';
import '../../../../assets/css/globe.css';

// Define the custom plugins outside the component to keep it clean
// (or inside useEffect if you prefer, but outside is more efficient)
function autorotate(degPerSec) {
    return function (planet) {
        let lastTick = null;
        let paused = false;
        planet.plugins.autorotate = {
            pause: function () { paused = true; },
            resume: function () { paused = false; }
        };
        planet.onDraw(function () {
            if (paused || !lastTick) {
                lastTick = new Date();
            } else {
                var now = new Date();
                var delta = now - lastTick;
                var rotation = planet.projection.rotate();
                rotation[0] += degPerSec * delta / 1000;
                if (rotation[0] >= 180) rotation[0] -= 360;
                planet.projection.rotate(rotation);
                lastTick = now;
            }
        });
    };
}

function lakes(options) {
    options = options || {};
    let lakes = null;

    return function (planet) {
        planet.onInit(function () {
            // We assume topojson is available globally
            var world = planet.plugins.topojson.world;
            lakes = window.topojson.feature(world, world.objects.ne_110m_lakes);
        });

        planet.onDraw(function () {
            planet.withSavedContext(function (context) {
                context.beginPath();
                planet.path.context(context)(lakes);
                context.fillStyle = options.fill || 'black';
                context.fill();
            });
        });
    };
}

const RotatingGlobe = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        // 1. Check if libraries are loaded
        if (!window.planetaryjs || !window.d3 || !window.topojson) {
            console.error("PlanetaryJS, D3, or TopoJSON not loaded.");
            return;
        }

        const globe = window.planetaryjs.planet();
        const canvas = canvasRef.current;

        // 2. Load Plugins
        globe.loadPlugin(autorotate(5));

        globe.loadPlugin(window.planetaryjs.plugins.earth({
            topojson: { file: 'https://raw.githubusercontent.com/MadeByDroids/madebydroids.github.io/master/world-110m-withlakes%20(1).json' },
            oceans: { fill: '#fecb00' },
            land: { fill: '#222221' },
            borders: { stroke: '#333333' }
        }));

        globe.loadPlugin(lakes({
            fill: '#fecb00'
        }));

        globe.loadPlugin(window.planetaryjs.plugins.pings());

        globe.loadPlugin(window.planetaryjs.plugins.zoom({
            scaleExtent: [170, 475]
        }));

        globe.loadPlugin(window.planetaryjs.plugins.drag({
            onDragStart: function () {
                this.plugins.autorotate.pause();
            },
            onDragEnd: function () {
                this.plugins.autorotate.resume();
            }
        }));

        // 3. Setup Projection
        globe.projection.scale(275).translate([150, 450]).rotate([0, -10, 0]);

        // 4. Handle High-DPI (Retina) displays
        if (window.devicePixelRatio === 2) {
            canvas.width = 800;
            canvas.height = 800;
            const context = canvas.getContext('2d');
            context.scale(2, 2);
        }

        // 5. Draw
        globe.draw(canvas);

        // 6. Setup Pings Interval
        const colors = ['white'];
        const interval = setInterval(function () {
            const lat = Math.random() * 170 - 85;
            const lng = Math.random() * 360 - 180;
            const color = colors[Math.floor(Math.random() * colors.length)];
            globe.plugins.pings.add(8, 47, { color: color, ttl: 1000, angle: Math.random() * 3 });
        }, 150);

        // 7. Cleanup on Unmount
        return () => {
            clearInterval(interval);
            // Planetary.js doesn't have an explicit 'destroy', but stopping the interval is crucial.
            // If the library supports stopping the loop, add it here.
        };

    }, []); // Empty array ensures this runs once on mount

    return (
        <div style={{ position: 'relative' }}>
            <canvas
                ref={canvasRef}
                width='990'
                height='990'
                style={{ width: "990px", height: "990px", cursor: "move" }}
            />
            <h1 style={{ position: 'absolute', top: '20px', left: '20px', pointerEvents: 'none' }}>
                <span>Our</span><br />Headquarters
            </h1>
        </div>
    );
};

export default RotatingGlobe;