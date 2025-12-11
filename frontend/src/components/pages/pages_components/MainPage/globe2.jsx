import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as d3 from "d3";
import * as topojson from "topojson-client";

// --- 1. COORDINATE MATH (Critical for Accuracy) ---
// Converts Lat/Lon to 3D Vector on a Sphere (Radius 100)
// We assume the globe is rotated -90 degrees on Y to align with D3 texture.
const getVectorFromLatLon = (lat, lon, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon) * (Math.PI / 180);

    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);

    return new THREE.Vector3(x, y, z);
};

// --- 2. DATA FETCHER ---
async function getIpLocation(setData) {
    try {
        // Replace with your real fetch
        // const res = await fetch('https://ipapi.co/json/');
        // const data = await res.json();
        // setData(data);

        // Mock Data: Updates to London after 1 second
        setTimeout(() => {
            setData({ latitude: 51, longitude: 41 });
        }, 1500);
    } catch (err) {
        console.error(err);
    }
}

const Globe2 = () => {
    const mountRef = useRef(null);
    const [locationData, setLocationData] = useState({ latitude: 10, longitude: 10 });

    // Refs to access 3D objects without re-rendering component
    const sceneRef = useRef(null);
    const pinGroupRef = useRef(null);

    // --- 3. FETCH DATA ON MOUNT ---
    useEffect(() => {
        getIpLocation(setLocationData);
    }, []);

    // --- 4. UPDATE PIN POSITION WHEN DATA CHANGES ---
    useEffect(() => {
        if (pinGroupRef.current && locationData.latitude) {
            const pos = getVectorFromLatLon(locationData.latitude, locationData.longitude, 100);
            pinGroupRef.current.position.copy(pos);
            // Rotate the pin to stand perpendicular to the surface
            pinGroupRef.current.lookAt(new THREE.Vector3(0,0,0));
        }
    }, [locationData]);

    // --- 5. INITIALIZE SCENE (RUNS ONCE) ---
    useEffect(() => {
        if (!mountRef.current) return;

        // A. Setup Scene
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        const scene = new THREE.Scene();
        sceneRef.current = scene; // Save ref

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 320; // Distance

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        const globeGroup = new THREE.Group();
        scene.add(globeGroup);

        // B. Create Pin Objects (Empty initially)
        const pinGroup = new THREE.Group();
        pinGroupRef.current = pinGroup; // Save ref for the other useEffect
        globeGroup.add(pinGroup);

        // Red Dot
        const dot = new THREE.Mesh(
            new THREE.SphereGeometry(2, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        pinGroup.add(dot);

        // Radar Ring
        const ring = new THREE.Mesh(
            new THREE.RingGeometry(2.5, 3.5, 32),
            new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
        );
        ring.rotation.x = Math.PI; // Flip to face outward
        pinGroup.add(ring);

        // C. Generate Texture (Async)
        // We use a fixed scale/translate so the map is ALWAYS centered correctly
        (async () => {
            const response = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-50m.json");
            const data = await response.json();
            const land = topojson.feature(data, data.objects.land);

            const canvas = document.createElement("canvas");
            canvas.width = 2048;
            canvas.height = 1024;
            const ctx = canvas.getContext("2d");

            // FIXED PROJECTION: Don't use fitSize. Hardcode Equirectangular math.
            const projection = d3.geoEquirectangular()
                .scale(canvas.width / (2 * Math.PI)) // Perfect scaling for 360 degrees
                .translate([canvas.width / 2, canvas.height / 2]); // Perfect center

            const path = d3.geoPath().projection(projection).context(ctx);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            path(land);
            ctx.fillStyle = "#0a0a0a"; // Dark Gray Land
            ctx.fill();

            const texture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.LinearFilter;

            const globeMat = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.FrontSide, // Hides back side (Fixes glitchy look)
            });

            const globe = new THREE.Mesh(new THREE.SphereGeometry(100, 64, 64), globeMat);
            // ROTATION FIX: D3 Equirectangular center is longitude 0.
            // Three.js texture starts at longitude 180.
            // Rotating -90 degrees ( -PI/2 ) makes Z+ face Longitude 0 (Africa).
            globe.rotation.y = -Math.PI / 2;
            globeGroup.add(globe);
        })();

        // D. Animation Loop
        const clock = new THREE.Clock();
        let frameId;

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            // Rotate World
            globeGroup.rotation.y += 0.002;

            // Animate Ring
            const cycle = elapsed % 2;
            const scale = 1 + cycle * 4;
            ring.scale.set(scale, scale, 1);
            ring.material.opacity = 1 - (cycle / 2);

            renderer.render(scene, camera);
        };
        animate();

        // E. Cleanup
        const handleResize = () => {
            if(mountRef.current) {
                const w = mountRef.current.clientWidth;
                const h = mountRef.current.clientHeight;
                camera.aspect = w/h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            }
        }
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(frameId);
            mountRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []); // Empty dependency array = RUNS ONCE

    return <div ref={mountRef} style={{ width: "100%", height: "500px", background: "transparent", zIndex: 50 }} />;
};

export default Globe2;