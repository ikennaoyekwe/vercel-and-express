import * as THREE from 'three';
import SimplexNoise from "simplex-noise";
import {useEffect, useRef} from "react";

export function useInitialize_andUpdate_wave(){
    const canvasRef = useRef(null);
    const waveController = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            const { cleanup, update } = init(canvasRef.current);
            waveController.current = update;

            return () => {
                cleanup();
                waveController.current = null;
            };
        }
    }, []);

    return {canvasRef, waveController};
}

export function useUpdateOnScroll(waveController, scrollState){
    useEffect(() => {
        if (waveController.current) {
            waveController.current(scrollState);
        }
    }, [scrollState]);
}

export function init(canvasElement) {
    let renderer, scene, camera;
    let width, height, wWidth, wHeight;
    let plane;
    let animationId;

    const conf = {
        fov: 70,
        cameraZ: 75,
        xyCoef: 50,
        zCoef: 10,
        lightIntensity: 0.9,
        // Base colors
        baseColors: [0x0E09DC, 0x1CD1E1, 0x18C02C, 0xee3bcf],
    };

    const simplex = new SimplexNoise();
    const mouse = new THREE.Vector2();
    const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mousePosition = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();

    // Lights
    const lightDistance = 500;
    const light1 = new THREE.PointLight(conf.baseColors[0], conf.lightIntensity, lightDistance);
    const light2 = new THREE.PointLight(conf.baseColors[1], conf.lightIntensity, lightDistance);
    const light3 = new THREE.PointLight(conf.baseColors[2], conf.lightIntensity, lightDistance);
    const light4 = new THREE.PointLight(conf.baseColors[3], conf.lightIntensity, lightDistance);

    // --- Helpers ---

    const mapRange = (value, inMin, inMax, outMin, outMax) => {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    };

    const updateSize = () => {
        width = canvasElement.clientWidth || window.innerWidth;
        height = canvasElement.clientHeight || window.innerHeight;

        if (renderer && camera) {
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            const wsize = getRendererSize();
            wWidth = wsize[0];
            wHeight = wsize[1];
        }
    };

    const onMouseMove = (e) => {
        const v = new THREE.Vector3();
        camera.getWorldDirection(v);
        v.normalize();
        mousePlane.normal = v;
        mouse.x = (e.clientX / width) * 2 - 1;
        mouse.y = -(e.clientY / height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(mousePlane, mousePosition);
    };

    const getRendererSize = () => {
        const cam = new THREE.PerspectiveCamera(camera.fov, camera.aspect);
        const vFOV = cam.fov * Math.PI / 180;
        const h = 2 * Math.tan(vFOV / 2) * Math.abs(conf.cameraZ);
        const w = h * cam.aspect;
        return [w, h];
    };

    const initScene = () => {
        scene = new THREE.Scene();

        // Position Lights
        const r = 30;
        const y = 10;
        light1.position.set(0, y, r);
        light2.position.set(0, -y, -r);
        light3.position.set(r, y, 0);
        light4.position.set(-r, y, 0);
        scene.add(light1);
        scene.add(light2);
        scene.add(light3);
        scene.add(light4);

        // Plane
        const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });

        // FIX: Ensure segment counts are Integers and use PlaneBufferGeometry
        const segmentsX = Math.floor(wWidth / 2) || 1;
        const segmentsY = Math.floor(wHeight / 2) || 1;

        // Use PlaneBufferGeometry explicitly to ensure attributes.position exists
        const geo = new THREE.PlaneBufferGeometry(wWidth, wHeight, segmentsX, segmentsY);

        plane = new THREE.Mesh(geo, mat);
        scene.add(plane);

        plane.rotation.x = -Math.PI / 2 - 0.2;
        plane.position.y = -25;
        camera.position.z = 60;
    };

    const animatePlane = () => {
        // FIX: Robust check for geometry attributes to prevent "undefined" error
        if (!plane || !plane.geometry || !plane.geometry.attributes || !plane.geometry.attributes.position) return;

        const gArray = plane.geometry.attributes.position.array;
        const time = Date.now() * 0.0002;

        for (let i = 0; i < gArray.length; i += 3) {
            gArray[i + 2] = simplex.noise4D(gArray[i] / conf.xyCoef, gArray[i + 1] / conf.xyCoef, time, mouse.x + mouse.y) * conf.zCoef;
        }
        plane.geometry.attributes.position.needsUpdate = true;
    };

    const animateLights = () => {
        const time = Date.now() * 0.001;
        const d = 50;
        light1.position.x = Math.sin(time * 0.1) * d;
        light1.position.z = Math.cos(time * 0.2) * d;
        light2.position.x = Math.cos(time * 0.3) * d;
        light2.position.z = Math.sin(time * 0.4) * d;
        light3.position.x = Math.sin(time * 0.5) * d;
        light3.position.z = Math.sin(time * 0.6) * d;
        light4.position.x = Math.sin(time * 0.7) * d;
        light4.position.z = Math.cos(time * 0.8) * d;
    };

    const animate = () => {
        animationId = requestAnimationFrame(animate);
        animatePlane();
        animateLights();
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    };

    // --- Initialization ---
    renderer = new THREE.WebGLRenderer({ canvas: canvasElement, antialias: true, alpha: true });
    camera = new THREE.PerspectiveCamera(conf.fov);
    camera.position.z = conf.cameraZ;

    updateSize(); // Calculate width/height first
    window.addEventListener('resize', updateSize);
    window.addEventListener('mousemove', onMouseMove);

    initScene(); // Create plane using calculated sizes
    animate();   // Start loop

    // --- EXTERNAL UPDATE FUNCTION ---
    const updateWaveParams = (scrollPercentage) => {
        const val = Math.max(0, Math.min(100, scrollPercentage));

        // 1. Modify Wave Shape
        // xyCoef: 50 (smooth) -> 15 (rippled)
        conf.xyCoef = mapRange(val, 0, 100, 50, 25);
        // zCoef: 10 (low) -> 25 (high)
        conf.zCoef = mapRange(val, 0, 100, 10, 10);

        // 2. Modify Colors (Hue Shift)
        const hueShift = val / 100;
        const lights = [light1, light2, light3, light4];

        lights.forEach((light, index) => {
            if(!light) return;
            const baseColor = new THREE.Color(conf.baseColors[index]);
            const hsl = {};
            baseColor.getHSL(hsl);
            light.color.setHSL((hsl.h + hueShift) % 1, hsl.s, hsl.l);
        });
    };

    // --- CLEANUP ---
    return {
        cleanup: () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', updateSize);
            window.removeEventListener('mousemove', onMouseMove);

            if (scene) {
                scene.traverse((object) => {
                    if (!object.isMesh) return;
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) {
                        if (Array.isArray(object.material)) object.material.forEach((m) => m.dispose());
                        else object.material.dispose();
                    }
                });
            }
            if (renderer) renderer.dispose();
        },
        update: updateWaveParams
    };
}