import React, { useEffect, useRef } from 'react';
import '../../../../assets/css/globe.css';

// Define the custom plugins outside the component to keep the code clean
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

const fetchAndPulse = async (globe) => {
    const apiKey = 'bdd70bad62f4811930aea093439bd459';

    try {
        const response = await fetch(`http://api.ipstack.com/check?access_key=${apiKey}`);
        const data = await response.json();

        console.log(data);

        if (data.latitude && data.longitude) {

            const pulseLocation = () => {
                globe.plugins.pings.add(data.longitude, data.latitude, {
                    color: 'white',
                    ttl: 1000,
                    angle: 10
                });
            };

            pulseLocation();

            const pingInterval = setInterval(pulseLocation, 2000);

            return pingInterval;
        }
    } catch (err) {
        console.error("API Error", err);
    }
};

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
            oceans: { fill: 'white' },
            land: { fill: 'black' },
            borders: { stroke: '#000000' }
        }));

        globe.loadPlugin(lakes({
            fill: '#000000'
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

        let pingInterval = null;
        const fetchAndPulseInterval = fetchAndPulse(globe);
        fetchAndPulseInterval.then(r => pingInterval = r);

        return () => {
            clearInterval(pingInterval);
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
            <h1>
                <span>Our</span><br />Headquarters
            </h1>
        </div>
    );
};

export default RotatingGlobe;