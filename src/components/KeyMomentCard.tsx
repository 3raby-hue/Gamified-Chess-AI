import React from 'react';

interface KeyMomentCardProps {
    title: string;
    moveNumber: number;
    description: string;
    highlightColor: string;
}

const KeyMomentCard: React.FC<KeyMomentCardProps> = ({ title, moveNumber, description, highlightColor }) => {
    return (
        <div className="flex gap-4 p-4 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer">
            {/* Left color accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: highlightColor }}></div>

            <div className="flex flex-col items-center justify-center min-w-[3rem] ml-2">
                <span className="text-xs text-muted-foreground font-bold uppercase">Move</span>
                <span className="text-2xl font-black text-foreground">{moveNumber}</span>
            </div>

            <div className="w-px bg-border my-2"></div>

            <div className="flex flex-col justify-center py-1">
                <h3 className="font-bold text-lg mb-1" style={{ color: highlightColor }}>{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

export default KeyMomentCard;