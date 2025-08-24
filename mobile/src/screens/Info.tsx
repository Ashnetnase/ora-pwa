import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ChevronDown, ChevronRight, Droplets, Zap, Wind, CheckCircle, Phone, Mail, Globe, Shield, AlertTriangle } from 'lucide-react';
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
    icon: <Droplets size={20} color="#ffffff" />,
    color: '#2563EB',
    bgColor: '#EFF6FF',
    items: [
      {
        id: 'f1',
        text: 'Move to higher ground immediately',
        icon: <CheckCircle size={16} color="#10B981" />,
      },
      {
        id: 'f2',
        text: 'Avoid walking or driving through flood water',
        icon: <CheckCircle size={16} color="#10B981" />,
      },
      {
        id: 'f3',
        text: 'Turn off electricity at the main switch',
        icon: <CheckCircle size={16} color="#10B981" />,
      },
      {
        id: 'f4',
        text: 'Have emergency supplies ready (water, food, radio)',
        icon: <CheckCircle size={16} color="#10B981" />,
      },
      {
        id: 'f5',
        text: 'Stay informed via official emergency channels',
        icon: <CheckCircle size={16} color="#10B981" />,
      },
      {
        id: 'f6',
        text: 'Do not return home until authorities say it\'s safe',
        icon: <CheckCircle size={16} color="#10B981" />,
      },
    ],
  },
  {
    id: 'earthquake',
    title: 'Earthquake Safety',
    icon: <Zap size={20} color="#ffffff" />,
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    items: [
      {
        id: 'e1',
        text: 'Drop, Cover, and Hold On during shaking',
        icon: <CheckCircle size={16} color="#10B981" />,
      },
      {
        id: 'e2',
        text: 'Stay away from windows and heavy objects',
        icon: <CheckCircle size={16} color="#10B981" />,
      },
      {
        id: 'e3',
        text: 'If outdoors, move away from buildings and power lines',
        icon: <CheckCircle size={16} color="#10B981" />,
      },
      {
        id: 'e4',
        text: 'Check for injuries and hazards after shaking stops',
        icon: <CheckCircle size={16} color="#10B981" />,
      },
      {
        id: 'e5',
        text: 'Be prepared for aftershocks',
        icon: <CheckCircle size={16} color="#10B981" />,
      },
      {
        id: 'e6',
        text: 'Have a family emergency plan and meeting place',
        icon: <CheckCircle size={16} color="#10B981" />,
      },
      {
        id: 'e7',
        text: 'Keep emergency kit stocked (3 days supplies)',
        icon: <CheckCircle size={16} color="#10B981" />,
      },
    ],
  },
  {
    id: 'storm',
    title: 'Storm Safety',
    icon: <Wind size={20} color="#ffffff" />,
    color: '#6B7280',
    bgColor: '#F9FAFB',
    items: [
      {
        id: 's1',
        text: 'Stay indoors and away from windows',
        icon: <CheckCircle size={16} color="#10B981" />,
      },
      {
        id: 's2',
        text: 'Secure outdoor furniture and objects',
        icon: <CheckCircle size={16} color="#10B981" />,
      },
      {
        id: 's3',
        text: 'Avoid using electrical appliances',
        icon: <CheckCircle size={16} color="#10B981" />,
      },
      {
        id: 's4',
        text: 'Keep flashlights and battery radio ready',
        icon: <CheckCircle size={16} color="#10B981" />,
      },
      {
        id: 's5',
        text: 'Monitor weather warnings and updates',
        icon: <CheckCircle size={16} color="#10B981" />,
      },
      {
        id: 's6',
        text: 'Avoid driving unless absolutely necessary',
        icon: <CheckCircle size={16} color="#10B981" />,
      },
      {
        id: 's7',
        text: 'Stay away from damaged power lines',
        icon: <CheckCircle size={16} color="#10B981" />,
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
                    <ChevronDown size={20} color="#6B7280" />
                  ) : (
                    <ChevronRight size={20} color="#6B7280" />
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
            <AlertTriangle size={20} color="#EF4444" />
            <Text style={styles.emergencyTitleText}>Emergency Contacts</Text>
          </CardTitle>
        </CardHeader>
        <CardContent style={styles.emergencyContent}>
          <TouchableOpacity 
            style={styles.contactRow}
            onPress={() => handleContactPress('111')}
          >
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Emergency Services</Text>
              <Text style={styles.contactSubtext}>Police, Fire, Ambulance</Text>
            </View>
            <Text style={[styles.contactValue, { color: '#EF4444' }]}>111</Text>
          </TouchableOpacity>
          
          <View style={styles.contactDivider} />
          
          <TouchableOpacity 
            style={styles.contactRow}
            onPress={() => handleContactPress('0800 GET READY')}
          >
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Civil Defence</Text>
              <Text style={styles.contactSubtext}>Emergency preparedness</Text>
            </View>
            <Text style={[styles.contactValue, { color: '#2563EB' }]}>0800 GET READY</Text>
          </TouchableOpacity>
          
          <View style={styles.contactDivider} />
          
          <TouchableOpacity 
            style={styles.contactRow}
            onPress={() => handleContactPress('1737')}
          >
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>National Crisis Helpline</Text>
              <Text style={styles.contactSubtext}>Mental health support</Text>
            </View>
            <Text style={[styles.contactValue, { color: '#2563EB' }]}>1737</Text>
          </TouchableOpacity>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card style={styles.resourcesCard}>
        <CardHeader>
          <CardTitle style={styles.resourcesTitle}>
            <Globe size={20} color="#10B981" />
            <Text style={styles.resourcesTitleText}>Additional Resources</Text>
          </CardTitle>
        </CardHeader>
        <CardContent style={styles.resourcesContent}>
          <Text style={styles.resourcesDescription}>
            For more detailed emergency preparedness information, visit:
          </Text>
          <View style={styles.resourcesList}>
            <TouchableOpacity 
              style={styles.resourceItem}
              onPress={() => handleContactPress('https://getready.govt.nz')}
            >
              <Globe size={16} color="#10B981" />
              <Text style={styles.resourceText}>getready.govt.nz</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.resourceItem}
              onPress={() => handleContactPress('https://civildefence.govt.nz')}
            >
              <Shield size={16} color="#2563EB" />
              <Text style={styles.resourceText}>civildefence.govt.nz</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.resourceItem}
              onPress={() => handleContactPress('https://metservice.com')}
            >
              <Wind size={16} color="#F59E0B" />
              <Text style={styles.resourceText}>MetService weather warnings</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.resourceItem}
              onPress={() => handleContactPress('https://geonet.org.nz')}
            >
              <Zap size={16} color="#EF4444" />
              <Text style={styles.resourceText}>GeoNet earthquake information</Text>
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
});