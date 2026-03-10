import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CircularAccuracyRing from '../components/CircularAccuracyRing';
import MetricCard from '../components/MetricCard';
import KeyMomentCard from '../components/KeyMomentCard';
import { Swords, ArrowLeft } from 'lucide-react';

const Summary: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Catch data from Analysis page
    const report = location.state?.reportData;

    // Fallback values if data hasn't arrived yet
    const accuracy = report?.accuracy ?? 0;
    const blunders = report?.blunders ?? 0;
    const mistakes = report?.mistakes ?? 0;
    const greatMoves = report?.great_moves ?? 0;

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header title="Match Report" />

            <main className="flex-1 w-full max-w-[1440px] mx-auto p-6 md:p-8 flex flex-col items-center">

                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="self-start mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all font-medium"
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </button>

                <div className="w-full max-w-4xl flex flex-col bg-muted/10 rounded-[2.5rem] mt-6 p-8 border border-border shadow-custom relative overflow-hidden">

                    {/* 1. Accuracy Section */}
                    <div className="w-full flex flex-col items-center mb-10 relative z-10">
                        <h1 className="text-3xl font-extrabold text-foreground mb-2">
                            {accuracy > 75 ? "Excellent Game!" : "Analysis Ready"}
                        </h1>
                        <p className="text-muted-foreground mb-6">Al-Khwarizmi has finished evaluating your match.</p>
                        <CircularAccuracyRing percentage={accuracy} label="Overall Accuracy Ratio" />
                    </div>

                    {/* 2. Metrics Section (THE FIX) */}
                    {/* This grid ensures the cards show up properly with icons */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
                        <MetricCard
                            title="Blunders"
                            value={blunders}
                            color="rgb(244, 67, 54)"
                            iconName="blunder"
                        />
                        <MetricCard
                            title="Mistakes"
                            value={mistakes}
                            color="rgb(255, 193, 7)"
                            iconName="mistake"
                        />
                        <MetricCard
                            title="Great Moves"
                            value={greatMoves}
                            color="rgb(34, 197, 94)"
                            iconName="brilliant"
                        />
                    </div>

                    <div className="w-full h-[1px] bg-border my-6"></div>

                    {/* 3. Key Moments Section */}
                    <div className="w-full flex flex-col relative z-10">
                        <div className="flex items-center gap-2 mb-8">
                            <Swords className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">Key Moments</h2>
                        </div>

                        <div className="flex flex-col gap-4">
                            <KeyMomentCard
                                title="Al-Khwarizmi Analysis"
                                moveNumber={1}
                                description="The report shows your performance metrics as calculated by the engine."
                                highlightColor="rgb(0, 188, 212)"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Summary;