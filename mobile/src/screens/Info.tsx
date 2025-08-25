import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

interface SafetyItem {
  id: string;
  text: string;
  icon: React.ReactNode;
  category?: string;
}

interface SafetyChecklist {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  items: SafetyItem[];
}

const safetyChecklists: SafetyChecklist[] = [
  {
    id: 'earthquake-prep',
    title: 'Earthquake Preparedness',
    subtitle: 'Complete preparation guide for earthquake events',
    icon: <Ionicons name="flash" size={20} color="#ffffff" />,
    color: '#EA580C',
    bgColor: '#FFF7ED',
    items: [
      // Emergency Kit Items
      {
        id: 'eq1',
        text: 'Water: 3 litres per person per day for 3 days minimum',
        icon: <Ionicons name="water" size={16} color="#2563EB" />,
        category: 'Emergency Kit'
      },
      {
        id: 'eq2',
        text: 'Non-perishable food for 3+ days (canned goods, energy bars)',
        icon: <Ionicons name="bag" size={16} color="#059669" />,
        category: 'Emergency Kit'
      },
      {
        id: 'eq3',
        text: 'Battery-powered or hand-crank radio and weather radio',
        icon: <Ionicons name="radio" size={16} color="#7C3AED" />,
        category: 'Emergency Kit'
      },
      {
        id: 'eq4',
        text: 'Flashlight and extra batteries for each family member',
        icon: <Ionicons name="flashlight" size={16} color="#FBBF24" />,
        category: 'Emergency Kit'
      },
      {
        id: 'eq5',
        text: 'First aid kit with medications and prescription drugs',
        icon: <Ionicons name="medical" size={16} color="#DC2626" />,
        category: 'Emergency Kit'
      },
      // Home Preparation
      {
        id: 'eq6',
        text: 'Secure heavy furniture and appliances to walls',
        icon: <Ionicons name="home" size={16} color="#92400E" />,
        category: 'Home Safety'
      },
      {
        id: 'eq7',
        text: 'Install latches on cabinet doors to prevent contents from falling',
        icon: <Ionicons name="warning" size={16} color="#EA580C" />,
        category: 'Home Safety'
      },
      {
        id: 'eq8',
        text: 'Locate safe spots in each room (under sturdy tables, away from glass)',
        icon: <Ionicons name="shield-checkmark" size={16} color="#2563EB" />,
        category: 'Home Safety'
      },
      // Family Planning
      {
        id: 'eq9',
        text: 'Create family emergency plan with meeting points and contacts',
        icon: <Ionicons name="people" size={16} color="#059669" />,
        category: 'Family Plan'
      },
      {
        id: 'eq10',
        text: 'Identify out-of-state contact person for family coordination',
        icon: <Ionicons name="call" size={16} color="#2563EB" />,
        category: 'Family Plan'
      },
      {
        id: 'eq11',
        text: 'Practice Drop, Cover, and Hold On drills regularly',
        icon: <Ionicons name="checkmark-circle" size={16} color="#059669" />,
        category: 'Family Plan'
      },
      // During Earthquake Actions
      {
        id: 'eq12',
        text: 'DROP immediately onto hands and knees',
        icon: <Ionicons name="alert" size={16} color="#DC2626" />,
        category: 'During Event'
      },
      {
        id: 'eq13',
        text: 'COVER head and neck under sturdy table or against interior wall',
        icon: <Ionicons name="shield" size={16} color="#2563EB" />,
        category: 'During Event'
      },
      {
        id: 'eq14',
        text: 'HOLD ON to shelter and be prepared to move with it',
        icon: <Ionicons name="hand-left" size={16} color="#EA580C" />,
        category: 'During Event'
      }
    ],
  },
  {
    id: 'flood-prep',
    title: 'Flood Preparedness',
    subtitle: 'Comprehensive flood safety and preparation guide',
    icon: <Ionicons name="water" size={20} color="#ffffff" />,
    color: '#1D4ED8',
    bgColor: '#EFF6FF',
    items: [
      // Pre-Flood Preparation
      {
        id: 'fl1',
        text: 'Know your flood risk zone and evacuation routes',
        icon: <Ionicons name="location" size={16} color="#2563EB" />,
        category: 'Preparation'
      },
      {
        id: 'fl2',
        text: 'Keep sandbags, plastic sheeting, and lumber for emergency protection',
        icon: <Ionicons name="bag" size={16} color="#92400E" />,
        category: 'Preparation'
      },
      {
        id: 'fl3',
        text: 'Install sump pump and backup power source',
        icon: <Ionicons name="battery-charging" size={16} color="#059669" />,
        category: 'Preparation'
      },
      {
        id: 'fl4',
        text: 'Keep important documents in waterproof container',
        icon: <Ionicons name="shield-checkmark" size={16} color="#2563EB" />,
        category: 'Preparation'
      },
      // During Flood
      {
        id: 'fl5',
        text: 'Move to higher ground immediately when warned',
        icon: <Ionicons name="alert" size={16} color="#DC2626" />,
        category: 'During Flood'
      },
      {
        id: 'fl6',
        text: 'Never walk, swim, or drive through flood waters',
        icon: <Ionicons name="car" size={16} color="#DC2626" />,
        category: 'During Flood'
      },
      {
        id: 'fl7',
        text: 'Turn off utilities at main switches if time permits',
        icon: <Ionicons name="flash" size={16} color="#FBBF24" />,
        category: 'During Flood'
      },
      {
        id: 'fl8',
        text: 'Stay away from downed power lines and electrical wires',
        icon: <Ionicons name="warning" size={16} color="#EA580C" />,
        category: 'During Flood'
      },
      // Post-Flood Safety
      {
        id: 'fl9',
        text: 'Wait for authorities to declare area safe before returning',
        icon: <Ionicons name="shield" size={16} color="#059669" />,
        category: 'After Flood'
      },
      {
        id: 'fl10',
        text: 'Avoid flood water - it may contain sewage, chemicals, or debris',
        icon: <Ionicons name="water" size={16} color="#92400E" />,
        category: 'After Flood'
      },
      {
        id: 'fl11',
        text: 'Photograph damage for insurance claims before cleaning',
        icon: <Ionicons name="camera" size={16} color="#2563EB" />,
        category: 'After Flood'
      },
      {
        id: 'fl12',
        text: 'Clean and disinfect everything that got wet',
        icon: <Ionicons name="medical" size={16} color="#7C3AED" />,
        category: 'After Flood'
      }
    ],
  },
  {
    id: 'storm-kit',
    title: 'Storm Emergency Kit',
    subtitle: 'Essential supplies and preparation for severe weather',
    icon: <Ionicons name="cloudy" size={20} color="#ffffff" />,
    color: '#374151',
    bgColor: '#F9FAFB',
    items: [
      // Communication & Information
      {
        id: 'st1',
        text: 'Battery-powered weather radio (NOAA Weather Radio)',
        icon: <Ionicons name="radio" size={16} color="#2563EB" />,
        category: 'Communication'
      },
      {
        id: 'st2',
        text: 'Cell phone with chargers and backup battery/solar charger',
        icon: <Ionicons name="battery-charging" size={16} color="#059669" />,
        category: 'Communication'
      },
      {
        id: 'st3',
        text: 'Two-way radios for family communication',
        icon: <Ionicons name="radio" size={16} color="#7C3AED" />,
        category: 'Communication'
      },
      // Lighting & Power
      {
        id: 'st4',
        text: 'LED flashlights (one per person) with extra batteries',
        icon: <Ionicons name="flashlight" size={16} color="#FBBF24" />,
        category: 'Power & Light'
      },
      {
        id: 'st5',
        text: 'Battery-powered lanterns for area lighting',
        icon: <Ionicons name="bulb" size={16} color="#EA580C" />,
        category: 'Power & Light'
      },
      {
        id: 'st6',
        text: 'Generator with fuel (operated outdoors only)',
        icon: <Ionicons name="flash" size={16} color="#DC2626" />,
        category: 'Power & Light'
      },
      // Food & Water
      {
        id: 'st7',
        text: 'One gallon of water per person per day (3-day minimum)',
        icon: <Ionicons name="water" size={16} color="#2563EB" />,
        category: 'Food & Water'
      },
      {
        id: 'st8',
        text: 'Non-perishable food (canned goods, protein bars, dried fruits)',
        icon: <Ionicons name="bag" size={16} color="#059669" />,
        category: 'Food & Water'
      },
      {
        id: 'st9',
        text: 'Manual can opener, disposable plates, cups, and utensils',
        icon: <Ionicons name="restaurant" size={16} color="#92400E" />,
        category: 'Food & Water'
      },
      // Safety & Tools
      {
        id: 'st10',
        text: 'First aid kit with bandages, antiseptic, and medications',
        icon: <Ionicons name="medical" size={16} color="#DC2626" />,
        category: 'Safety & Tools'
      },
      {
        id: 'st11',
        text: 'Multi-tool or Swiss Army knife with multiple functions',
        icon: <Ionicons name="build" size={16} color="#374151" />,
        category: 'Safety & Tools'
      },
      {
        id: 'st12',
        text: 'Duct tape and plastic sheeting for temporary repairs',
        icon: <Ionicons name="home" size={16} color="#2563EB" />,
        category: 'Safety & Tools'
      },
      // Comfort & Sanitation
      {
        id: 'st13',
        text: 'Warm blankets, sleeping bags, and extra clothing',
        icon: <Ionicons name="shirt" size={16} color="#7C3AED" />,
        category: 'Comfort'
      },
      {
        id: 'st14',
        text: 'Personal hygiene items, toilet paper, and feminine supplies',
        icon: <Ionicons name="heart" size={16} color="#EC4899" />,
        category: 'Comfort'
      },
      {
        id: 'st15',
        text: 'Important documents in waterproof container',
        icon: <Ionicons name="shield-checkmark" size={16} color="#2563EB" />,
        category: 'Documents'
      }
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
                  <View style={styles.titleTextContainer}>
                    <Text style={styles.checklistTitle}>{checklist.title}</Text>
                    <Text style={styles.checklistSubtitle}>{checklist.subtitle}</Text>
                  </View>
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
                  {(() => {
                    // Group items by category
                    const groupedItems = checklist.items.reduce((acc, item) => {
                      const category = item.category || 'General';
                      if (!acc[category]) acc[category] = [];
                      acc[category].push(item);
                      return acc;
                    }, {} as Record<string, typeof checklist.items>);
                    
                    return Object.entries(groupedItems).map(([category, items]) => (
                      <View key={category} style={styles.categorySection}>
                        <View style={styles.categoryHeader}>
                          <View style={styles.categoryBadge}>
                            <Text style={styles.categoryBadgeText}>{category}</Text>
                          </View>
                          <Text style={styles.categoryItemCount}>
                            {items.length} items
                          </Text>
                        </View>
                        <View style={styles.checklistItems}>
                          {items.map(item => (
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
                      </View>
                    ));
                  })()}
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
  titleTextContainer: {
    flex: 1,
  },
  checklistTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  checklistSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  chevronContainer: {
    padding: 4,
  },
  checklistContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 0,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  categoryItemCount: {
    fontSize: 12,
    color: '#6B7280',
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