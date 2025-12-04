import * as React from "react";

export default function AboutMe_Slider() {
    return (
        <div>
            <style>{`
        @keyframes slideInFromLeft {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-left {
          animation: slideInFromLeft 0.7s;
        }
      `}</style>
            <div
                className="fixed left-0 z-10 bg-blue-500 shadow-lg flex items-center justify-center animate-slide-in-left mt-[2em]">
                <span className="text-white text-lg font-semibold">React.js</span>
            </div>

            <div
                className="fixed left-0 z-10 bg-blue-500 shadow-lg flex items-center justify-center animate-slide-in-left mt-[4em]">
                <span className="text-white text-lg font-semibold">Mysql &amp; Mongodb</span>
            </div>

            <div
                className="fixed left-0 z-10 bg-blue-500 shadow-lg flex items-center justify-center animate-slide-in-left mt-[6em]">
                <span className="text-white text-lg font-semibold">Php &amp; Laravel Framework</span>
            </div>

            <div
                className="fixed left-0 z-10 bg-blue-500 shadow-lg flex items-center justify-center animate-slide-in-left mt-[8em]">
                <span className="text-white text-lg font-semibold">Javascript, Node.js &amp; Express.js</span>
            </div>
        </div>
    );
}
