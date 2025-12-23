import React, {useState} from 'react';
import useInitParticles from "../../assets/js/mainPage/Particles.js";
import {useScroll, useIp} from "../../assets/js/hooks/useIp_useScroll.js";
import Svg_mainPage from "./pages_components/MainPage/svg_mainPage.jsx";
import MovingWave from "./pages_components/MainPage/movingWave.jsx";
import TypeWriter from "./pages_components/MainPage/typeWriter.jsx";
import Lyrics from "./pages_components/MainPage/Lyrics.jsx";
import NameTag from "./pages_components/MainPage/nameTag.jsx";
import CubeText from "./pages_components/MainPage/cubeText.jsx";

export default function MainPage() {

    // @todo : console.log(window.navigator.hardwareConcurrency + " | " + window.navigator.deviceMemory);
    const [isLowPower, setIsLowPower] = useState(false);
    const svgOpacity = useScroll();
    const canvasRef = useInitParticles();
    const ip = useIp();

    return (
        <div>
            <div id="lyrics" className={`fixed max-w-[70vw] md:max-w-[48vw] h-[50px] z-20 ${svgOpacity < 0.9 ? "top-[-20px]" : ""}`}>
                <Lyrics svgOpacity={svgOpacity} ip={ip}/>
            </div>
            <br/><br/>
            <div className="flex flex-col min-h-[68.4vh] items-center justify-center">
                <div id="svgImage" className="w-1/4 min-w-[350px] md:mt-0 mt-44 z-20">
                    <Svg_mainPage svgOpacity={svgOpacity} ip={ip}/>
                </div>
                <div className="w-full flex justify-center select-none">
                    <div className="ml-5 w-full max-w-[700px]">
                        <CubeText/>
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