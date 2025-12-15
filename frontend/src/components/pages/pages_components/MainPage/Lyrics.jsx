import React, {useEffect, useRef, useState} from "react";
import "../../../../assets/css/lyrics.scss";

export default function Lyrics({svgOpacity, ip}) {

    const messageRef = useRef(null);

    const formatText = (text) => {
        const lines = text.trim().split("\n");
        const formatted = lines
            .map((line) => {
                const chars = line
                    .split("")
                    .map((c) => {
                        if (c === " ") return "<i>&nbsp;</i>";
                        return `<i>${c}</i>`;
                    })
                    .join("");
                return `<span>${chars}</span>`;
            })
            .join("<br/>");
        return formatted;
    };

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
        // Guard clause to ensure we have data
        if (!ip || !ip.ip) return;

        const el = messageRef.current;
        if (!el) return;

        // 3. Construct the string using \n to mark where you want lines to break.
        // Spaces inside the variables (like city name) will now stay on the same line.
        const textToAnimate = `${ip.ip}\n${ip.country_name} ${ip.city || ''}\nWelcome`;

        el.innerHTML = formatText(textToAnimate);

        requestAnimationFrame(() => {
            el.classList.add("animate");
        });
    }, [ip]); // Rerun when IP data arrives

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