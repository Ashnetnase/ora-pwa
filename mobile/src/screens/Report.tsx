import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/theme';
import OfflineBanner from '../components/OfflineBanner';
import ErrorState from '../components/ErrorState';

// Types for the report
interface ReportData {
  id: string;
  title: string;
  description: string;
  category: string;
  lat: number;
  lon: number;
  createdISO: string;
}

// Category options
const categories = ['Flood', 'Slip', 'Other'];

export default function Report() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const characterLimit = 280;
  const remainingChars = characterLimit - description.length;

  // Get current location
  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Denied',
          'Please enable location access or enter coordinates manually.',
          [{ text: 'OK' }]
        );
        setIsGettingLocation(false);
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLat(location.coords.latitude);
      setLon(location.coords.longitude);
      
      Alert.alert('Success', 'Location captured successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to get location. Please enter coordinates manually.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!lat || !lon) {
      Alert.alert('Error', 'Please provide location coordinates');
      return;
    }

    setIsSubmitting(true);
    setHasError(false);

    try {
      // Read existing reports from AsyncStorage
      const existingReportsJson = await AsyncStorage.getItem('alartd_reports');
      const existingReports: ReportData[] = existingReportsJson 
        ? JSON.parse(existingReportsJson) 
        : [];

      // Create new report
      const newReport: ReportData = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        category,
        lat,
        lon,
        createdISO: new Date().toISOString(),
      };

      // Append new report and save back to AsyncStorage
      const updatedReports = [...existingReports, newReport];
      await AsyncStorage.setItem('alartd_reports', JSON.stringify(updatedReports));

      // Show success message
      Alert.alert('Success', 'Report saved locally', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form but keep location
            setTitle('');
            setDescription('');
            setCategory('');
            // Keep lat/lon for convenience
          }
        }
      ]);

    } catch (error) {
      console.error('Failed to save report:', error);
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render category button
  const renderCategoryButton = (cat: string) => (
    <TouchableOpacity
      key={cat}
      style={[
        styles.categoryButton,
        category === cat && styles.categoryButtonActive,
      ]}
      onPress={() => setCategory(cat)}
    >
      <Text style={[
        styles.categoryButtonText,
        category === cat && styles.categoryButtonTextActive,
      ]}>
        {cat}
      </Text>
    </TouchableOpacity>
  );

  if (hasError) {
    return (
      <View style={styles.container}>
        <OfflineBanner />
        <ErrorState
          icon="📝"
          title="Failed to Submit Report"
          message="There was an error saving your report. Please try again."
          retryText="Retry"
          onRetry={() => {
            setHasError(false);
            handleSubmit();
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
        <Text style={styles.title}>Report Incident</Text>
        <Text style={styles.subtitle}>Help keep the community informed</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Title Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Brief description of the incident"
            maxLength={100}
          />
        </View>

        {/* Description Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Provide more details about the incident..."
            multiline
            numberOfLines={4}
            maxLength={characterLimit}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>
            {remainingChars} characters remaining
          </Text>
        </View>

        {/* Category Selection */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.categoryContainer}>
            {categories.map(renderCategoryButton)}
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Location</Text>
          
          {/* Use My Location Button */}
          <TouchableOpacity
            style={styles.locationButton}
            onPress={getCurrentLocation}
            disabled={isGettingLocation}
          >
            {isGettingLocation ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.locationButtonText}>Use My Location</Text>
            )}
          </TouchableOpacity>

          {/* Manual Coordinates */}
          <View style={styles.coordinatesContainer}>
            <View style={styles.coordinateField}>
              <Text style={styles.coordinateLabel}>Latitude</Text>
              <TextInput
                style={styles.coordinateInput}
                value={lat?.toString() || ''}
                onChangeText={(text) => setLat(parseFloat(text) || null)}
                placeholder="-36.8485"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.coordinateField}>
              <Text style={styles.coordinateLabel}>Longitude</Text>
              <TextInput
                style={styles.coordinateInput}
                value={lon?.toString() || ''}
                onChangeText={(text) => setLon(parseFloat(text) || null)}
                placeholder="174.7633"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!title.trim() || !description.trim() || !category || !lat || !lon) &&
            styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting || !title.trim() || !description.trim() || !category || !lat || !lon}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Report</Text>
          )}
        </TouchableOpacity>
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
  form: {
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: theme.radius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: theme.radius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.radius,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.blue,
    borderColor: theme.colors.blue,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  locationButton: {
    backgroundColor: theme.colors.green,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.radius,
    alignItems: 'center',
    marginBottom: 16,
  },
  locationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  coordinatesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  coordinateField: {
    flex: 1,
  },
  coordinateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  coordinateInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: theme.radius,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: theme.colors.blue,
    paddingVertical: 16,
    borderRadius: theme.radius,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
