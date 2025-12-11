import {useEffect} from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

export function setLocalStorageUseEffect(){
    useEffect(() => {
        if(!localStorage.getItem("PC_ID"))
            localStorage.setItem("PC_ID", crypto.randomUUID());
    }, []);
}

export async function getIpLocation(setData) {
    let data = {message: "error has happened in fetching location", latitude: 51, longitude: 41, country_name: "Nigeria"};
    try {
        if(localStorage.getItem("PC_ID") === "771a4fc0-c417-4800-a64d-d0558abf0993") return;
        const locationResponse = await fetch(`https://ipapi.co/json/`);
        const ipResponse = await fetch('/api/tests/getIp');
        const locationData = await locationResponse.json();
        const ipData = await ipResponse.json();
        data = {message: ipData.message, ip: ipData.ip, latitude: locationData.latitude, longitude: locationData.longitude, country_name: locationData.country_name};
        console.log(data);
        setData(data);
    } catch (err) {
        console.error("API Error", err);
        setData(data);
    }
}

export function topoJsonFeatureUseEffect(setLandData, setData, getIpLocation) {
    useEffect(() => {
        (async () => (await getIpLocation(setData)))();

        d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json")
            .then(data => {
                let landFeature;
                if (data.objects.land) {
                    landFeature = topojson.feature(data, data.objects.land);
                } else {
                    landFeature = topojson.merge(data, data.objects.countries.geometries);
                }
                setLandData(landFeature);
            })
            .catch(err => console.error("Error loading globe data:", err));
    }, []);
}

export function initD3AnimationUseEffect(width, height, canvasRef, landData, data) {
    useEffect(() => {
        if (!landData || !canvasRef.current) return;

        const canvas = canvasRef.current;
        // alpha: true allows transparent background (ocean)
        const context = canvas.getContext("2d", { alpha: true });

        // 1. Setup Projection
        // Precision 0 is slightly "blocky" but the fastest possible setting.
        const projection = d3.geoOrthographic()
            .scale(width / 2.1)
            .translate([width / 2, height / 2])
            .clipAngle(90)
            .precision(0);

        const path = d3.geoPath()
            .projection(projection)
            .context(context);

        // 2. Pre-allocate Memory
        const circleGenerator = d3.geoCircle();
        const sphere = { type: "Sphere" }; // Used only for clipping calculation

        // 3. Animation Settings
        let lastFrameTime = 0;
        const targetFPS = 24; // Cinematic 24fps is much lighter than 60fps
        const frameInterval = 1000 / targetFPS;
        const speed = 0.01;
        const start = Date.now();

        const render = (now) => {
            const timerId = requestAnimationFrame(render);

            // Throttle: Skip frames if we are running too fast
            const elapsedSinceLast = now - lastFrameTime;
            if (elapsedSinceLast < frameInterval) return;
            lastFrameTime = now - (elapsedSinceLast % frameInterval);

            const elapsed = Date.now() - start;

            // Update Rotation
            // We rotate by -longitude so the location faces the user
            projection.rotate([-data.longitude + (speed * elapsed), -10]);

            // -- DRAW --
            context.clearRect(0, 0, width, height);

            // Draw Land (Black)
            // We do NOT draw the sphere/water. The "Ocean" is just the empty canvas.
            context.beginPath();
            path(landData);
            context.fillStyle = "#1a1a1a"; // Dark Gray/Black
            context.fill();

            // 3. Draw the "Ping" Effect
            const centerCircle = d3.geoCircle().center([data.longitude, data.latitude]).radius(1.5)();
            context.beginPath();
            path(centerCircle);
            context.fillStyle = "red";
            context.fill();

            // B. Draw the expanding ring (Radar effect)
            // Cycle every 2000ms
            const cycle = (Date.now() % 2000) / 2000;
            const radius = 1.5 + (cycle * 10); // Expands from 1.5 to 11.5 degrees
            const opacity = 1 - cycle; // Fades out

            const pingCircle = d3.geoCircle().center([data.longitude, data.latitude]).radius(radius)();

            context.beginPath();
            path(pingCircle);
            context.strokeStyle = `rgba(255, 0, 0, ${opacity})`;
            context.lineWidth = 2;
            context.stroke();

            return timerId;
        };

        const timerId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(timerId);
        };
    }, [landData, width, height, data.latitude, data.longitude]);
}