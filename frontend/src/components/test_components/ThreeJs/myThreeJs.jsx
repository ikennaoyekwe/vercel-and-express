import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function MyThreeJs() {
    const mountRef = useRef(null);

    useEffect(() => {
        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        const renderer = new THREE.WebGL1Renderer({ alpha: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Cube
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Light
        const light = new THREE.PointLight(0xffffff, 1);
        light.position.set(10, 10, 10);
        scene.add(light);

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            mountRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} style={{ width: "40vh", height: "40vh" }} />;
}
