import {useCallback, useEffect, useRef, useState} from "react";
import {isMobile} from "react-device-detect";


export function useIp() {
    const [ip, setIp] = useState({});
    useEffect(() => {
        const fetchIp = async () => {
            if(localStorage.getItem("PC_ID") === "771a4fc0-c417-4800-a64d-d0558abf0993") return {message: "Local was Detected"};

            const response = await fetch("/api/tests/getIp");
            const json1 = await response.json();
            const response2 = await fetch("https://ipapi.co/json/");
            const json2 = await response2.json();
            const data = {
                ip: json1?.ip ?? null,
                latitude: json2?.latitude ?? null,
                longitude: json2?.longitude ?? null,
                country_name: json2?.country_name ?? null
            }
            console.log(data);
            setIp(data);
            return {message: "Operation Successful", ...data};
        }
        fetchIp()
            .then((r)=>console.log(r))
            .catch(e => console.log("FAILED ... "));
    }, []);

    return ip;
}

export function useScroll(){
    const firstPosition = useRef(0);
    const [svg, setSvg] = useState(1);

    useEffect(() => {
        const scroll = () => {
            const prevY = firstPosition.current;

            if (window.scrollY > prevY) setSvg(prevState => prevState - 0.035);
            if(window.scrollY < prevY) setSvg(prevState => prevState + 0.035);
            if(window.scrollY === 0) setSvg(1);

            firstPosition.current = window.scrollY;
        }
        window.addEventListener("scroll", scroll, {passive: true});
        return () => window.removeEventListener("scroll", scroll);
    }, []);

    return svg;
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