import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this
import Header from '../components/Header';
import GameImportCard from '../components/GameImportCard';
import RecentGamesList from '../components/RecentGamesList';
import { BrainCircuit } from 'lucide-react';

const Home: React.FC = () => {
    const navigate = useNavigate(); // Initialize navigation

    // This function will be triggered when the user clicks the blue button in GameImportCard
    const handleStartAnalysis = (url: string) => {
        // Navigate to the analysis page and pass the URL as "state"
        navigate('/analysis', { state: { chessUrl: url } });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header title="Gamified Chess AI" />

            <main className="flex-1 w-full max-w-[1440px] mx-auto flex flex-col items-center py-16 px-6 relative">
                {/* ... Background blurs ... */}

                <div className="flex flex-col items-center justify-center mb-10 text-center animate-in fade-in zoom-in duration-700">
                    {/* ... Mascot / Hero ... */}
                </div>

                <div className="w-full flex flex-col items-center gap-10">
                    {/* IMPORTANT: We pass the function to the card. 
             Now you need to go into GameImportCard.tsx and 
             make sure the button calls 'onAnalyze'
          */}
                    <GameImportCard onAnalyze={handleStartAnalysis} />
                    <RecentGamesList />
                </div>
            </main>
        </div>
    );
};

export default Home;