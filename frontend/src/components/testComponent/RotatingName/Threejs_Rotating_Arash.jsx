import React, {useEffect, useRef} from "react";
import * as THREE from "three";

export default function Threejs_Rotating_Arash() {
    const mountRef = useRef(null);

    useEffect(() => {
        const currentMount = mountRef.current;

        // --- 1. SETUP SCENE ---
        const scene = new THREE.Scene();

        const width = currentMount.clientWidth;
        const height = currentMount.clientHeight;

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
        camera.position.z = 4;

        // --- PERFORMANCE OPTIMIZATION #1: Low Overhead Renderer ---
        const renderer = new THREE.WebGLRenderer({
            antialias: false, // Turn off antialias for speed on old PC
            alpha: true
        });

        // --- PERFORMANCE OPTIMIZATION #2: Force Pixel Ratio ---
        // High DPI screens (Retina) kill old GPUs. We force standard resolution.
        renderer.setPixelRatio(1);
        renderer.setSize(width, height);
        currentMount.appendChild(renderer.domElement);

        // --- 2. CREATE THE TEXTURE (The Creative Part) ---
        // Instead of heavy 3D geometry, we draw to a 2D canvas first.
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 512;  // Power of 2 textures run faster
        canvas.height = 256;

        // Draw Neon Style Text
        ctx.fillStyle = "rgba(0,0,0,0)"; // Transparent background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = "bold 100px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Add Glow/Shadow
        ctx.shadowColor = "#00ffff"; // Cyan glow
        ctx.shadowBlur = 20;
        ctx.fillStyle = "#ffffff";
        ctx.fillText("ARASH", canvas.width / 2, canvas.height / 2);

        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);

        // --- 3. CREATE THE SIMPLE MESH ---
        // PlaneGeometry is extremely cheap (only 2 triangles!)
        const geometry = new THREE.PlaneGeometry(6, 3);

        // MeshBasicMaterial does NOT calculate lights/shadows (Very Fast)
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide // Visible from back too
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // --- 4. ANIMATION LOOP ---
        let frameId;
        const animate = () => {
            // Rotate nicely
            mesh.rotation.y += 0.015;

            // Add a slight "float" effect using sine wave
            mesh.position.y = Math.sin(Date.now() * 0.002) * 0.2;

            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        };

        animate();

        // --- CLEANUP ---
        return () => {
            cancelAnimationFrame(frameId);
            if (currentMount.contains(renderer.domElement)) {
                currentMount.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            texture.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <>
            <div ref={mountRef} style={{width: "100%", height: "400px",}}/>
        </>

    );
}