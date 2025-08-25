import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

interface SafetyItem {
  id: string;
  text: string;
  icon: React.ReactNode;
}

interface SafetyChecklist {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  items: SafetyItem[];
}

const safetyChecklists: SafetyChecklist[] = [
  {
    id: 'flood',
    title: 'Flood Safety',
    icon: <Ionicons name="water" size={20} color="#ffffff" />,
    color: '#2563EB',
    bgColor: '#EFF6FF',
    items: [
      {
        id: 'f1',
        text: 'Move to higher ground immediately',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
      {
        id: 'f2',
        text: 'Avoid walking or driving through flood water',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
      {
        id: 'f3',
        text: 'Turn off electricity at the main switch',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
      {
        id: 'f4',
        text: 'Have emergency supplies ready (water, food, radio)',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
      {
        id: 'f5',
        text: 'Stay informed via official emergency channels',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
      {
        id: 'f6',
        text: 'Do not return home until authorities say it\'s safe',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
    ],
  },
  {
    id: 'earthquake',
    title: 'Earthquake Safety',
    icon: <Ionicons name="flash" size={20} color="#ffffff" />,
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    items: [
      {
        id: 'e1',
        text: 'Drop, Cover, and Hold On during shaking',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
      {
        id: 'e2',
        text: 'Stay away from windows and heavy objects',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
      {
        id: 'e3',
        text: 'If outdoors, move away from buildings and power lines',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
      {
        id: 'e4',
        text: 'Check for injuries and hazards after shaking stops',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
      {
        id: 'e5',
        text: 'Be prepared for aftershocks',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
      {
        id: 'e6',
        text: 'Have a family emergency plan and meeting place',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
      {
        id: 'e7',
        text: 'Keep emergency kit stocked (3 days supplies)',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
    ],
  },
  {
    id: 'storm',
    title: 'Storm Safety',
    icon: <Ionicons name="cloudy" size={20} color="#ffffff" />,
    color: '#6B7280',
    bgColor: '#F9FAFB',
    items: [
      {
        id: 's1',
        text: 'Stay indoors and away from windows',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
      {
        id: 's2',
        text: 'Secure outdoor furniture and objects',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
      {
        id: 's3',
        text: 'Avoid using electrical appliances',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
      {
        id: 's4',
        text: 'Keep flashlights and battery radio ready',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
      {
        id: 's5',
        text: 'Monitor weather warnings and updates',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
      {
        id: 's6',
        text: 'Avoid driving unless absolutely necessary',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
      {
        id: 's7',
        text: 'Stay away from damaged power lines',
        icon: <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      },
    ],
  },
];

export default function Info() {
  const [openChecklists, setOpenChecklists] = useState<Set<string>>(new Set());

  const toggleChecklist = (id: string) => {
    setOpenChecklists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleContactPress = (contact: string) => {
    if (contact.includes('http')) {
      Linking.openURL(contact);
    } else if (contact.includes('@')) {
      Linking.openURL(`mailto:${contact}`);
    } else {
      Linking.openURL(`tel:${contact}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Safety Information</Text>
        <Text style={styles.subtitle}>
          Essential checklists for emergency preparedness
        </Text>
      </View>

      {/* Trusted Data Sources Badge */}
      <Card style={styles.trustedSourcesCard}>
        <CardContent style={styles.trustedSourcesContent}>
          <View style={styles.trustedSourcesHeader}>
            <Ionicons name="shield-checkmark" size={20} color="#2563EB" />
            <Text style={styles.trustedSourcesTitle}>Trusted Data Sources</Text>
          </View>
          <View style={styles.sourceBadges}>
            <View style={[styles.sourceBadge, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' }]}>
              <Ionicons name="pulse" size={12} color="#1D4ED8" />
              <Text style={[styles.sourceBadgeText, { color: '#1D4ED8' }]}>GeoNet NZ</Text>
            </View>
            <View style={[styles.sourceBadge, { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }]}>
              <Ionicons name="globe" size={12} color="#C2410C" />
              <Text style={[styles.sourceBadgeText, { color: '#C2410C' }]}>NZTA</Text>
            </View>
            <View style={[styles.sourceBadge, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
              <Ionicons name="cloud" size={12} color="#15803D" />
              <Text style={[styles.sourceBadgeText, { color: '#15803D' }]}>MetService</Text>
            </View>
          </View>
          <Text style={styles.trustedSourcesDescription}>
            Official New Zealand government data sources for real-time emergency information
          </Text>
        </CardContent>
      </Card>

      {/* Emergency Quick Dial */}
      <Card style={styles.emergencyQuickDialCard}>
        <CardContent style={styles.emergencyQuickDialContent}>
          <View style={styles.emergencyQuickDialHeader}>
            <Ionicons name="call" size={20} color="#EF4444" />
            <Text style={styles.emergencyQuickDialTitle}>Emergency Quick Dial</Text>
          </View>
          <TouchableOpacity 
            style={styles.emergencyCallButton}
            onPress={() => handleContactPress('111')}
            activeOpacity={0.8}
          >
            <Ionicons name="call" size={24} color="#ffffff" />
            <Text style={styles.emergencyCallButtonText}>CALL 111 NOW</Text>
          </TouchableOpacity>
          <Text style={styles.emergencyCallDescription}>
            Police • Fire • Ambulance • Emergency Services
          </Text>
          
          <View style={styles.civilDefenceContainer}>
            <TouchableOpacity 
              style={styles.civilDefenceButton}
              onPress={() => handleContactPress('https://civildefence.govt.nz')}
              activeOpacity={0.7}
            >
              <Ionicons name="shield" size={16} color="#2563EB" />
              <Text style={styles.civilDefenceButtonText}>Civil Defence Emergency Management</Text>
              <Ionicons name="open" size={12} color="#2563EB" />
            </TouchableOpacity>
          </View>
        </CardContent>
      </Card>

      {/* Safety Checklists */}
      <View style={styles.checklistsContainer}>
        {safetyChecklists.map(checklist => {
          const isOpen = openChecklists.has(checklist.id);
          
          return (
            <Card key={checklist.id} style={styles.checklistCard}>
              <TouchableOpacity
                style={styles.checklistHeader}
                onPress={() => toggleChecklist(checklist.id)}
                activeOpacity={0.7}
              >
                <View style={styles.checklistTitleContainer}>
                  <View style={[styles.checklistIconContainer, { backgroundColor: checklist.color }]}>
                    {checklist.icon}
                  </View>
                  <Text style={styles.checklistTitle}>{checklist.title}</Text>
                </View>
                <View style={styles.chevronContainer}>
                  {isOpen ? (
                    <Ionicons name="chevron-down" size={20} color="#6B7280" />
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                  )}
                </View>
              </TouchableOpacity>
              
              {isOpen && (
                <CardContent style={styles.checklistContent}>
                  <View style={styles.checklistItems}>
                    {checklist.items.map(item => (
                      <View key={item.id} style={styles.checklistItem}>
                        <View style={styles.checklistItemIcon}>
                          {item.icon}
                        </View>
                        <Text style={styles.checklistItemText}>
                          {item.text}
                        </Text>
                      </View>
                    ))}
                  </View>
                </CardContent>
              )}
            </Card>
          );
        })}
      </View>

      {/* Emergency Contacts */}
      <Card style={styles.emergencyCardWithBackground}>
        <CardHeader style={styles.emergencyHeader}>
          <CardTitle style={styles.emergencyTitle}>
            <Ionicons name="call" size={20} color="#EF4444" />
            <Text style={styles.emergencyTitleText}>Emergency Contacts</Text>
          </CardTitle>
        </CardHeader>
        <CardContent style={styles.emergencyContent}>
          <TouchableOpacity 
            style={styles.primaryEmergencyButton}
            onPress={() => handleContactPress('111')}
            activeOpacity={0.8}
          >
            <Ionicons name="call" size={20} color="#ffffff" />
            <Text style={styles.primaryEmergencyButtonText}>Emergency Services - 111</Text>
          </TouchableOpacity>
          
          <View style={styles.secondaryContactsContainer}>
            <TouchableOpacity 
              style={styles.secondaryContactButton}
              onPress={() => handleContactPress('0800438732')}
              activeOpacity={0.7}
            >
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Civil Defence</Text>
              </View>
              <Text style={[styles.contactValue, { color: '#2563EB' }]}>0800 GET READY</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryContactButton}
              onPress={() => handleContactPress('1737')}
              activeOpacity={0.7}
            >
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Crisis Helpline</Text>
              </View>
              <Text style={[styles.contactValue, { color: '#2563EB' }]}>1737</Text>
            </TouchableOpacity>
          </View>
        </CardContent>
      </Card>

      {/* Official Resources */}
      <Card style={styles.resourcesCard}>
        <CardHeader>
          <CardTitle style={styles.resourcesTitle}>
            <Ionicons name="open" size={20} color="#10B981" />
            <Text style={styles.resourcesTitleText}>Official Resources</Text>
          </CardTitle>
        </CardHeader>
        <CardContent style={styles.resourcesContent}>
          <Text style={styles.resourcesDescription}>
            Trusted New Zealand government sources for emergency information:
          </Text>
          <View style={styles.resourcesList}>
            <TouchableOpacity 
              style={styles.enhancedResourceItem}
              onPress={() => handleContactPress('https://getready.govt.nz')}
              activeOpacity={0.7}
            >
              <Ionicons name="shield-checkmark" size={16} color="#2563EB" />
              <View style={styles.resourceTextContainer}>
                <Text style={styles.resourceTitle}>Get Ready</Text>
                <Text style={styles.resourceSubtitle}>Emergency preparedness guide</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#6B7280" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.enhancedResourceItem}
              onPress={() => handleContactPress('https://civildefence.govt.nz')}
              activeOpacity={0.7}
            >
              <Ionicons name="shield" size={16} color="#1D4ED8" />
              <View style={styles.resourceTextContainer}>
                <Text style={styles.resourceTitle}>Civil Defence</Text>
                <Text style={styles.resourceSubtitle}>Emergency management</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#6B7280" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.enhancedResourceItem}
              onPress={() => handleContactPress('https://www.metservice.com/warnings/home')}
              activeOpacity={0.7}
            >
              <Ionicons name="cloud" size={16} color="#059669" />
              <View style={styles.resourceTextContainer}>
                <Text style={styles.resourceTitle}>MetService</Text>
                <Text style={styles.resourceSubtitle}>Weather warnings & forecasts</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#6B7280" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.enhancedResourceItem}
              onPress={() => handleContactPress('https://www.geonet.org.nz')}
              activeOpacity={0.7}
            >
              <Ionicons name="pulse" size={16} color="#DC2626" />
              <View style={styles.resourceTextContainer}>
                <Text style={styles.resourceTitle}>GeoNet</Text>
                <Text style={styles.resourceSubtitle}>Earthquake & volcano monitoring</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  checklistsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  checklistCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  checklistTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checklistIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checklistTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  chevronContainer: {
    padding: 4,
  },
  checklistContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 0,
  },
  checklistItems: {
    gap: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checklistItemIcon: {
    marginTop: 2,
  },
  checklistItemText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  emergencyCard: {
    margin: 16,
    borderWidth: 1,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emergencyCardWithBackground: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emergencyHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  emergencyTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emergencyTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
  },
  emergencyContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 0,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  contactSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  contactValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  contactDivider: {
    height: 1,
    backgroundColor: '#FECACA',
    marginVertical: 4,
  },
  resourcesCard: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  resourcesTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resourcesTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  resourcesContent: {
    gap: 16,
  },
  resourcesDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  resourcesList: {
    gap: 12,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  resourceText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  // New styles for trusted data sources
  trustedSourcesCard: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  trustedSourcesContent: {
    padding: 16,
    alignItems: 'center',
  },
  trustedSourcesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  trustedSourcesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
  sourceBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 12,
  },
  sourceBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  trustedSourcesDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  // Emergency Quick Dial styles
  emergencyQuickDialCard: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emergencyQuickDialContent: {
    padding: 16,
    alignItems: 'center',
  },
  emergencyQuickDialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  emergencyQuickDialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  emergencyCallButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    marginBottom: 8,
  },
  emergencyCallButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  emergencyCallDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  civilDefenceContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#FECACA',
    width: '100%',
  },
  civilDefenceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  civilDefenceButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
  },
  // Enhanced emergency contacts styles
  primaryEmergencyButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
  },
  primaryEmergencyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryContactsContainer: {
    gap: 8,
  },
  secondaryContactButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  // Enhanced resource items
  enhancedResourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  resourceTextContainer: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  resourceSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
});