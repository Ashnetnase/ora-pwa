import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';

interface CitySubscription {
  id: string;
  name: string;
  quakes: boolean;
  roading: boolean;
  community: boolean;
}

interface DashboardProps {
  userName: string;
  subscriptions: CitySubscription[];
  setSubscriptions: React.Dispatch<React.SetStateAction<CitySubscription[]>>;
}

const NZ_CITIES = [
  'Auckland',
  'Wellington',
  'Christchurch',
  'Hamilton',
  'Tauranga',
  'Dunedin',
  'Palmerston North',
  'Napier',
  'Nelson',
  'Rotorua',
];

export function Dashboard({ userName, subscriptions, setSubscriptions }: DashboardProps) {
  const [selectedCity, setSelectedCity] = useState<string>('');

  // Save subscriptions to localStorage whenever they change
  useEffect(() => {
    if (subscriptions.length >= 0) {
      localStorage.setItem('alartd_subscriptions', JSON.stringify(subscriptions));
    }
  }, [subscriptions]);

  const addCity = () => {
    if (!selectedCity) return;
    
    // Check if city is already subscribed
    if (subscriptions.some(sub => sub.name === selectedCity)) {
      toast.error('Already subscribed to this city');
      return;
    }

    const newSubscription: CitySubscription = {
      id: Date.now().toString(),
      name: selectedCity,
      quakes: true,
      roading: true,
      community: true,
    };

    setSubscriptions(prev => [...prev, newSubscription]);
    setSelectedCity('');
    toast.success(`Added ${selectedCity} to your alerts`);
  };

  const removeCity = (id: string) => {
    const city = subscriptions.find(sub => sub.id === id);
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    if (city) {
      toast.success(`Removed ${city.name} from your alerts`);
    }
  };

  const toggleAlert = (id: string, type: 'quakes' | 'roading' | 'community') => {
    setSubscriptions(prev => 
      prev.map(sub => 
        sub.id === id ? { ...sub, [type]: !sub[type] } : sub
      )
    );
  };

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Welcome back, {userName}! 👋
        </h1>
        <p className="text-muted-foreground">
          Manage your emergency alert subscriptions for New Zealand cities
        </p>
      </div>

      {/* Add City Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add City Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a New Zealand city" />
                </SelectTrigger>
                <SelectContent>
                  {NZ_CITIES.filter(city => 
                    !subscriptions.some(sub => sub.name === city)
                  ).map(city => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addCity} disabled={!selectedCity}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Subscriptions */}
      <div>
        <h2 className="text-lg font-medium text-foreground mb-4">
          Your Alert Subscriptions ({subscriptions.length})
        </h2>
        
        {subscriptions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No city subscriptions yet</p>
              <p className="text-sm">Add a city above to start receiving alerts</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {subscriptions.map(subscription => (
              <Card key={subscription.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-foreground">
                      {subscription.name}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCity(subscription.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">Earthquake Alerts</span>
                      </div>
                      <Switch
                        checked={subscription.quakes}
                        onCheckedChange={() => toggleAlert(subscription.id, 'quakes')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-warning rounded-full"></div>
                        <span className="text-sm">Roading Alerts</span>
                      </div>
                      <Switch
                        checked={subscription.roading}
                        onCheckedChange={() => toggleAlert(subscription.id, 'roading')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span className="text-sm">Community Alerts</span>
                      </div>
                      <Switch
                        checked={subscription.community}
                        onCheckedChange={() => toggleAlert(subscription.id, 'community')}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}