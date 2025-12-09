import {useCallback, useEffect, useRef, useState} from "react";
import {isMobile} from "react-device-detect";

export function returnHooksVariables(){
    const [userIp, setUserIp] = useState('Loading Ip...');
    const firstPosition = useRef(0);
    const [svgOpacity, setSvgOpacity] = useState(1);
    const canvasRef = useRef(null);

    return {
        userIp: userIp,
        setUserIp: setUserIp,
        firstPosition: firstPosition,
        svgOpacity: svgOpacity,
        setSvgOpacity: setSvgOpacity,
        canvasRef: canvasRef,
    }
}

export function fetchIpUseEffect(userIp, setUserIp) {
    return useEffect(() => {
        const fetchIp = async () => {
            try{
                const response = await fetch("/api/tests/getIp");
                const json = await response.json();
                setUserIp(json.message + " - " + json.ip);
            }catch (error) {
                console.log(error);
            }
        }
        fetchIp().then(r => console.log(r));
    }, []);
}

export function scrollUseEffect(setSvgOpacity, firstPosition){
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


export function mobileAdjustCallBack(){
    return useCallback((node) => {
        if(!node) return;
        if(node.id === 'lyrics'){
            isMobile ? node.classList.add('max-w-[70vw]') : node.classList.add('max-w-[48vw]');
        }
        if(node.id === 'svgImage')
            isMobile ? node.classList.add('mt-44') : node.classList.remove('mt-44');
    },[]);
}