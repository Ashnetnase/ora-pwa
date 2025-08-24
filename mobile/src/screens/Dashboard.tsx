import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Plus, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import { Toggle } from '../components/ui/toggle';
import { ToggleGroup } from '../components/ui/toggle-group';
import { toast } from 'sonner';

interface CitySubscription {
  id: string;
  name: string;
  quakes: boolean;
  roading: boolean;
  community: boolean;
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

export default function Dashboard() {
  const [userName] = useState('User');
  const [subscriptions, setSubscriptions] = useState<CitySubscription[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  
  // New UI component states
  const [alertRadius, setAlertRadius] = useState(50);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedAlertTypes, setSelectedAlertTypes] = useState<string[]>(['emergency']);
  const [quickToggle, setQuickToggle] = useState(false);

  // Load subscriptions from localStorage on mount
  useEffect(() => {
    const savedSubscriptions = localStorage.getItem('alartd_subscriptions');
    if (savedSubscriptions) {
      setSubscriptions(JSON.parse(savedSubscriptions));
    }
  }, []);

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
    <ScrollView style={styles.container}>
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Welcome back, {userName}! 👋
        </Text>
        <Text style={styles.subtitle}>
          Manage your emergency alert subscriptions for New Zealand cities
        </Text>
      </View>

      {/* Alert Settings Section */}
      <Card style={styles.addCityCard}>
        <CardHeader>
          <CardTitle style={styles.cardTitle}>
            <Text style={styles.cardTitleText}>Alert Settings</Text>
          </CardTitle>
        </CardHeader>
        <CardContent style={styles.cardContent}>
          {/* Alert Radius Slider */}
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Alert Radius: {alertRadius}km</Text>
            <Slider
              value={alertRadius}
              onValueChange={setAlertRadius}
              min={5}
              max={200}
              step={5}
              style={styles.slider}
              minimumTrackTintColor="#2563EB"
              maximumTrackTintColor="#E5E7EB"
            />
          </View>

          {/* Notifications Toggle */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>

          {/* Alert Types Toggle Group */}
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Alert Types</Text>
            <ToggleGroup
              type="multiple"
              value={selectedAlertTypes}
              onValueChange={(value) => setSelectedAlertTypes(value as string[])}
              items={[
                { value: 'emergency', label: 'Emergency', icon: 'warning' },
                { value: 'weather', label: 'Weather', icon: 'cloud' },
                { value: 'traffic', label: 'Traffic', icon: 'traffic' },
              ]}
              style={styles.toggleGroup}
            />
          </View>

          {/* Quick Toggle Example */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Do Not Disturb</Text>
            <Toggle
              pressed={quickToggle}
              onPress={() => setQuickToggle(!quickToggle)}
              icon="do-not-disturb"
              variant="outline"
            />
          </View>
        </CardContent>
      </Card>

      {/* Add City Section */}
      <Card style={styles.addCityCard}>
        <CardHeader>
          <CardTitle style={styles.cardTitle}>
            <Plus size={20} color="#2563EB" />
            <Text style={styles.cardTitleText}>Add City Alerts</Text>
          </CardTitle>
        </CardHeader>
        <CardContent style={styles.cardContent}>
          <View style={styles.addCitySection}>
            <View style={styles.selectContainer}>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger style={styles.selectTrigger}>
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
            </View>
            <Button 
              onClick={addCity}
              disabled={!selectedCity}
              style={!selectedCity ? styles.addButtonDisabled : styles.addButton}
            >
              <Plus size={16} />
              <Text style={styles.addButtonText}>Add</Text>
            </Button>
          </View>
        </CardContent>
      </Card>

      {/* Active Subscriptions */}
      <View style={styles.subscriptionsSection}>
        <Text style={styles.sectionTitle}>
          Your Alert Subscriptions ({subscriptions.length})
        </Text>
        
        {subscriptions.length === 0 ? (
          <Card style={styles.emptyCard}>
            <CardContent style={styles.emptyCardContent}>
              <Plus size={48} color="#6B7280" style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>No city subscriptions yet</Text>
              <Text style={styles.emptySubtitle}>Add a city above to start receiving alerts</Text>
            </CardContent>
          </Card>
        ) : (
          <View style={styles.subscriptionsList}>
            {subscriptions.map(subscription => (
              <Card key={subscription.id} style={styles.subscriptionCard}>
                <CardContent style={styles.subscriptionCardContent}>
                  <View style={styles.subscriptionHeader}>
                    <Text style={styles.cityName}>
                      {subscription.name}
                    </Text>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCity(subscription.id)}
                      style={styles.removeButton}
                    >
                      <X size={16} color="#EF4444" />
                    </Button>
                  </View>
                  
                  <View style={styles.togglesContainer}>
                    <View style={styles.toggleRow}>
                      <View style={styles.toggleLabel}>
                        <View style={[styles.indicator, styles.primaryIndicator]} />
                        <Text style={styles.toggleText}>Earthquake Alerts</Text>
                      </View>
                      <Switch
                        value={subscription.quakes}
                        onValueChange={() => toggleAlert(subscription.id, 'quakes')}
                      />
                    </View>
                    
                    <View style={styles.toggleRow}>
                      <View style={styles.toggleLabel}>
                        <View style={[styles.indicator, styles.warningIndicator]} />
                        <Text style={styles.toggleText}>Roading Alerts</Text>
                      </View>
                      <Switch
                        value={subscription.roading}
                        onValueChange={() => toggleAlert(subscription.id, 'roading')}
                      />
                    </View>
                    
                    <View style={styles.toggleRow}>
                      <View style={styles.toggleLabel}>
                        <View style={[styles.indicator, styles.accentIndicator]} />
                        <Text style={styles.toggleText}>Community Alerts</Text>
                      </View>
                      <Switch
                        value={subscription.community}
                        onValueChange={() => toggleAlert(subscription.id, 'community')}
                      />
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  addCityCard: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  cardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  cardContent: {
    padding: 16,
  },
  addCitySection: {
    flexDirection: 'row',
    gap: 12,
  },
  selectContainer: {
    flex: 1,
  },
  selectTrigger: {
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB', // Light gray background for better visibility
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  addButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  subscriptionsSection: {
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
  },
  emptyCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  emptyCardContent: {
    padding: 24,
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  subscriptionsList: {
    gap: 12,
  },
  subscriptionCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  subscriptionCardContent: {
    padding: 16,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2', // Light red background
    borderWidth: 1,
    borderColor: '#FECACA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  togglesContainer: {
    gap: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  primaryIndicator: {
    backgroundColor: '#2563EB',
  },
  warningIndicator: {
    backgroundColor: '#F59E0B',
  },
  accentIndicator: {
    backgroundColor: '#10B981',
  },
  toggleText: {
    fontSize: 14,
    color: '#374151',
  },
  // New UI component styles
  settingItem: {
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  toggleGroup: {
    marginTop: 8,
  },
});