import React, {useEffect, useRef, useState} from "react";
import "../../../../assets/css/lyrics.scss";

export default function Lyrics({svgOpacity, ip}) {

    const messageRef = useRef(null);

    const formatText = (text) => {
        const words = text.trim().split(" ");
        const formatted = words
            .map((word) => {
                const chars = word
                    .split("")
                    .map((c) => `<i>${c}</i>`)
                    .join("");

                return `<span>${chars}</span><br/>`;
            })
            .join(" ");

        return formatted;
    };

    // Replay animation function
    const replayAnimation = () => {
        const el = messageRef.current;
        if (!el) return;

        el.classList.remove("animate");

        requestAnimationFrame(() => {
            void el.offsetHeight;

            requestAnimationFrame(() => {
                el.classList.add("animate");
            });
        });
    };

    useEffect(() => {
        if (!ip || !ip.ip) return;

        const el = messageRef.current;
        if (!el) return;

        const textToAnimate = `${ip.ip} ${ip.country_name},${ip.city || ''} Welcome`;

        el.innerHTML = formatText(textToAnimate);

        requestAnimationFrame(() => {
            el.classList.add("animate");
        });
    }, [ip]);

    useEffect(() => {
        const interval = setInterval(() => {
            replayAnimation();
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="component" style={{opacity: svgOpacity}}>
            <p ref={messageRef} className="typewriter js-typewriter">
                Loading....
            </p>
        </div>
    );
}