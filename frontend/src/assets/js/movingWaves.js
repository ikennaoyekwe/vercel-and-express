import * as THREE from 'three';
import SimplexNoise from "simplex-noise";
// import chroma from 'chroma-js'; // Uncomment if you use chroma

export function init(canvasElement) {
    // 1. ALL variables must be defined INSIDE this function scope
    // This prevents them from persisting when React unmounts the component
    let renderer, scene, camera;
    let width, height, wWidth, wHeight;
    let plane;
    let animationId; // To store the loop ID

    // Configuration
    const conf = {
        fov: 75,
        cameraZ: 75,
        xyCoef: 50,
        zCoef: 10,
        lightIntensity: 0.9,
        light1Color: 0x0E09DC,
        light2Color: 0x1CD1E1,
        light3Color: 0x18C02C,
        light4Color: 0xee3bcf
    };

    const simplex = new SimplexNoise();
    const mouse = new THREE.Vector2();
    const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mousePosition = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();

    // Lights
    const lightDistance = 500;
    const light1 = new THREE.PointLight(conf.light1Color, conf.lightIntensity, lightDistance);
    const light2 = new THREE.PointLight(conf.light2Color, conf.lightIntensity, lightDistance);
    const light3 = new THREE.PointLight(conf.light3Color, conf.lightIntensity, lightDistance);
    const light4 = new THREE.PointLight(conf.light4Color, conf.lightIntensity, lightDistance);

    // --- Helper Functions defined inside to access local variables ---

    const updateSize = () => {
        width = canvasElement.clientWidth;
        height = canvasElement.clientHeight;

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

        // Lights
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
        const geo = new THREE.PlaneBufferGeometry(wWidth, wHeight, wWidth / 2, wHeight / 2);
        plane = new THREE.Mesh(geo, mat);
        scene.add(plane);

        plane.rotation.x = -Math.PI / 2 - 0.2;
        plane.position.y = -25;
        camera.position.z = 60;
    };

    const animatePlane = () => {
        if(!plane) return;
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
        // This is the recursive loop
        animationId = requestAnimationFrame(animate);

        animatePlane();
        animateLights();
        renderer.render(scene, camera);
    };

    // --- Initialization Logic ---

    renderer = new THREE.WebGLRenderer({ canvas: canvasElement, antialias: true, alpha: true });
    camera = new THREE.PerspectiveCamera(conf.fov);
    camera.position.z = conf.cameraZ;

    updateSize(); // Initial size calculation

    // Add Listeners
    window.addEventListener('resize', updateSize);
    canvasElement.addEventListener('mousemove', onMouseMove);

    initScene();
    animate(); // Start Loop

    // --- RETURN CLEANUP FUNCTION ---
    // This function will be called by React when the component unmounts
    return () => {
        // 1. Stop the loop
        cancelAnimationFrame(animationId);

        // 2. Remove Event Listeners
        window.removeEventListener('resize', updateSize);
        canvasElement.removeEventListener('mousemove', onMouseMove);

        // 3. Dispose Geometries and Materials (Important for GPU memory)
        scene.traverse((object) => {
            if (!object.isMesh) return;

            if (object.geometry) {
                object.geometry.dispose();
            }

            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach((material) => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });

        // 4. Dispose Renderer
        renderer.dispose();
    };
}