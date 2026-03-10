import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Chess } from 'chess.js';
import { ChevronLeft, ChevronRight, SkipBack, SkipForward, ScanEye, Flag } from 'lucide-react';

import Header from '../components/Header';
import ChessBoard from '../components/ChessBoard';
import ChatInterface from '../components/ChatInterface';

const Analysis: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const chessUrl = location.state?.chessUrl || "";

    const [game, setGame] = useState(new Chess());
    const [isThinking, setIsThinking] = useState(false);

    // Initial greeting
    const [messages, setMessages] = useState([
        { sender: "coach", text: "Welcome to Mohamed Alaraby! Fetching your game data..." }
    ]);

    const [fenHistory, setFenHistory] = useState<string[]>(["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

    const loadGameFromPgn = (pgn: string) => {
        const tempGame = new Chess();
        tempGame.loadPgn(pgn);
        const moves = tempGame.history();
        const replayGame = new Chess();
        const fens = [replayGame.fen()];

        for (const move of moves) {
            replayGame.move(move);
            fens.push(replayGame.fen());
        }

        setFenHistory(fens);
        setCurrentMoveIndex(fens.length - 1);
        setGame(tempGame);
        return tempGame;
    };

    useEffect(() => {
        if (chessUrl) {
            const fetchAndAnalyze = async () => {
                setIsThinking(true);
                try {
                    let loadedGame = null;
                    if (chessUrl.startsWith("1.") || chessUrl.includes("[Event")) {
                        loadedGame = loadGameFromPgn(chessUrl);
                        setMessages([{ sender: "coach", text: "PGN loaded! Use the controls below the board to review the match." }]);
                    } else {
                        const fetchRes = await axios.post("http://127.0.0.1:8000/fetch-chess-com", { url: chessUrl });
                        if (fetchRes.data.pgn) {
                            loadedGame = loadGameFromPgn(fetchRes.data.pgn);
                            setMessages([{ sender: "coach", text: "Game downloaded! Use the arrows below the board to navigate." }]);
                        } else {
                            setMessages([{ sender: "coach", text: `Backend says: ${fetchRes.data.error}` }]);
                        }
                    }

                    if (loadedGame) {
                        const aiRes = await axios.post("http://127.0.0.1:8000/analyze", { fen: loadedGame.fen() });
                        setMessages(prev => [...prev, aiRes.data]);
                    }
                } catch (error) {
                    setMessages([{ sender: "coach", text: "Error connecting to the AI brain. Is your Python server running?" }]);
                }
                setIsThinking(false);
            };
            fetchAndAnalyze();
        }
    }, [chessUrl]);

    // Generates the final report and navigates to the Summary page
    const generateGameReport = async () => {
        setIsThinking(true);
        setMessages(prev => [...prev, { sender: "coach", text: "Analyzing your entire game... give me a few seconds!" }]);
        try {
            const reportRes = await axios.post("http://127.0.0.1:8000/generate-report", { fens: fenHistory });
            navigate('/summary', { state: { reportData: reportRes.data } });
        } catch (e) {
            setMessages(prev => [...prev, { sender: "coach", text: "Failed to generate report." }]);
            setIsThinking(false);
        }
    };

    const goToStart = () => setCurrentMoveIndex(0);
    const goToEnd = () => setCurrentMoveIndex(fenHistory.length - 1);
    const goBack = () => setCurrentMoveIndex(prev => Math.max(0, prev - 1));
    const goForward = () => setCurrentMoveIndex(prev => Math.min(fenHistory.length - 1, prev + 1));

    // Analyzes the current position on the board
    const analyzeCurrentPosition = async () => {
        setIsThinking(true);
        try {
            const aiRes = await axios.post("http://127.0.0.1:8000/analyze", { fen: fenHistory[currentMoveIndex] });
            setMessages(prev => [...prev, aiRes.data]);
        } catch (e) {
            setMessages(prev => [...prev, { sender: "coach", text: "Could not analyze this position." }]);
        }
        setIsThinking(false);
    };

    // --- NEW: Handles the custom chat messages from the user ---
    const handleSendMessage = async (userMessage: string) => {
        setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
        setIsThinking(true);

        try {
            const res = await axios.post("http://127.0.0.1:8000/chat", {
                message: userMessage,
                fen: fenHistory[currentMoveIndex]
            });
            setMessages(prev => [...prev, { sender: "coach", text: res.data.text }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: "coach", text: "Sorry, I lost connection to the server." }]);
        }
        setIsThinking(false);
    };

    const handleMove = async (moveDetails: { sourceSquare: string, targetSquare: string }) => {
        const gameCopy = new Chess(fenHistory[currentMoveIndex]);
        try {
            const move = gameCopy.move({
                from: moveDetails.sourceSquare,
                to: moveDetails.targetSquare,
                promotion: "q",
            });

            if (move) {
                const newHistory = fenHistory.slice(0, currentMoveIndex + 1);
                newHistory.push(gameCopy.fen());
                setFenHistory(newHistory);
                setCurrentMoveIndex(newHistory.length - 1);
                setGame(gameCopy);
                setIsThinking(true);
                const aiRes = await axios.post("http://127.0.0.1:8000/analyze", { fen: gameCopy.fen() });
                setMessages(prev => [...prev, aiRes.data]);
                setIsThinking(false);
                return true;
            }
        } catch (e) { return false; }
        return false;
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header title="Mohamed Alaraby Analysis" />
            <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col">
                <div className="flex flex-col lg:flex-row w-full flex-1 gap-8 rounded-3xl overflow-hidden p-6 bg-muted/20 border border-border">

                    <div className="w-full lg:w-3/5 flex flex-col justify-center items-center h-full gap-4">
                        <div className="w-full flex items-center justify-between max-w-[800px]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-card shadow-sm border border-border flex items-center justify-center font-bold">Opp</div>
                                <span className="font-bold text-foreground">Black</span>
                            </div>
                        </div>

                        <div className="w-full aspect-square max-h-[800px] flex items-center justify-center">
                            <ChessBoard fen={fenHistory[currentMoveIndex]} onMove={handleMove} />
                        </div>

                        <div className="w-full flex items-center justify-between max-w-[800px] bg-card p-3 rounded-2xl border border-border shadow-custom mt-2">
                            <div className="flex items-center gap-2">
                                <button onClick={goToStart} disabled={currentMoveIndex === 0} className="p-2 hover:bg-muted/50 rounded-xl transition-colors disabled:opacity-30 text-foreground"><SkipBack size={20} /></button>
                                <button onClick={goBack} disabled={currentMoveIndex === 0} className="p-2 hover:bg-muted/50 rounded-xl transition-colors disabled:opacity-30 text-foreground"><ChevronLeft size={24} /></button>

                                <span className="font-mono font-bold w-24 text-center text-foreground">
                                    Move {Math.floor(currentMoveIndex / 2) + (currentMoveIndex % 2 !== 0 ? 1 : 0)}
                                </span>

                                <button onClick={goForward} disabled={currentMoveIndex === fenHistory.length - 1} className="p-2 hover:bg-muted/50 rounded-xl transition-colors disabled:opacity-30 text-foreground"><ChevronRight size={24} /></button>
                                <button onClick={goToEnd} disabled={currentMoveIndex === fenHistory.length - 1} className="p-2 hover:bg-muted/50 rounded-xl transition-colors disabled:opacity-30 text-foreground"><SkipForward size={20} /></button>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={analyzeCurrentPosition} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all text-xs">
                                    <ScanEye size={16} /> Analyze Move
                                </button>

                                <button onClick={generateGameReport} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all text-xs">
                                    <Flag size={16} /> Finish Review
                                </button>
                            </div>
                        </div>

                        <div className="w-full flex items-center justify-between max-w-[800px] mt-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground shadow-sm flex items-center justify-center font-bold">You</div>
                                <span className="font-bold text-foreground">White</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-2/5 flex flex-col h-[500px] lg:h-auto">
                        {/* --- THIS IS WHERE THE FUNCTION IS PASSED IN --- */}
                        <ChatInterface
                            messages={messages}
                            isThinking={isThinking}
                            onSendMessage={handleSendMessage}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analysis;