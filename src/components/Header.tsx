import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Crown, BarChart2, MessageSquare } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "AI Chess Coach" }) => {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? "flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold shadow-custom transition-all"
      : "flex items-center gap-2 px-4 py-2 rounded-full text-muted-foreground hover:bg-muted font-medium transition-all";
  };

  return (
    <header data-cmp="Header" className="w-full bg-card border-b border-border shadow-custom z-10 p-4">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-custom">
            <Crown size={24} />
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">{title}</h1>
        </div>
        <nav className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-full border border-border">
          <Link to="/" className={getLinkClass("/")}>
            <Crown size={18} />
            <span className="hidden sm:inline">Import</span>
          </Link>
          <Link to="/analysis" className={getLinkClass("/analysis")}>
            <MessageSquare size={18} />
            <span className="hidden sm:inline">Analysis</span>
          </Link>
          <Link to="/summary" className={getLinkClass("/summary")}>
            <BarChart2 size={18} />
            <span className="hidden sm:inline">Summary</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;