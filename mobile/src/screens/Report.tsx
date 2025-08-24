import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MapPin, Camera, Send, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

interface ReportData {
  id: string;
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  createdISO: string;
  photoUrl?: string;
}

const CATEGORIES = [
  { value: 'flood', label: 'Flood', icon: '🌊' },
  { value: 'slip', label: 'Slip', icon: '🏔️' },
  { value: 'fire', label: 'Fire', icon: '🔥' },
  { value: 'storm', label: 'Storm', icon: '⛈️' },
  { value: 'other', label: 'Other', icon: '⚠️' },
];

export default function Report() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useMyLocation, setUseMyLocation] = useState(false);

  const handleUseMyLocation = async () => {
    try {
      // Mock location for now - in real app, use expo-location
      const mockLat = -36.8485;
      const mockLng = 174.7633;
      
      setLatitude(mockLat.toString());
      setLongitude(mockLng.toString());
      setUseMyLocation(true);
      
      toast.success('Location set to your current position');
    } catch (error) {
      toast.error('Could not get your location. Please enter manually.');
      setUseMyLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !category || !latitude || !longitude) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const newReport: ReportData = {
        id: Date.now().toString(),
        title,
        description,
        category,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        createdISO: new Date().toISOString(),
        photoUrl: photoUrl || undefined,
      };

      // Read existing reports from localStorage
      const existingReports = localStorage.getItem('alartd_reports');
      const reports: ReportData[] = existingReports ? JSON.parse(existingReports) : [];
      
      // Add new report
      reports.push(newReport);
      
      // Save back to localStorage
      localStorage.setItem('alartd_reports', JSON.stringify(reports));
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setLatitude('');
      setLongitude('');
      setPhotoUrl('');
      setUseMyLocation(false);
      
      toast.success('Report saved locally');
    } catch (error) {
      toast.error('Failed to save report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = () => {
    // Mock photo upload for now
    const mockPhotoUrl = 'https://via.placeholder.com/300x200/2563EB/ffffff?text=Photo';
    setPhotoUrl(mockPhotoUrl);
    toast.success('Photo uploaded successfully');
  };

  const isFormValid = title && description && category && latitude && longitude;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Report Incident</Text>
        <Text style={styles.subtitle}>
          Help keep your community safe by reporting hazards and incidents
        </Text>
      </View>

      {/* Form */}
      <Card style={styles.formCard}>
        <CardHeader>
          <CardTitle style={styles.formTitle}>
            <AlertTriangle size={20} color="#EF4444" />
            <Text style={styles.formTitleText}>Incident Details</Text>
          </CardTitle>
        </CardHeader>
        <CardContent style={styles.formContent}>
          {/* Title */}
          <View style={styles.formField}>
            <Label style={styles.label}>Title *</Label>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Brief description of the incident"
              maxLength={100}
            />
            <Text style={styles.characterCount}>{title.length}/100</Text>
          </View>

          {/* Description */}
          <View style={styles.formField}>
            <Label style={styles.label}>Description *</Label>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Provide detailed information about what you observed"
              multiline
              numberOfLines={4}
              maxLength={280}
            />
            <Text style={styles.characterCount}>{description.length}/280</Text>
          </View>

          {/* Category */}
          <View style={styles.formField}>
            <Label style={styles.label}>Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger style={styles.selectTrigger}>
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <Text style={styles.categoryOption}>
                      {cat.icon} {cat.label}
                    </Text>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </View>

          {/* Location Section */}
          <View style={styles.locationSection}>
            <View style={styles.locationHeader}>
              <Label style={styles.label}>Location *</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUseMyLocation}
                style={styles.locationButton}
              >
                <MapPin size={16} />
                <Text style={styles.locationButtonText}>
                  {useMyLocation ? 'Location Set' : 'Use My Location'}
                </Text>
              </Button>
            </View>
            
            <View style={styles.coordinatesContainer}>
              <View style={styles.coordinateField}>
                <Label style={styles.coordinateLabel}>Latitude</Label>
                <TextInput
                  style={styles.coordinateInput}
                  value={latitude}
                  onChangeText={setLatitude}
                  placeholder="-36.8485"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.coordinateField}>
                <Label style={styles.coordinateLabel}>Longitude</Label>
                <TextInput
                  style={styles.coordinateInput}
                  value={longitude}
                  onChangeText={setLongitude}
                  placeholder="174.7633"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Photo Upload */}
          <View style={styles.formField}>
            <Label style={styles.label}>Photo (Optional)</Label>
            <TouchableOpacity
              style={styles.photoUpload}
              onPress={handlePhotoUpload}
            >
              {photoUrl ? (
                <View style={styles.photoPreview}>
                  <Text style={styles.photoPreviewText}>Photo uploaded ✓</Text>
                </View>
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Camera size={24} color="#6B7280" />
                  <Text style={styles.photoPlaceholderText}>Tap to add photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            style={!isFormValid || isSubmitting ? styles.submitButtonDisabled : styles.submitButton}
          >
            <Send size={16} />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Text>
          </Button>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card style={styles.infoCard}>
        <CardContent style={styles.infoContent}>
          <View style={styles.infoHeader}>
            <Info size={20} color="#2563EB" />
            <Text style={styles.infoTitle}>About Reporting</Text>
          </View>
          <Text style={styles.infoText}>
            Your reports help emergency services respond quickly to incidents. 
            All reports are reviewed and may be shared with relevant authorities.
          </Text>
          <Text style={styles.infoText}>
            For immediate emergencies, call 111.
          </Text>
        </CardContent>
      </Card>
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
  formCard: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  formTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  formTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  formContent: {
    padding: 16,
    gap: 20,
  },
  formField: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#111827',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  selectTrigger: {
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  categoryOption: {
    fontSize: 16,
  },
  locationSection: {
    gap: 12,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  coordinatesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  coordinateField: {
    flex: 1,
    gap: 6,
  },
  coordinateLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  coordinateInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#ffffff',
    color: '#111827',
  },
  photoUpload: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  photoPlaceholder: {
    alignItems: 'center',
    gap: 8,
  },
  photoPlaceholderText: {
    fontSize: 14,
    color: '#6B7280',
  },
  photoPreview: {
    alignItems: 'center',
  },
  photoPreviewText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  infoContent: {
    padding: 16,
    gap: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
