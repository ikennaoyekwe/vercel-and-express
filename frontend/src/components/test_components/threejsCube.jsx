import React, {useEffect, useRef} from "react";
import * as THREE from "three";

export default function ThreejsCube() {

    const mountRef = useRef(null);

    useEffect(() => {
        // Scene
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 3;

        // Renderer (WebGL1-friendly)
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(
            mountRef.current.clientWidth,
            mountRef.current.clientHeight
        );
        mountRef.current.appendChild(renderer.domElement);

        // Cube geometry & material (simple = WebGL1 safe)
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshNormalMaterial();
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Animation loop
        const animate = () => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        // Cleanup when component unmounts
        return () => {
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            mountRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{ width: "100%", height: "400px", background: "#111" }}
        />
    );
}