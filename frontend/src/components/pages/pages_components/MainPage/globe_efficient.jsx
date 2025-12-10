import React, { useRef, useState } from 'react';
import {
    getIpLocation,
    initD3AnimationUseEffect,
    setLocalStorageUseEffect,
    topoJsonFeatureUseEffect
} from "../../../../assets/js/mainPage/globeData.js";

const Globe_efficient = ({ width = 700, height = 700}) => {
    const canvasRef = useRef(null);
    const [data, setData] = useState({message: "reading from internal", latitude: 10, longitude: 10, country_name: "Somewheres"});
    const [landData, setLandData] = useState(null);

    setLocalStorageUseEffect();
    topoJsonFeatureUseEffect(setLandData, setData, getIpLocation);
    initD3AnimationUseEffect(width, height, canvasRef, landData, data);

    return (
        <div style={{ position: 'relative', width: width, height: height }}>
            {!landData && <p>Loading Globe...</p>}
            <canvas
                id="global-globe"
                ref={canvasRef}
                width={width}
                height={height}
                style={{ display: 'block' }}
            />
        </div>
    );
};

export default Globe_efficient;