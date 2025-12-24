import React, { useEffect, useRef, useState, memo } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const CanvasGlobe = memo(function CanvasGlobe({ width = 400, height = 400, ip }) {
    const canvasRef = useRef(null);
    const rotationRef = useRef([0, -10]);
    const isDragging = useRef(false);
    const previousMouseX = useRef(0);
    const [landData, setLandData] = useState(null);

    // 1. Fetch data once
    useEffect(() => {
        d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json").then(mapData => {
            setLandData(topojson.feature(mapData, mapData.objects.land));
        });
    }, []);

    useEffect(() => {
        if (!landData || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d", { alpha: true });
        const scale = window.devicePixelRatio || 1;
        canvas.width = width * scale;
        canvas.height = height * scale;
        context.scale(scale, scale);

        const projection = d3.geoOrthographic()
            .scale(width / 2.1)
            .translate([width / 2, height / 2])
            .clipAngle(90)
            .precision(0.9); // Lower precision = faster math

        const pathGenerator = d3.geoPath().projection(projection).context(context);

        const render = () => {
            if (!isDragging.current) {
                rotationRef.current[0] += 0.2;
            }
            projection.rotate(rotationRef.current);

            context.clearRect(0, 0, width, height);
            context.beginPath();
            pathGenerator(landData);
            context.fillStyle = "#1a1a1a";
            context.fill();
            const center = [ip.longitude, ip.latitude];
            const projectedPoint = projection(center);
            const distance = d3.geoDistance(center, [-rotationRef.current[0], -rotationRef.current[1]]);
            const isVisible = distance < Math.PI / 2;

            if (isVisible && projectedPoint) {
                const [x, y] = projectedPoint;

                // Solid Red Dot
                context.beginPath();
                context.arc(x, y, 4, 0, 4 * Math.PI);
                context.fillStyle = "red";
                context.fill();

                // Expanding Radar Ring
                const cycle = (Date.now() % 2000) / 2000;
                const ringRadius = 2 + cycle * 20;
                context.beginPath();
                context.arc(x, y, ringRadius, 0, 2 * Math.PI);
                context.strokeStyle = `rgba(255, 0, 0, ${1 - cycle})`;
                context.lineWidth = 1.5;
                context.stroke();
            }
        };

        const timer = d3.timer(render);
        return () => timer.stop();
    }, [landData, ip, width, height]);

    // Interaction handlers
    const onMouseDown = (e) => { isDragging.current = true; previousMouseX.current = e.clientX; };
    const onMouseMove = (e) => {
        if (!isDragging.current) return;
        rotationRef.current[0] += (e.clientX - previousMouseX.current) * 0.5;
        previousMouseX.current = e.clientX;
    };
    const onMouseUp = () => { isDragging.current = false; };

    return (
        <canvas
            ref={canvasRef}
            style={{ width, height, cursor: 'grab', touchAction: 'none' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        />
    );
});

export default CanvasGlobe;