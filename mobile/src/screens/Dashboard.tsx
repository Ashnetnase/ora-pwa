import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/theme';
import OfflineBanner from '../components/OfflineBanner';
import ErrorState from '../components/ErrorState';

// Types for the dashboard
interface CitySubscription {
  id: string;
  name: string;
  toggles: {
    quakes: boolean;
    roading: boolean;
    community: boolean;
  };
}

// Available NZ cities
const NZ_CITIES = [
  'Auckland',
  'Wellington',
  'Christchurch',
  'Hamilton',
  'Tauranga',
  'Dunedin',
];

export default function Dashboard() {
  const [subscriptions, setSubscriptions] = useState<CitySubscription[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load subscriptions from AsyncStorage on component mount
  useEffect(() => {
    loadSubscriptions();
  }, []);

  // Save subscriptions to AsyncStorage whenever they change
  useEffect(() => {
    saveSubscriptions();
  }, [subscriptions]);

  // Load subscriptions from AsyncStorage
  const loadSubscriptions = async () => {
    try {
      setHasError(false);
      const stored = await AsyncStorage.getItem('alartd_subscriptions');
      if (stored) {
        setSubscriptions(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Save subscriptions to AsyncStorage
  const saveSubscriptions = async () => {
    try {
      await AsyncStorage.setItem('alartd_subscriptions', JSON.stringify(subscriptions));
    } catch (error) {
      console.error('Failed to save subscriptions:', error);
    }
  };

  // Add a new city subscription
  const addCity = (cityName: string) => {
    // Check if city is already subscribed
    if (subscriptions.some(sub => sub.name === cityName)) {
      Alert.alert('Already Subscribed', 'You are already subscribed to this city');
      return;
    }

    const newSubscription: CitySubscription = {
      id: Date.now().toString(),
      name: cityName,
      toggles: {
        quakes: true,
        roading: true,
        community: true,
      },
    };

    setSubscriptions(prev => [...prev, newSubscription]);
    setSelectedCity('');
    setShowCitySuggestions(false);
    Alert.alert('Success', `Added ${cityName} to your alerts`);
  };

  // Remove a city subscription
  const removeCity = (id: string) => {
    const city = subscriptions.find(sub => sub.id === id);
    Alert.alert(
      'Remove City',
      `Are you sure you want to remove ${city?.name} from your alerts?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setSubscriptions(prev => prev.filter(sub => sub.id !== id));
            if (city) {
              Alert.alert('Removed', `${city.name} has been removed from your alerts`);
            }
          },
        },
      ]
    );
  };

  // Toggle alert type for a city
  const toggleAlert = (id: string, type: keyof CitySubscription['toggles']) => {
    setSubscriptions(prev =>
      prev.map(sub =>
        sub.id === id
          ? {
              ...sub,
              toggles: {
                ...sub.toggles,
                [type]: !sub.toggles[type],
              },
            }
          : sub
      )
    );
  };

  // Filter cities based on input
  const filteredCities = NZ_CITIES.filter(city =>
    city.toLowerCase().includes(selectedCity.toLowerCase()) &&
    !subscriptions.some(sub => sub.name === city)
  );

  // Render city subscription row
  const renderCityRow = ({ item }: { item: CitySubscription }) => (
    <View style={styles.cityCard}>
      <View style={styles.cityHeader}>
        <Text style={styles.cityName}>{item.name}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => removeCity(item.id)}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.togglesContainer}>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Quakes</Text>
          <Switch
            value={item.toggles.quakes}
            onValueChange={() => toggleAlert(item.id, 'quakes')}
            trackColor={{ false: '#E5E7EB', true: theme.colors.blue }}
            thumbColor={item.toggles.quakes ? 'white' : '#F3F4F6'}
          />
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Roading</Text>
          <Switch
            value={item.toggles.roading}
            onValueChange={() => toggleAlert(item.id, 'roading')}
            trackColor={{ false: '#E5E7EB', true: theme.colors.blue }}
            thumbColor={item.toggles.roading ? 'white' : '#F3F4F6'}
          />
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Community</Text>
          <Switch
            value={item.toggles.community}
            onValueChange={() => toggleAlert(item.id, 'community')}
            trackColor={{ false: '#E5E7EB', true: theme.colors.blue }}
            thumbColor={item.toggles.community ? 'white' : '#F3F4F6'}
          />
        </View>
      </View>
    </View>
  );

  // Render city suggestion
  const renderCitySuggestion = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.citySuggestion}
      onPress={() => addCity(item)}
    >
      <Text style={styles.citySuggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  if (hasError) {
    return (
      <View style={styles.container}>
        <OfflineBanner />
        <ErrorState
          icon="🏠"
          title="Failed to Load Dashboard"
          message="There was an error loading your subscriptions. Please try again."
          retryText="Retry"
          onRetry={() => {
            setHasError(false);
            setIsLoading(true);
            loadSubscriptions();
          }}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <OfflineBanner />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back! 👋</Text>
        <Text style={styles.subtitle}>
          Manage your emergency alert subscriptions for New Zealand cities
        </Text>
      </View>

      {/* Add City Section */}
      <View style={styles.addCitySection}>
        <Text style={styles.sectionTitle}>Add City</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.cityInput}
            value={selectedCity}
            onChangeText={(text) => {
              setSelectedCity(text);
              setShowCitySuggestions(text.length > 0);
            }}
            placeholder="Search for a city..."
            onFocus={() => setShowCitySuggestions(selectedCity.length > 0)}
          />
          
          {showCitySuggestions && filteredCities.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={filteredCities}
                renderItem={renderCitySuggestion}
                keyExtractor={(item) => item}
                scrollEnabled={false}
              />
            </View>
          )}
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.notificationsSection}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.notificationRow}>
          <Text style={styles.notificationLabel}>Enable push notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#E5E7EB', true: theme.colors.blue }}
            thumbColor={notificationsEnabled ? 'white' : '#F3F4F6'}
          />
        </View>
      </View>

      {/* Subscriptions Section */}
      <View style={styles.subscriptionsSection}>
        <Text style={styles.sectionTitle}>
          Your Cities ({subscriptions.length})
        </Text>
        
        {subscriptions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No cities added yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add a city above to start receiving emergency alerts
            </Text>
          </View>
        ) : (
          <FlatList
            data={subscriptions}
            renderItem={renderCityRow}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  addCitySection: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  inputContainer: {
    position: 'relative',
  },
  cityInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: theme.radius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: theme.radius,
    marginTop: 4,
    zIndex: 1000,
    elevation: 5,
  },
  citySuggestion: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  citySuggestionText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  notificationsSection: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationLabel: {
    fontSize: 16,
    color: theme.colors.text,
  },
  subscriptionsSection: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  cityCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: theme.radius,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
    fontSize: 16,
    color: theme.colors.text,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
