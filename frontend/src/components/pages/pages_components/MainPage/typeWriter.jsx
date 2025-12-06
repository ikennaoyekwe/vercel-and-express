import {useState, useEffect} from 'react';

export default function TypeWriter() {
    const [text, setText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const fullText = "Senior Web Developer";
    const typingSpeed = 100; // milliseconds per character

    useEffect(() => {
        if (text.length < fullText.length) {
            const timeout = setTimeout(() => {
                setText(fullText.slice(0, text.length + 1));
            }, typingSpeed);
            return () => clearTimeout(timeout);
        }
    }, [text]);

    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <div
            className="">
            <div
                className="text-4xl text-left font-bold bg-gradient-to-t from-white via-gray-700 to-gray-300 bg-clip-text text-transparent">
                {text}
                <span
                    className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent`}
                    style={{WebkitTextFillColor: 'transparent'}}>
                    |
                </span>
            </div>
        </div>
    );
}