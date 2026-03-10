import React, { useState } from "react";
import { LayoutTemplate } from "lucide-react";

type GameImportCardProps = {
    onAnalyze: (url: string) => void;
    placeholder?: string;
    buttonText?: string;
};

const GameImportCard: React.FC<GameImportCardProps> = ({
    onAnalyze,
    placeholder = "Paste PGN or Game Link here...",
    buttonText = "Analyze My Game",
}) => {
    const [url, setUrl] = useState("");

    const handleButtonClick = () => {
        onAnalyze(url);
    };

    return (
        <div className="flex flex-col gap-4 w-full max-w-md">
            <input
                type="text"
                placeholder={placeholder}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="border p-3 rounded-lg"
            />

            <button
                onClick={handleButtonClick}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg"
            >
                <LayoutTemplate size={20} />
                {buttonText}
            </button>
        </div>
    );
};

export default GameImportCard;