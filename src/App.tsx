import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { MapScreen } from './components/MapScreen';
import { RoadsScreen } from './components/RoadsScreen';
import { ReportScreen } from './components/ReportScreen';
import { InfoScreen } from './components/InfoScreen';
import { WeatherScreen } from './components/WeatherScreen';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './contexts/ThemeContext';

type Screen = 'login' | 'home' | 'map' | 'roads' | 'weather' | 'report' | 'info';

interface CitySubscription {
  id: string;
  name: string;
  type: 'city' | 'region';
  region?: string;
  quakes: boolean;
  roading: boolean;
  community: boolean;
  weather: boolean;
}

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [subscriptions, setSubscriptions] = useState<CitySubscription[]>([]);

  // Check for stored authentication on app load
  useEffect(() => {
    const storedAuth = localStorage.getItem('alartd_auth');
    const storedUser = localStorage.getItem('alartd_user');
    if (storedAuth === 'true' && storedUser) {
      setIsAuthenticated(true);
      setUserName(storedUser);
      setCurrentScreen('home');
    }
  }, []);

  // Load subscriptions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('alartd_subscriptions');
    if (stored) {
      try {
        setSubscriptions(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored subscriptions');
      }
    }
  }, []);

  const handleLogin = (email: string) => {
    // Mock authentication - extract name from email
    let name = email.split('@')[0];
    
    // Handle social login providers with better user names
    if (email.includes('@gmail.com')) {
      name = name + ' (Google)';
    } else if (email.includes('@facebook.com')) {
      name = name + ' (Facebook)';
    } else if (email.includes('@privaterelay.appleid.com')) {
      name = 'User (Apple)';
    }
    
    setUserName(name);
    setIsAuthenticated(true);
    setCurrentScreen('home');
    
    // Store authentication state
    localStorage.setItem('alartd_auth', 'true');
    localStorage.setItem('alartd_user', name);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName('');
    setCurrentScreen('login');
    localStorage.removeItem('alartd_auth');
    localStorage.removeItem('alartd_user');
  };

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return (
      <div className="mobile-container">
        <LoginScreen onLogin={handleLogin} />
      </div>
    );
  }

  // Render authenticated app screens
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Dashboard userName={userName} subscriptions={subscriptions} setSubscriptions={setSubscriptions} />;
      case 'map':
        return <MapScreen subscriptions={subscriptions} />;
      case 'roads':
        return <RoadsScreen subscriptions={subscriptions} />;
      case 'weather':
        return <WeatherScreen subscriptions={subscriptions} />;
      case 'report':
        return <ReportScreen />;
      case 'info':
        return <InfoScreen />;
      default:
        return <Dashboard userName={userName} subscriptions={subscriptions} setSubscriptions={setSubscriptions} />;
    }
  };

  return (
    <div className="mobile-container">
      <Header onLogout={handleLogout} />
      <main className="flex-1 pb-20">
        {renderScreen()}
      </main>
      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}