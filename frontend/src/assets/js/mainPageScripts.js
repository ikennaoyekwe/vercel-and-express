import {useCallback, useEffect} from "react";
import {isMobile} from "react-device-detect";

export default function mobileAdjustCallBack(){
    return useCallback((node) => {
        if(!node) return;
        if(node.id === 'lyrics'){
            isMobile ? node.classList.add('max-w-[70vw]') : node.classList.add('max-w-[48vw]');
        }
        if(node.id === 'svgImage')
            isMobile ? node.classList.add('mt-44') : node.classList.remove('mt-44');
    },[]);
}

export function scrollUseEffect(svgOpacity, setSvgOpacity, firstPosition){
    return useEffect(() => {
        const scroll = () => {
            const prevY = firstPosition.current;

            if (window.scrollY > prevY) setSvgOpacity(prevState => prevState - 0.035);
            if(window.scrollY < prevY) setSvgOpacity(prevState => prevState + 0.035);
            if(window.scrollY === 0) setSvgOpacity(1);

            firstPosition.current = window.scrollY;
        }
        window.addEventListener("scroll", scroll, {passive: true});

        return () => window.removeEventListener("scroll", scroll);
    }, []);
}