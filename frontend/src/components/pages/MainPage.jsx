import React, {useState} from 'react';
import useInitParticles from "../../assets/js/mainPage/Particles.js";
import {useScroll, useIp} from "../../assets/js/hooks/useIp_useScroll.js";
import MainPageLogo from "./pages_components/MainPage/mainPageLogo.jsx";
import MovingWave from "./pages_components/MainPage/movingWave.jsx";
import Lyrics from "./pages_components/MainPage/Lyrics.jsx";
import ArashCard from "./pages_components/MainPage/arashCard.jsx";

export default function MainPage() {

    // @todo : console.log(window.navigator.hardwareConcurrency + " | " + window.navigator.deviceMemory);
    const [waveLoaded, setWaveLoaded] = useState(false);
    const [isLowPower, setIsLowPower] = useState(false);
    const svgOpacity = useScroll();
    const canvasRef = useInitParticles();
    const ip = useIp();

    return (
        <div>
            <div id="lyrics" className={`fixed smallMobile:top-[10%] max-w-[70vw] md:max-w-[48vw] h-[50px] ${svgOpacity < 0.9 ? "top-[-20px]" : "top-[20px]"}`}>
                <Lyrics svgOpacity={svgOpacity} ip={ip}/>
            </div>
            <br/><br/>
            <div className="flex flex-col min-h-[68.4vh] items-center justify-center">
                <div id="svgImage" className="w-1/4 min-w-[350px] md:mt-0">
                    <MainPageLogo svgOpacity={svgOpacity} ip={ip}/>
                </div>
            </div>
            <div className="flex justify-center pointer-events-auto">
                <div className="h-[1000px] z-10 pointer-events-auto">
                    {waveLoaded && <ArashCard/>}
                </div>
            </div>
            <MovingWave scrollState={100 - (svgOpacity * 100)} onComplete={()=>setWaveLoaded(true)} />
            <canvas id="particles-canvas" ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none"/>
        </div>
    );
}