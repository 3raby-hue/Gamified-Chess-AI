import React from 'react';
import { Trophy, XCircle, Clock } from 'lucide-react';

interface RecentGamesListProps {
  title?: string;
}

const RecentGamesList: React.FC<RecentGamesListProps> = ({ title = "Recent Games" }) => {
  const games = [
    { id: '1', opponent: 'Magnus C.', result: 'win', date: '2 hrs ago', type: 'Blitz' },
    { id: '2', opponent: 'Hikaru N.', result: 'loss', date: 'Yesterday', type: 'Rapid' },
    { id: '3', opponent: 'Fabiano C.', result: 'win', date: 'Aug 24', type: 'Bullet' },
  ];

  return (
    <div data-cmp="RecentGamesList" className="w-full mt-12 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6 px-4">
        <Clock className="text-muted-foreground" size={20} />
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
      </div>
      
      <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4 px-4 snap-x">
        {games.map((game) => (
          <div 
            key={game.id} 
            className="flex-shrink-0 w-64 bg-card rounded-2xl p-5 shadow-custom border border-border flex items-center justify-between snap-center hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-muted-foreground">{game.type}</span>
              <span className="text-lg font-bold text-foreground">{game.opponent}</span>
              <span className="text-sm text-muted-foreground">{game.date}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl" style={{ backgroundColor: game.result === 'win' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
              {game.result === 'win' ? (
                <Trophy size={28} style={{ color: 'rgb(34, 197, 94)' }} />
              ) : (
                <XCircle size={28} style={{ color: 'rgb(239, 68, 68)' }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentGamesList;