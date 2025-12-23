import React, { useState, useEffect } from "react";
import "./cubeText.sass";

const PHRASES = [
    ["Senior FullStack Developer"],
    ["Welcome to my portfolio!"],
    ["years of experience", "15+ Years"],
];

const RotatingWord = ({ text }) => {
    const [displayState, setDisplayState] = useState({
        current: text,
        old: "",
        isAnimating: false,
    });

    useEffect(() => {
        if (text !== displayState.current) {
            setDisplayState({
                old: displayState.current,
                current: text,
                isAnimating: true,
            });
        }
    }, [text, displayState.current]);

    const onAnimationEnd = () => {
        setDisplayState((prev) => ({ ...prev, isAnimating: false, old: "" }));
    };

    return (
        <div className="t3xt-wrapper">
            {displayState.isAnimating && (
                <div className="t3xt t3xt-out">{displayState.old}</div>
            )}
            <div
                key={displayState.current}
                className={`t3xt ${displayState.isAnimating ? "t3xt-in" : ""}`}
                onAnimationEnd={onAnimationEnd}
            >
                {displayState.current}
            </div>
        </div>
    );
};

export default function CubeText() {
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const currentPhrase = PHRASES[phraseIndex];
        let timer;

        // Check if there are more words to show in the CURRENT phrase
        if (wordIndex < currentPhrase.length - 1) {
            timer = setTimeout(() => {
                setWordIndex((prev) => prev + 1);
            }, 150); // Staggered delay between lines
        } else {
            // Current phrase is fully displayed, wait 2s then move to next phrase
            timer = setTimeout(() => {
                setWordIndex(0);
                setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
            }, 2000);
        }

        return () => clearTimeout(timer);
    }, [wordIndex, phraseIndex]);

    return (
        <div className="t3xt-container">
            {/*
        We map through the current phrase.
        If wordIndex hasn't reached that word's index yet, we pass an empty string
        to keep it hidden until it's time to rotate in.
      */}
            {PHRASES[phraseIndex].map((word, i) => (
                <RotatingWord key={i} text={wordIndex >= i ? word : ""} />
            ))}
        </div>
    );
}