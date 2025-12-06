import { useState, useEffect } from 'react';

export default function TypeWriter() {
    const [text, setText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const fullText = "Hello my name is arash";

    useEffect(() => {
        if (text.length < fullText.length) {
            const timeout = setTimeout(() => {
                setText(fullText.slice(0, text.length + 1));
            }, 100);
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
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-gray-900 p-8 rounded-lg shadow-2xl border border-gray-700 max-w-2xl w-full">
                <div className="font-mono text-2xl text-green-400">
                    {text}
                    <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
            |
          </span>
                </div>

                <button
                    onClick={() => setText('')}
                    className="mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-mono text-sm transition-colors"
                >
                    Restart
                </button>
            </div>
        </div>
    );
}