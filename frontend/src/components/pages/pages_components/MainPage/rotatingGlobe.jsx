import React, {useEffect, useRef, useState} from 'react';
import {getIpLocation, planetaryJsGlobe, fetchAndPulse} from "../../../../assets/js/mainPage/globe.js";
import "../../../../assets/css/globe.css";

const RotatingGlobe = () => {
    const canvasRef = useRef(null);
    const [city, setCity] = useState("");

    useEffect(() => {
        const canvas = canvasRef.current;
        let pingInterval = null;

        const globe = planetaryJsGlobe();
        globe.draw(canvas);

        (async () => pingInterval = fetchAndPulse(globe, await getIpLocation(setCity)))();

        return () => {
            if(pingInterval) clearInterval(pingInterval);
        };
    }, []);

    return (
        <div>
            <canvas
                ref={canvasRef}
                id="globe-canvas"
                width='990'
                height='990'
                style={{ width: "150%", cursor: "move", margin: "-13em" }}
            />
            <h1>
                <span>Our</span><br />Headquarters / {city}
            </h1>
        </div>
    );
};





export default RotatingGlobe;