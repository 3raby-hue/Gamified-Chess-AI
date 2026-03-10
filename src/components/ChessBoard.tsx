import React, { useState } from 'react';
import { Chess } from 'chess.js';

// 1. THIS FIXES THE FIRST ERROR
interface ChessBoardProps {
    fen?: string;
    onMove?: (moveDetails: { sourceSquare: string; targetSquare: string }) => Promise<boolean> | boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ fen = "start", onMove }) => {
    const chess = new Chess(fen);
    const board = chess.board();

    // Track the first click to make a move
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

    const getSquareColor = (row: number, col: number) => {
        return (row + col) % 2 === 0 ? 'rgb(235, 236, 208)' : 'rgb(119, 149, 86)';
    };

    const pieceIcons: Record<string, string> = {
        'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚',
        'P': '♙', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔'
    };

    const handleSquareClick = (squareName: string) => {
        if (!onMove) return;

        if (selectedSquare) {
            // Second click: Try to move
            onMove({ sourceSquare: selectedSquare, targetSquare: squareName });
            setSelectedSquare(null);
        } else {
            // First click: Select the piece
            setSelectedSquare(squareName);
        }
    };

    return (
        <div className="w-full aspect-square max-w-[800px] mx-auto shadow-custom rounded-xl overflow-hidden border-4 border-card flex flex-col">
            <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                {board.flat().map((sq, i) => {
                    const row = Math.floor(i / 8);
                    const col = i % 8;
                    // Calculate standard algebraic notation (e.g., "e2", "e4")
                    const file = String.fromCharCode(97 + col);
                    const rank = 8 - row;
                    const squareName = `${file}${rank}`;

                    const piece = sq ? pieceIcons[sq.color === 'w' ? sq.type.toUpperCase() : sq.type] : null;
                    const isSelected = selectedSquare === squareName;

                    return (
                        <div
                            key={squareName}
                            onClick={() => handleSquareClick(squareName)}
                            className="w-full h-full flex items-center justify-center relative cursor-pointer"
                            style={{ backgroundColor: getSquareColor(row, col) }}
                        >
                            {isSelected && <div className="absolute inset-0 bg-yellow-300 opacity-50 mix-blend-multiply" />}

                            {piece && (
                                <span
                                    className="text-4xl md:text-6xl select-none relative z-10 transition-transform hover:scale-110 drop-shadow-md"
                                    style={{
                                        color: sq?.color === 'w' ? 'rgb(250, 250, 250)' : 'rgb(20, 20, 20)',
                                        WebkitTextStroke: '1px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    {piece}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChessBoard;