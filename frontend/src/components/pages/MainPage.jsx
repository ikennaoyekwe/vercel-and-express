import React from 'react';
import initialParticlesUseEffect from "../../assets/js/mainPage/Particles.js";
import {scrollUseEffect, returnHooksVariables, fetchIpUseEffect} from "../../assets/js/mainPage/mainPageScripts.js";
import Svg_mainPage from "./pages_components/MainPage/svg_mainPage.jsx";
import MovingWave from "./pages_components/MainPage/movingWave.jsx";
import TypeWriter from "./pages_components/MainPage/typeWriter.jsx";
import Lyrics from "./pages_components/MainPage/Lyrics.jsx";
import NameTag from "./pages_components/MainPage/nameTag.jsx";
import Globe_efficient from "./pages_components/MainPage/globe_efficient.jsx";
import {isMobile} from "react-device-detect";

export default function MainPage() {

    const {userIp, setUserIp, firstPosition, svgOpacity, setSvgOpacity, canvasRef} = returnHooksVariables();

    initialParticlesUseEffect(canvasRef);

    fetchIpUseEffect(userIp, setUserIp);
    scrollUseEffect(setSvgOpacity, firstPosition);


    return (
        <div>
            <div id="lyrics" className="max-w-[70vw] md:max-w-[48vw] h-[50px] mx-0">
                <Lyrics svgOpacity={svgOpacity}/>
            </div>
            {isMobile ? (
                <div id="globe" className="fixed top-1/3 left-0 -translate-x-1/2 -translate-y-1/2">
                    <Globe_efficient width="500" height="500"/>
                </div>
            ) : (
                <div id="globe" className="fixed top-[36%] left-0 -translate-x-1/2 -translate-y-1/2">
                    <Globe_efficient width="1000" height="1000"/>
                </div>
            )}

            <div className="flex flex-col min-h-[68.4vh] items-center justify-center">
                <div id="svgImage" className="w-1/4 min-w-[350px] md:mt-0 mt-44">
                    <Svg_mainPage svgOpacity={svgOpacity} />
                </div>
                <div className="w-full flex justify-center">
                    <div className="ml-5 w-full max-w-[420px]">
                        <TypeWriter svgOpacity={svgOpacity}/>
                    </div>
                    <NameTag svgOpacity={svgOpacity} classNames="hidden md:block"/>
                </div>
                <NameTag svgOpacity={svgOpacity} classNames="block md:hidden"/>
            </div>
            <div className="flex justify-center">
                <div className="h-[800px]">Hello PUll Up Content</div>
            </div>
            <MovingWave scrollState={100 - (svgOpacity * 100)}/>
            <canvas id="particles-canvas" ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none"/>
        </div>
    );
}