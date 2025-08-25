import { useState, useEffect } from 'react';
import { Plus, X, MapPin, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';
import { NZRegionService, NZRegion } from '../services/nzRegions';

interface CitySubscription {
  id: string;
  name: string;
  type: 'city' | 'region';
  region?: string;
  quakes: boolean;
  roading: boolean;
  community: boolean;
}

interface DashboardProps {
  userName: string;
  subscriptions: CitySubscription[];
  setSubscriptions: React.Dispatch<React.SetStateAction<CitySubscription[]>>;
}

export function Dashboard({ userName, subscriptions, setSubscriptions }: DashboardProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
  const [regions] = useState<NZRegion[]>(NZRegionService.getAllRegions());

  // Save subscriptions to localStorage whenever they change
  useEffect(() => {
    if (subscriptions.length >= 0) {
      localStorage.setItem('alartd_subscriptions', JSON.stringify(subscriptions));
    }
  }, [subscriptions]);

  const addLocation = () => {
    if (!selectedLocation) return;
    
    // Parse the selection (format: "type:name" or "type:name:region")
    const parts = selectedLocation.split(':');
    const type = parts[0] as 'city' | 'region';
    const name = parts[1];
    const regionName = parts[2];
    
    // Check if already subscribed
    if (subscriptions.some(sub => sub.name === name && sub.type === type)) {
      toast.error(`Already subscribed to this ${type}`);
      return;
    }

    const newSubscription: CitySubscription = {
      id: Date.now().toString(),
      name: name,
      type: type,
      region: type === 'region' ? name : regionName,
      quakes: true,
      roading: true,
      community: true,
    };

    setSubscriptions(prev => [...prev, newSubscription]);
    setSelectedLocation('');
    toast.success(`Added ${name} to your alerts`);
  };

  const addLocationDirectly = (locationKey: string) => {
    // Parse the selection (format: "type:name" or "type:name:region")
    const parts = locationKey.split(':');
    const type = parts[0] as 'city' | 'region';
    const name = parts[1];
    const regionName = parts[2];
    
    // Check if already subscribed
    if (subscriptions.some(sub => sub.name === name && sub.type === type)) {
      toast.error(`Already subscribed to this ${type}`);
      return;
    }

    const newSubscription: CitySubscription = {
      id: Date.now().toString(),
      name: name,
      type: type,
      region: type === 'region' ? name : regionName,
      quakes: true,
      roading: true,
      community: true,
    };

    setSubscriptions(prev => [...prev, newSubscription]);
    setSelectedLocation(''); // Clear dropdown selection
    toast.success(`Added ${name} to your alerts`);
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
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select a New Zealand location" />
                </SelectTrigger>
                <SelectContent className="max-h-[400px] w-[450px] z-[1000]">
                  {regions.map(region => {
                    const isRegionSubscribed = subscriptions.some(sub => 
                      sub.name === region.name && sub.type === 'region'
                    );
                    
                    return (
                      <div key={region.name} className="border-b border-muted/30 last:border-b-0">
                        {/* Region Row with Add Region Button */}
                        <div className="flex items-center justify-between p-3 hover:bg-muted/30 min-h-[50px]">
                          <button
                            className="flex items-center gap-3 flex-1 text-left"
                            onClick={() => {
                              setExpandedRegions(prev => {
                                const newSet = new Set(prev);
                                if (newSet.has(region.name)) {
                                  newSet.delete(region.name);
                                } else {
                                  newSet.add(region.name);
                                }
                                return newSet;
                              });
                            }}
                          >
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{region.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({region.cities.length} cities)
                              </span>
                            </div>
                            {expandedRegions.has(region.name) ? (
                              <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                            )}
                          </button>
                          
                          <Button
                            size="sm"
                            disabled={isRegionSubscribed}
                            className="h-7 px-3 text-xs font-medium"
                            style={{
                              backgroundColor: isRegionSubscribed ? '#d1d5db' : '#2563eb',
                              color: 'white',
                              border: 'none',
                              fontSize: '0.75rem',
                              opacity: 1,
                              cursor: isRegionSubscribed ? 'not-allowed' : 'pointer'
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!isRegionSubscribed) {
                                const regionKey = `region:${region.name}`;
                                addLocationDirectly(regionKey);
                              }
                            }}
                          >
                            {isRegionSubscribed ? 'Added' : 'Add Region'}
                          </Button>
                        </div>
                        
                        {/* Cities List - Conditionally Shown */}
                        {expandedRegions.has(region.name) && (
                          <div className="pl-10 pr-3 pb-3 space-y-1">
                            {region.cities
                              .filter(city => !subscriptions.some(sub => 
                                sub.name === city.name && sub.type === 'city'
                              ))
                              .map(city => {
                                const cityKey = `city:${city.name}:${region.name}`;
                                return (
                                  <SelectItem 
                                    key={cityKey} 
                                    value={cityKey}
                                    className="h-8 text-sm hover:bg-muted/50"
                                  >
                                    <div className="flex items-center gap-2 w-full">
                                      <span>{city.name}</span>
                                      {city.isMain && (
                                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                          Main
                                        </span>
                                      )}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={addLocation} 
              disabled={!selectedLocation}
              className="h-10 px-6 flex-shrink-0 text-white font-semibold border-none"
              style={{
                backgroundColor: !selectedLocation ? '#9ca3af' : '#2563eb',
                color: 'white',
                border: 'none',
                opacity: 1,
                cursor: !selectedLocation ? 'not-allowed' : 'pointer'
              }}
            >
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
                    <div>
                      <h3 className="font-medium text-foreground flex items-center gap-2">
                        {subscription.type === 'region' ? (
                          <MapPin className="w-4 h-4 text-primary" />
                        ) : (
                          <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                        )}
                        {subscription.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {subscription.type === 'region' ? (
                          `Entire ${subscription.name} region`
                        ) : (
                          `City in ${subscription.region || 'Unknown region'}`
                        )}
                      </p>
                    </div>
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