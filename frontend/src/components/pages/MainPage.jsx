import React, {useEffect} from 'react';
import {isMobile} from "react-device-detect";
import initialParticlesUseEffect from "../../assets/js/Particles.js";
import mobileAdjustCallBack, {scrollUseEffect, returnHooksVariables} from "../../assets/js/mainPageScripts.js";
import Svg_mainPage from "./pages_components/MainPage/svg_mainPage.jsx";
import MovingWave from "./pages_components/MainPage/movingWave.jsx";
import TypeWriter from "./pages_components/MainPage/typeWriter.jsx";
import Lyrics from "./pages_components/MainPage/Lyrics.jsx";

export default function MainPage() {

    const {userIp, setUserIp, firstPosition, svgOpacity, setSvgOpacity, canvasRef} = returnHooksVariables();
    const mobileSize = mobileAdjustCallBack();
    scrollUseEffect(svgOpacity, setSvgOpacity, firstPosition);

    initialParticlesUseEffect(canvasRef);

    useEffect(() => {
        const fetchIp = async () => {
            try{
                const response = await fetch("/api/tests/checkRoute");
                const json = await response.json();
                setUserIp(json.ip);
            }catch (error) {
                console.log(error);
            }
        }
        fetchIp().then(r => console.log(r));
    }, []);



    return (
        <div>
            <div id="lyrics" ref={node => mobileSize(node)} className="h-[50px] mx-0">
                <Lyrics svgOpacity={svgOpacity}/><br/>
                {userIp}
            </div>
            <div className="flex flex-col min-h-[68.4vh] items-center justify-center">
                <div id="svgImage" ref={node => mobileSize(node)} className="w-1/4 min-w-[350px]">
                    <Svg_mainPage svgOpacity={svgOpacity} />
                </div>
                <div className="w-full flex justify-center">
                    <div className="ml-5 w-full max-w-[420px]">
                        <TypeWriter svgOpacity={svgOpacity}/>
                    </div>
                    <div style={{ display: isMobile ? "none" : "block"}}>
                        <span style={{fontSize: "1.5em",textShadow: "1px 10px 8px black",marginLeft: "1em",color: "gray", opacity: svgOpacity}}>Ikenna</span>
                    </div>
                </div>
                <div style={{ display: isMobile ? "block" : "none"}}>
                    <span style={{fontSize: "1.5em",textShadow: "1px 10px 8px black",marginLeft: "1em",color: "gray", opacity: svgOpacity}}>Ikenna</span>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="h-[800px]">Hello PUll Up Content</div>
            </div>
            <MovingWave/>
            <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none"/>
        </div>
    );
}