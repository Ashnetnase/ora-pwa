import { Home, Map, Car, Cloud, FileText, Info } from 'lucide-react';

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: 'home' | 'map' | 'roads' | 'weather' | 'report' | 'info') => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'map', icon: Map, label: 'Map' },
    { id: 'roads', icon: Car, label: 'Roads' },
    { id: 'weather', icon: Cloud, label: 'Weather' },
    { id: 'info', icon: Info, label: 'Info' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-border">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ id, icon: Icon, label }) => {
          const isActive = currentScreen === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-xs">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}