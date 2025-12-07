import React, {useEffect, useRef} from "react";
import "../../../../assets/css/lyrics.scss";

export default function Lyrics({svgOpacity}) {

    const messageRef = useRef(null);

    // Utility to wrap characters & words
    const formatText = (text) => {
        const words = text.trim().split(" ");
        const formatted = words
            .map((word) => {
                const chars = word
                    .split("")
                    .map((c) => `<i>${c}</i>`)
                    .join("");

                return `<span>${chars}</span>`;
            })
            .join(" ");

        return formatted;
    };

    // Replay animation function
    const replayAnimation = () => {
        const el = messageRef.current;
        if (!el) return;

        el.classList.remove("animate");

        // Using requestAnimationFrame ensures the browser registers the removal
        requestAnimationFrame(() => {
            // force reflow (el.offsetHeight)
            void el.offsetHeight;

            requestAnimationFrame(() => {
                el.classList.add("animate");
            });
        });
    };

    useEffect(() => {
        const el = messageRef.current;
        if (!el) return;

        const originalText = el.innerText;
        el.innerHTML = formatText(originalText);

        // kick off animation
        requestAnimationFrame(() => {
            el.classList.add("animate");
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            replayAnimation();
        }, 4000);

        return () => clearInterval(interval); // cleanup on unmount
    }, []); // empty deps = run once

    return (
        <div className="component" style={{opacity: svgOpacity}}>
            <p ref={messageRef} className="typewriter js-typewriter">
                Coding is to programming what typing is to writing.
            </p>
        </div>
    );
}


function myFunction() {


    let log = console.log.bind(console),
        messageElement = document.querySelector('.js-typewriter'),
        text = messageElement.innerText.trim();

    let words = text.split(' ');

    let work = [];

    words.forEach(word => {
        let splitWord = word.split('').map((char, index) => {
            return `<i>${char}</i>`;
        }).join('');
        work.push(splitWord);
    });

    let formattedWords = work.map((word, index) => {
        return `<span>${word}</span>`;
    }).join(' ');

    messageElement.innerHTML = formattedWords;
    messageElement.classList.add('animate');

    return {
        replay: (event) => {
            messageElement.classList.remove('animate');
            messageElement.offsetHeight; // force reflow
            setTimeout(_ => {
                messageElement.classList.add('animate');
            });
        }
    };
}