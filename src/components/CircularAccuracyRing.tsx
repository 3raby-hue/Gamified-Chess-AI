import React, { useEffect, useState } from 'react';

interface CircularAccuracyRingProps {
    percentage: number;
    label: string;
}

const CircularAccuracyRing: React.FC<CircularAccuracyRingProps> = ({ percentage, label }) => {
    const [current, setCurrent] = useState(0);
    const radius = 70;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        // We wait 300ms to let the page load, then slide the ring to the target %
        const timer = setTimeout(() => {
            setCurrent(percentage);
        }, 300);
        return () => clearTimeout(timer);
    }, [percentage]);

    const offset = circumference - (current / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center">
                <svg width="180" height="180" className="transform -rotate-90">
                    <circle cx="90" cy="90" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-muted/20" />
                    <circle
                        cx="90" cy="90" r={radius}
                        stroke="#22c55e"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <span className="absolute text-5xl font-black">{current}%</span>
            </div>
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-4">{label}</span>
        </div>
    );
};

export default CircularAccuracyRing;