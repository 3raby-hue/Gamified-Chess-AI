import React from 'react';
import { XOctagon, AlertTriangle, Sparkles } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: number;
    color: string;
    iconName: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, color, iconName }) => {
    // Logic to select the correct icon based on the prop
    const getIcon = () => {
        switch (iconName) {
            case 'blunder':
                return <XOctagon size={28} color={color} />;
            case 'mistake':
                return <AlertTriangle size={28} color={color} />;
            case 'brilliant':
            case 'great_moves': // Handling both naming conventions
                return <Sparkles size={28} color={color} />;
            default:
                return <Sparkles size={28} color={color} />;
        }
    };

    return (
        <div
            className="rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border bg-card transition-all hover:shadow-md"
            style={{ borderColor: `${color}40` }} // 40 = 25% opacity for a subtle colored border
        >
            {/* Icon Container with a subtle background circle */}
            <div
                className="mb-4 p-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${color}15` }} // 15 = roughly 8% opacity
            >
                {getIcon()}
            </div>

            {/* The actual number value */}
            <span className="text-4xl font-black text-foreground mb-1 tabular-nums">
                {value}
            </span>

            {/* The label (BLUNDERS, MISTAKES, etc.) */}
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.15em]">
                {title}
            </span>
        </div>
    );
};

export default MetricCard;