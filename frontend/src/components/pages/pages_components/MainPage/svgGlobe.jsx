import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

export default function SvgGlobe({ width = 400, height = 400, ip }) {
    const svgRef = useRef(null);
    const landPathRef = useRef(null);
    const pingPathRef = useRef(null);
    const ringPathRef = useRef(null);

    const locationData = { latitude: ip.latitude, longitude: ip.longitude };
    // State for data
    const [landData, setLandData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            // B. Fetch Map Data
            try {
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

    // 3. The Animation Loop (SVG Version)
    useEffect(() => {
        if (!landData || !locationData || !svgRef.current) return;

        // Setup D3 Projection
        const projection = d3.geoOrthographic()
            .scale(width / 2.1)
            .translate([width / 2, height / 2])
            .clipAngle(90) // Hides things on the back side
            .precision(0.1); // Low precision = less CPU usage

        const pathGenerator = d3.geoPath().projection(projection);

        // Configuration
        const speed = 0.015; // Rotation speed
        const start = Date.now();

        // Timer Loop
        const timer = d3.timer(() => {
            const elapsed = Date.now() - start;

            // 1. Update Rotation
            // Rotate -longitude so the location faces the user initially, then spins
            const rotateX = -locationData.longitude + (speed * elapsed);
            const rotateY = -10; // Tilt slightly
            projection.rotate([rotateX, rotateY]);

            // 2. Update Land Path
            // We directly update the 'd' attribute. This is extremely fast.
            if (landPathRef.current) {
                landPathRef.current.setAttribute("d", pathGenerator(landData));
            }

            // 3. Update Ping (The Red Dot)
            // Create a small circle geometry at the location
            const pingCircle = d3.geoCircle()
                .center([locationData.longitude, locationData.latitude])
                .radius(1.5)();

            if (pingPathRef.current) {
                const d = pathGenerator(pingCircle);
                // If d is null, the point is behind the globe
                pingPathRef.current.style.display = d ? "block" : "none";
                pingPathRef.current.setAttribute("d", d || "");
            }

            // 4. Update Ring (The Radar Effect)
            // Calculate radius based on time (0 to 2 seconds cycle)
            const cycle = (Date.now() % 2000) / 2000;
            const ringRadius = 1.5 + (cycle * 15); // Expand from 1.5 to 16.5 degrees
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
    }, [landData, width, height]);

    return (
        <div style={{ width: width, height: height, position: 'relative' }}>
            {/*
                Use a loading state if needed, but SVG renders instantly.
                Using viewBox makes it responsive.
            */}
            <svg
                ref={svgRef}
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                style={{ overflow: 'visible' }}
            >
                {/* 1. Globe Background (Optional: Makes the ocean distinct from page background) */}
                <circle cx={width/2} cy={height/2} r={width/2.1} fill="transparent" />

                {/* 2. The Land Map */}
                <path
                    ref={landPathRef}
                    fill="#1a1a1a" // Dark Grey
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
}
