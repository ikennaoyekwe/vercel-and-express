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
    let data = {message: "error has happened in fetching location", latitude: 10, longitude: 10, country_name: "Nigeria"};
    try {
        // if(localStorage.getItem("PC_ID") === "771a4fc0-c417-4800-a64d-d0558abf0993") return;
        // const response = await fetch(`https://ipapi.co/json/`);
        // const response = await fetch('/api/tests/getIp');
        // data = await response.json();
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
        d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json")
            .then(data => {
                const land = topojson.feature(data, data.objects.land);
                setLandData(land);
            })
            .catch(err => console.error("Error loading globe data:", err));
    }, []);
}

export function initD3AnimationUseEffect(width, height, canvasRef, landData, data) {
    useEffect(() => {
        if (!landData || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Configuration
        const speed = 0.01; // Rotation speed
        const start = Date.now();

        // Setup Projection
        const projection = d3.geoOrthographic()
            .scale(width / 2.1)
            .translate([width / 2, height / 2])
            .precision(0.5);

        const path = d3.geoPath()
            .projection(projection)
            .context(context);

        const sphere = { type: "Sphere" };
        // The Animation Loop
        const timer = d3.timer(() => {
            // Clear Canvas
            context.clearRect(0, 0, width, height);

            // Calculate Rotation
            const elapsed = Date.now() - start;

            // FIX: Keep the globe upright (North up).
            const rotate = [(-data.longitude) + (speed * elapsed), -10];

            projection.rotate(rotate);

            // -- DRAWING --
            // 1. Draw Water (Sphere fill)
            projection.clipAngle(90);
            context.beginPath();
            path(sphere);
            context.fillStyle = "transparent";
            context.fill();

            // 2. Draw Land
            context.beginPath();
            path(landData);
            context.fillStyle = "#000000";
            context.fill();
            context.lineWidth = 0;
            context.strokeStyle = "transparent";
            context.stroke();

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
        });


        return () => {
            timer.stop();
        };
    }, [landData, width, height, data.latitude, data.longitude]);
}