import React from "react";
import "../../../assets/css/testCss.css";

export default function Css_Rotating_2d() {
    const text = "ARASH";
    const layers = 15; // Depth of the text (number of copies)

    return (
        <div className="v-container">
            <div className="v-scene">
                <div className="v-word-box">
                    {/* We create an array of length 'layers'.
             We map over it to create the "slices" of the 3D text.
          */}
                    {[...Array(layers)].map((_, i) => (
                        <span
                            key={i}
                            className="v-layer"
                            style={{
                                // Each layer is pushed back 1px further than the last
                                transform: `translateZ(-${i}px)`,
                                // The last layer (back) and first (front) get special styling via CSS,
                                // but we can fade the color here for a shadow effect
                                color: i === 0 ? 'white' : '#0ea5e9', // First layer white, rest blue
                                opacity: i === 0 ? 1 : 0.7, // Make sides semi-transparent for neon look
                            }}
                        >
              {text}
            </span>
                    ))}
                </div>
            </div>
        </div>
    );
}