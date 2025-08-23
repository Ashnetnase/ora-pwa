import { LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-semibold">A</span>
        </div>
        <h1 className="text-xl font-semibold text-foreground">Alartd</h1>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onLogout}
        className="text-muted-foreground hover:text-foreground"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </header>
  );
}