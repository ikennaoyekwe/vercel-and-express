import React, { useEffect, useRef, useState, useMemo, memo } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const SvgGlobe = memo(function SvgGlobe({ width = 400, height = 400, ip, svgOpacity }) {
    const svgRef = useRef(null);
    const landPathRef = useRef(null);
    const pingPathRef = useRef(null);
    const ringPathRef = useRef(null);

    // Interaction Refs
    const isDragging = useRef(false);
    const previousMouseX = useRef(0);
    const rotationRef = useRef([0, -10]); // [Longitude (Yaw), Latitude (Pitch)]

    // UI State
    const [isGrabbing, setIsGrabbing] = useState(false);
    const [landData, setLandData] = useState(null);

    const locationData = useMemo(() => {
        return { latitude: ip.latitude, longitude: ip.longitude };
    }, [ip.latitude, ip.longitude]);

    // 1. Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                if(landData) return;
                const mapData = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json");
                let landFeature;
                if (mapData.objects.land) {
                    landFeature = topojson.feature(mapData, mapData.objects.land);
                } else {
                    landFeature = topojson.merge(mapData, mapData.objects.countries.geometries);
                }
                setLandData(landFeature);
            } catch (err) {
                console.error("Globe Data Error:", err);
            }
        };
        fetchData();
    }, []);

    // 2. Setup Initial Position when locationData loads
    useEffect(() => {
        if(locationData) {
            // Set initial rotation so the IP location faces the user
            // We use -longitude to center it
            rotationRef.current = [-locationData.longitude, -10];
        }
    }, [locationData]);

    // 3. The Animation & Rendering Loop
    useEffect(() => {
        if (!landData || !locationData || !svgRef.current) return;

        const projection = d3.geoOrthographic()
            .scale(width / 2.1)
            .translate([width / 2, height / 2])
            .clipAngle(90)
            .precision(0.1);

        const pathGenerator = d3.geoPath().projection(projection);

        // Rotation Speed (Auto-spin)
        const autoSpinSpeed = 0.2;

        const timer = d3.timer(() => {
            // 1. Logic: Update Rotation
            // If user is NOT dragging, we auto-rotate.
            // If user IS dragging, rotation is updated via mouse events (see below)
            if(!isDragging.current) {
                rotationRef.current[0] += autoSpinSpeed;
            }

            // Apply the current rotationRef to the projection
            projection.rotate(rotationRef.current);

            // 2. Update Land Path
            if (landPathRef.current) {
                landPathRef.current.setAttribute("d", pathGenerator(landData));
            }

            // 3. Update Ping (The Red Dot)
            const pingCircle = d3.geoCircle()
                .center([locationData.longitude, locationData.latitude])
                .radius(1.5)();

            if (pingPathRef.current) {
                const d = pathGenerator(pingCircle);
                pingPathRef.current.style.display = d ? "block" : "none";
                pingPathRef.current.setAttribute("d", d || "");
            }

            // 4. Update Ring (Radar Effect)
            const cycle = (Date.now() % 2000) / 2000;
            const ringRadius = 1.5 + (cycle * 15);
            const opacity = 1 - cycle;

            const ringCircle = d3.geoCircle()
                .center([locationData.longitude, locationData.latitude])
                .radius(ringRadius)();

            if (ringPathRef.current) {
                const d = pathGenerator(ringCircle);
                ringPathRef.current.style.display = d ? "block" : "none";
                ringPathRef.current.setAttribute("d", d || "");
                ringPathRef.current.setAttribute("stroke-opacity", opacity);
            }
        });

        return () => {
            timer.stop();
        };
    }, [landData, locationData, width, height]);

    // --- Interaction Handlers ---

    const handleMouseDown = (e) => {
        isDragging.current = true;
        previousMouseX.current = e.clientX;
        setIsGrabbing(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;

        const currentX = e.clientX;
        const deltaX = currentX - previousMouseX.current;

        // Update rotation based on mouse movement
        // Sensitivity factor (0.5 means 1px mouse move = 0.5 degree rotation)
        const sensitivity = 0.5;
        rotationRef.current[0] += deltaX * sensitivity;

        previousMouseX.current = currentX;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        setIsGrabbing(false);
    };

    const handleMouseLeave = () => {
        // Also stop dragging if mouse leaves the svg area
        if(isDragging.current) {
            isDragging.current = false;
            setIsGrabbing(false);
        }
    };

    return (
        <div
            style={{
                width: width,
                height: height,
                position: 'relative',
                cursor: isGrabbing ? 'grabbing' : 'grab', // Hand icon logic
                touchAction: 'none', // Prevents scrolling on mobile while dragging globe
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            <svg
                ref={svgRef}
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                style={{ overflow: 'visible', pointerEvents: 'none' }} // Pass events to div
            >
                {/* 1. Globe Background */}
                <circle cx={width/2} cy={height/2} r={width/2.1} fill="transparent" />

                {/* 2. The Land Map */}
                <path
                    ref={landPathRef}
                    fill="#1a1a1a"
                    stroke="none"
                />

                {/* 3. The Solid Red Dot */}
                <path
                    ref={pingPathRef}
                    fill="red"
                />

                {/* 4. The Expanding Ring */}
                <path
                    ref={ringPathRef}
                    fill="none"
                    stroke="red"
                    strokeWidth="1.5"
                />
            </svg>
        </div>
    );
});

export default SvgGlobe;