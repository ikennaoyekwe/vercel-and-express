import React, {useEffect, useRef, useState} from "react";

export default function CanvasTests() {

    const [clickPoint, setClickPoint] = useState({x: 0, y: 0});
    const myCanvasRef = useRef();

    useEffect(() => {
        const context = myCanvasRef.current.getContext("2d");
        let x = 0;
        let y = 0;

        const handleClick = (event) => {
            const rect = myCanvasRef.current.getBoundingClientRect();
            setClickPoint(
                { x: event.clientX - rect.left,
                    y: event.clientY - rect.top
                }
            );
        }



        const drawHorizontalLine = () => {

            context.clearRect(0, 0, myCanvasRef.current.width, myCanvasRef.current.height);

            if(clickPoint.x !== 0 && clickPoint.y !== 0){
                context.beginPath();
                context.arc(clickPoint.x, clickPoint.y, 4, 0, Math.PI * 2, false);
                context.fillStyle = "red";
                context.fill();
            }

            context.beginPath();
            context.strokeStyle = "red"
            context.moveTo(x, myCanvasRef.current.height / 2);
            context.lineTo(x + 10, myCanvasRef.current.height / 2);
            context.stroke();
            x += 5;
            if (x > myCanvasRef.current.width) {
                x = 0;
            }
            context.beginPath();
            context.strokeStyle = "blue";
            context.moveTo(myCanvasRef.current.width / 2, y);
            context.lineTo(myCanvasRef.current.width / 2, y + 10);
            context.stroke();
            y += 5;
            if (y > myCanvasRef.current.height) {
                y = 0;
            }
            requestAnimationFrame(drawHorizontalLine);
        }

        drawHorizontalLine();
        myCanvasRef.current.addEventListener("click", handleClick);
        return () => myCanvasRef.current.removeEventListener("click", handleClick);
    }, [clickPoint]);

    return (
        <>
            <div className="flex flex-col text-center min-h-[90vh] justify-center items-center">
                <canvas ref={myCanvasRef} width={400} height={200} id="canvas" className="h-[200px] w-[400px] border border-black"/>
            </div>
        </>
    );
}