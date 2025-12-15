import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const SvgGlobe = React.memo(function SvgGlobe({ width = 400, height = 400, ip }) {
    const svgRef = useRef(null);
    const landPathRef = useRef(null);
    const pingPathRef = useRef(null);
    const ringPathRef = useRef(null);
    // State for map data
    const [landData, setLandData] = useState(null);

    const locationData = useMemo(() => {
        if(!ip || !ip.latitude || !ip.longitude) return null;
        return { latitude: ip.latitude, longitude: ip.longitude };
    }, [ip.latitude, ip.longitude]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check if we already have data to prevent re-fetching (optional optimization)
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

    // 3. The Animation Loop
    useEffect(() => {
        if (!landData || !locationData || !svgRef.current) return;

        const projection = d3.geoOrthographic()
            .scale(width / 2.1)
            .translate([width / 2, height / 2])
            .clipAngle(90)
            .precision(0.1);

        const pathGenerator = d3.geoPath().projection(projection);

        const speed = 0.015;
        
        const start = Date.now();

        const timer = d3.timer(() => {
            const elapsed = Date.now() - start;

            // 1. Update Rotation
            const rotateX = -locationData.longitude + (speed * elapsed);
            const rotateY = -10;
            projection.rotate([rotateX, rotateY]);

            // 2. Update Land Path
            if (landPathRef.current) {
                landPathRef.current.setAttribute("d", pathGenerator(landData));
            }

            // 3. Update Ping
            const pingCircle = d3.geoCircle()
                .center([locationData.longitude, locationData.latitude])
                .radius(1.5)();

            if (pingPathRef.current) {
                const d = pathGenerator(pingCircle);
                pingPathRef.current.style.display = d ? "block" : "none";
                pingPathRef.current.setAttribute("d", d || "");
            }

            // 4. Update Ring
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

    return (
        <div style={{ width: width, height: height, position: 'relative' }}>
            <svg
                ref={svgRef}
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                style={{ overflow: 'visible' }}
            >
                <circle cx={width/2} cy={height/2} r={width/2.1} fill="transparent" />
                <path ref={landPathRef} fill="#1a1a1a" stroke="none" />
                <path ref={pingPathRef} fill="red" />
                <path ref={ringPathRef} fill="none" stroke="red" strokeWidth="1.5" />
            </svg>
        </div>
    );
});

export default SvgGlobe;
