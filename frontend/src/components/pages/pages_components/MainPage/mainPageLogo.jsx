import React from "react";
import SvgGlobe from "./svgGlobe.jsx";
import CubeText from "./cubeText.jsx";
import NameTag from "./nameTag.jsx";
import Svg_Image_MainPage from "./svg_image_mainpage.jsx";
import "../../../../assets/sass/globeContainer.sass";

export default function MainPageLogo({svgOpacity, ip}) {
    return (
        <div className="relative w-full mt-[25vh] z-30 pointer-events-none">

            <div className={`globe-container ${svgOpacity === 1 ? "" : "globe-hidden"} relative z-40 pointer-events-auto`}>
                <SvgGlobe ip={ip} className="w-full h-full" />
            </div>
            <Svg_Image_MainPage svgOpacity={svgOpacity} className="w-full h-full pointer-events-none"/>
            <div className="w-full flex justify-center select-none">
                <div className="ml-5 w-full min-h-[400px] min-w-[600px] pointer-events-auto">
                    <CubeText svgOpacity={svgOpacity}/>
                </div>
                <NameTag svgOpacity={svgOpacity} classNames="hidden md:block"/>
            </div>
            <NameTag svgOpacity={svgOpacity} classNames="block md:hidden"/>
        </div>
    );
}