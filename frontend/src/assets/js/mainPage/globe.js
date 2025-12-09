
export async function getIpLocation(setCity) {
    let data = {message: "error has happened in fetching location", latitude: 41, longitude: 41, country_name: "Ukraine"};
    try {
        // const response = await fetch(`https://ipapi.co/json/`);
        data = await response.json();
        console.log(data);
        if(data)
            setCity(data.country_name);
    } catch (err) {
        console.error("API Error", err);
    }
    return data
}

export async function fetchAndPulse(globe, data) {
    console.log(data);
    try {
        if (data.latitude && data.longitude) {

            const pulseLocation = () => {
                globe.plugins.pings.add(data.longitude, data.latitude, {
                    color: 'white',
                    ttl: 1000,
                    angle: 10
                });
            };

            return setInterval(pulseLocation, 2000);
        }
    } catch (err) {
        console.error("API Error", err);
    }
};

export function lakes(options) {
    options = options || {};
    let lakes = null;
    return function (planet) {
        planet.onInit(function () {
            let world = planet.plugins.topojson.world;
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

export function planetaryJsGlobe(){
    if (!window.planetaryjs || !window.d3 || !window.topojson) {
        console.error("PlanetaryJS, D3, or TopoJSON not loaded.");
        return;
    }

    const globe = window.planetaryjs.planet();
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

    globe.projection.scale(275).translate([150, 450]).rotate([0, -10, 0]);

    return globe
}

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
                let now = new Date();
                let delta = now - lastTick;
                let rotation = planet.projection.rotate();
                rotation[0] += degPerSec * delta / 1000;
                if (rotation[0] >= 180) rotation[0] -= 360;
                planet.projection.rotate(rotation);
                lastTick = now;
            }
        });
    };
}