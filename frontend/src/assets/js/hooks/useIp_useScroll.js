import {useCallback, useEffect, useRef, useState} from "react";
import {isMobile} from "react-device-detect";

export function useIp() {
    const [ip, setIp] = useState({});

    useEffect(() => {
        const fetchIp = async () => {
            if(localStorage.getItem("PC_ID") === "771a4fc0-c417-4800-a64d-d0558abf0993") {
                setIp({message: "Localhost was Detected", latitude: 10, longitude: 10, country_name: "Localhost", city: "Salamander Home", ip: "127.0.0.1"});
                return;
            }
            const json1 = await fetch("/api/tests/getIp")
                .then(res => res.json())
                .catch(err => {
                    console.error("Internal IP fetch failed", err);
                    return { ip: "0.0.0.0" }; // Fallback value
                });
            const json2 = await fetch("https://ipapi.co/json/")
                .then(res => res.json())
                .catch(err => {
                    console.error("External Geo fetch failed", err);
                    return { latitude: 51, longitude: 41, country_name: "Error", city: "Proxy" }; // Fallback
                });
            const data = {
                ip: json1?.ip ?? "0.0.0.0",
                latitude: json2?.latitude ?? 51,
                longitude: json2?.longitude ?? 41,
                country_name: json2?.country_name ?? "Unknown",
                city: json2?.city ?? "Unknown",
            };
            setIp(data);
        }
        fetchIp();
    }, []);

    return ip;
}

export function useScroll() {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const threshold = 400; // The scroll distance (pixels) where you want the animation to finish

            // Calculate a value between 1 and 0 based on scroll position
            // This is deterministic and will never "drift"
            const newOpacity = Math.max(0, 1 - scrollY / threshold);
            setOpacity(newOpacity);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return opacity;
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