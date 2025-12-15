import {useCallback, useEffect, useRef, useState} from "react";
import {isMobile} from "react-device-detect";

export function useIp() {
    const [ip, setIp] = useState({});

    useEffect(() => {
        const fetchIp = async () => {
            if(localStorage.getItem("PC_ID") === "771a4fc0-c417-4800-a64d-d0558abf0993") {
                setIp({message: "Localhost was Detected", latitude: 10, longitude: 10, country_name: "Localhost", city: "home arash samandar", ip: "127.0.0.1"});
                return;
            }
            try{
                const response = await fetch("/api/tests/getIp");
                const json1 = await response.json();
                const response2 = await fetch("https://ipapi.co/json/");
                const json2 = await response2.json();
                const data = {
                    ip: json1?.ip ?? null,
                    latitude: json2?.latitude ?? null,
                    longitude: json2?.longitude ?? null,
                    country_name: json2?.country_name ?? null,
                    city: json2?.city ?? null,
                }
                console.log(data);
                setIp(data);
            }catch (err) {
                console.error("API Error", err);
                setIp({ message: "error has happened in fetching location", latitude: 51, longitude: 41, country_name: "Nigeria", city: "home arash samandar", ip: "127.0.0.1"});
            }
        }
        console.log("fetch ran");
        fetchIp()
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
        console.log(svg);
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