import React, { useEffect, useRef } from "react";
import * as THREE from "three";
// If FontLoader isn't directly on THREE, you might need to adjust the path
// For older versions like r120, it's often in 'three/examples/js/loaders/FontLoader.js'
// For this example, we assume it's directly available or globally loaded.

export default function Threejs_Glowing_3d() {
    const mountRef = useRef(null);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        const width = currentMount.clientWidth;
        const height = currentMount.clientHeight;

        // --- 1. SCENE SETUP ---
        const scene = new THREE.Scene();
        // Add a subtle fog for depth perception
        scene.fog = new THREE.Fog(0x000000, 10, 200);

        // --- CAMERA ---
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 10, 100); // Position camera to look down and forward
        camera.lookAt(0, 0, 0); // Point camera at the origin

        // --- RENDERER (Optimized for Old PC) ---
        const renderer = new THREE.WebGLRenderer({
            antialias: false, // Keep off for performance
            alpha: true,
        });
        renderer.setPixelRatio(1); // Force 1x pixel ratio
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0); // Transparent background

        // --- SHADOWS ---
        renderer.shadowMap.enabled = true; // Enable shadow maps
        // renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Good for older GPUs, smooth shadows
        // For r120, if PCFSoftShadowMap is too heavy, try BasicShadowMap
        // BasicShadowMap is faster but pixelated:
        renderer.shadowMap.type = THREE.BasicShadowMap;


        currentMount.appendChild(renderer.domElement);

        // --- 2. LIGHTING ---
        // A. Ambient Light (soft overall light)
        const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light, moderate intensity
        scene.add(ambientLight);

        // B. Directional Light (from above, casts shadows)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5); // White light, strong
        directionalLight.position.set(0, 50, 50); // Position it above and slightly in front
        directionalLight.castShadow = true; // IMPORTANT: Light must cast shadows

        // --- SHADOW CAMERA SETTINGS (Optimized) ---
        directionalLight.shadow.mapSize.width = 1024; // Lower resolution for faster shadows
        directionalLight.shadow.mapSize.height = 1024; // Can go lower (512x512) if still lagging

        // Adjust shadow frustum to tightly encompass the object
        const d = 100; // Frustum size
        directionalLight.shadow.camera.left = -d;
        directionalLight.shadow.camera.right = d;
        directionalLight.shadow.camera.top = d;
        directionalLight.shadow.camera.bottom = -d;
        directionalLight.shadow.camera.near = 1;
        directionalLight.shadow.camera.far = 200;
        // directionalLight.shadow.bias = -0.0005; // Helps with shadow artifacts

        scene.add(directionalLight);

        // --- 4. LOAD FONT AND CREATE 3D TEXT ---
        const loader = new THREE.FontLoader();
        loader.load(
            'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
            function (font) {
                // --- TEXT GEOMETRY (Optimized for performance) ---
                const textGeometry = new THREE.TextGeometry("ARASH", {
                    font: font,
                    size: 20, // Reduced size
                    height: 5, // Small extrusion for volume
                    curveSegments: 4, // Very low curve segments for less polygons
                    bevelEnabled: true,
                    bevelThickness: 0.5, // Tiny bevel
                    bevelSize: 0.2, // Tiny bevel
                    bevelOffset: 0,
                    bevelSegments: 1, // Minimal bevel segments
                });

                textGeometry.computeBoundingBox();
                const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
                const textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;

                // Center the geometry's pivot point
                textGeometry.translate(-textWidth / 2, -textHeight / 2, 0);

                // --- MATERIAL (Responds to light and casts shadow) ---
                const textMaterial = new THREE.MeshPhongMaterial({
                    color: 0x00ffff, // Cyan glowing color
                    shininess: 100, // Make it a bit shiny
                    emissive: 0x002222, // Emissive color to give it a slight "inner glow" even in shadow
                    specular: 0xffffff, // White specular highlight
                });

                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                textMesh.position.y = 0; // Position text above ground
                textMesh.castShadow = true; // IMPORTANT: Text must cast shadows
                scene.add(textMesh);

                // --- ANIMATION LOOP (Continued) ---
                let frameId;
                const animate = () => {
                    textMesh.rotation.y += 0.01;
                    // You can also add subtle rotation on X to see depth
                    textMesh.rotation.x = Math.sin(Date.now() * 0.001) * 0.05;

                    renderer.render(scene, camera);
                    frameId = requestAnimationFrame(animate);
                };
                animate(); // Start animation AFTER text is loaded and added

                // --- CLEANUP (for font-dependent meshes) ---
                return () => {
                    cancelAnimationFrame(frameId);
                    if (currentMount.contains(renderer.domElement)) {
                        currentMount.removeChild(renderer.domElement);
                    }
                    renderer.dispose();
                    textGeometry.dispose();
                    textMaterial.dispose();
                    groundGeometry.dispose();
                    groundMaterial.dispose();
                    // Dispose other scene objects if they are explicitly created outside a loop
                };
            },
            // Optional: Progress callback
            undefined,
            // Optional: Error callback
            function (err) {
                console.error("An error occurred loading the font:", err);
            }
        ); // End FontLoader.load()

        // --- Initial Cleanup (for non-font dependent resources) ---
        return () => {
            // This return runs first if component unmounts before font loads
            // Cleanup for renderer, camera etc. that are always created
            // The font-specific cleanup is handled inside the loader's callback's return.
            if (currentMount.contains(renderer.domElement)) {
                currentMount.removeChild(renderer.domElement);
            }
            renderer.dispose(); // Important for clearing WebGL context
        };

    }, []); // End useEffect

    return (
        <>
            <div
                ref={mountRef}
                style={{
                    width: "100%",
                    height: "400px",
                    // Use a dark, slightly reflective background to enhance the glow and shadows

                    display: "flex", // Centering if the canvas doesn't take full width
                    justifyContent: "center",
                    alignItems: "center",
                }}
            />
        </>
    );
}