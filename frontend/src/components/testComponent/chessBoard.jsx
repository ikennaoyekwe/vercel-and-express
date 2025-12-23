import React, { useState } from 'react';
import './chess.css';

// Data structure representing the board state
const initialBoardState = [
    // White Pieces
    { id: 'wr1', type: 'rook', color: 'white', pos: 'a1' },
    { id: 'wn1', type: 'knight', color: 'white', pos: 'b1' },
    { id: 'wb1', type: 'bishop', color: 'white', pos: 'c1' },
    { id: 'wq',  type: 'queen', color: 'white', pos: 'd1' },
    { id: 'wk',  type: 'king', color: 'white', pos: 'e1' },
    { id: 'wb2', type: 'bishop', color: 'white', pos: 'f1' },
    { id: 'wn2', type: 'knight', color: 'white', pos: 'g1' },
    { id: 'wr2', type: 'rook', color: 'white', pos: 'h1' },

    // White Pawns (generated loop for brevity)
    ...['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((col, i) => ({
        id: `wp${i}`, type: 'pawn', color: 'white', pos: `${col}2`
    })),

    // Black Pawns
    ...['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((col, i) => ({
        id: `bp${i}`, type: 'pawn', color: 'black', pos: `${col}7`
    })),

    // Black Pieces
    { id: 'br1', type: 'rook', color: 'black', pos: 'a8' },
    { id: 'bn1', type: 'knight', color: 'black', pos: 'b8' },
    { id: 'bb1', type: 'bishop', color: 'black', pos: 'c8' },
    { id: 'bq',  type: 'queen', color: 'black', pos: 'd8' },
    { id: 'bk',  type: 'king', color: 'black', pos: 'e8' },
    { id: 'bb2', type: 'bishop', color: 'black', pos: 'f8' },
    { id: 'bn2', type: 'knight', color: 'black', pos: 'g8' },
    { id: 'br2', type: 'rook', color: 'black', pos: 'h8' },
];

const ChessBoard = () => {
    const [rotate, setRotate] = useState(true);

    return (
        <div className="chessboard-scene">
            <div className={`chessboard ${!rotate ? 'paused' : ''}`}>

                {/* Render Pieces */}
                {initialBoardState.map((piece) => (
                    <div
                        key={piece.id}
                        className="piece"
                        data-type={piece.type}
                        data-color={piece.color}
                        style={{ gridArea: piece.pos }} // React handles the grid mapping here
                    >
                        <div className="x"></div>
                        {/* Pawns and Rooks in your CSS don't use the Y element, others do */}
                        {piece.type !== 'pawn' && piece.type !== 'rook' && (
                            <div className="y"></div>
                        )}
                    </div>
                ))}

                {/* Board Sides */}
                <div className="sides">
                    <div className="x" data-side="f"></div>
                    <div className="x" data-side="b"></div>
                    <div className="x" data-side="l"></div>
                    <div className="x" data-side="r"></div>
                </div>
            </div>

            {/* Controls */}
            <label htmlFor="rotate-toggle" className="controls">
                <span>Rotate Board</span>
                <input
                    type="checkbox"
                    id="rotate-toggle"
                    checked={rotate}
                    onChange={(e) => setRotate(e.target.checked)}
                />
            </label>
        </div>
    );
};

export default ChessBoard;