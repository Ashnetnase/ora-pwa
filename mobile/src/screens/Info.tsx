import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Phone, Mail, Globe, Shield, CheckCircle, AlertTriangle, Info as InfoIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';

interface SafetyItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface EmergencyContact {
  id: string;
  name: string;
  type: 'phone' | 'email' | 'website';
  value: string;
  description: string;
}

const SAFETY_CHECKLIST: SafetyItem[] = [
  {
    id: '1',
    title: 'Emergency Kit Ready',
    description: 'Ensure you have water, food, first aid, and essential supplies',
    completed: false,
    priority: 'high',
  },
  {
    id: '2',
    title: 'Family Emergency Plan',
    description: 'Discuss evacuation routes and meeting points with family',
    completed: false,
    priority: 'high',
  },
  {
    id: '3',
    title: 'Important Documents',
    description: 'Keep copies of ID, insurance, and medical records in waterproof container',
    completed: false,
    priority: 'medium',
  },
  {
    id: '4',
    title: 'Communication Plan',
    description: 'Establish how to contact family members during emergencies',
    completed: false,
    priority: 'medium',
  },
  {
    id: '5',
    title: 'Local Hazards Knowledge',
    description: 'Understand risks specific to your area (floods, earthquakes, etc.)',
    completed: false,
    priority: 'low',
  },
];

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: '1',
    name: 'Emergency Services',
    type: 'phone',
    value: '111',
    description: 'Police, Fire, Ambulance',
  },
  {
    id: '2',
    name: 'Civil Defence',
    type: 'phone',
    value: '0800 22 22 00',
    description: 'National emergency management',
  },
  {
    id: '3',
    name: 'Weather Updates',
    type: 'website',
    value: 'metservice.com',
    description: 'Official weather forecasts and warnings',
  },
  {
    id: '4',
    name: 'Road Conditions',
    type: 'website',
    value: 'nzta.govt.nz',
    description: 'Real-time road status and closures',
  },
  {
    id: '5',
    name: 'Earthquake Info',
    type: 'website',
    value: 'geonet.org.nz',
    description: 'Latest earthquake data and alerts',
  },
];

export default function Info() {
  const [checklist, setChecklist] = useState<SafetyItem[]>(SAFETY_CHECKLIST);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['checklist']));

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const toggleSection = (section: string) => {
    const newSections = new Set(openSections);
    if (newSections.has(section)) {
      newSections.delete(section);
    } else {
      newSections.add(section);
    }
    setOpenSections(newSections);
  };

  const getPriorityBadge = (priority: SafetyItem['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge style={styles.highPriorityBadge}>High</Badge>;
      case 'medium':
        return <Badge style={styles.mediumPriorityBadge}>Medium</Badge>;
      case 'low':
        return <Badge style={styles.lowPriorityBadge}>Low</Badge>;
      default:
        return null;
    }
  };

  const getContactIcon = (type: EmergencyContact['type']) => {
    switch (type) {
      case 'phone':
        return <Phone size={20} color="#2563EB" />;
      case 'email':
        return <Mail size={20} color="#10B981" />;
      case 'website':
        return <Globe size={20} color="#F59E0B" />;
      default:
        return <InfoIcon size={20} color="#6B7280" />;
    }
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Information</Text>
        <Text style={styles.subtitle}>
          Stay prepared with safety checklists and emergency contacts
        </Text>
      </View>

      {/* Safety Checklist */}
      <Card style={styles.sectionCard}>
        <Collapsible
          open={openSections.has('checklist')}
          onOpenChange={() => toggleSection('checklist')}
        >
          <CollapsibleTrigger asChild>
            <TouchableOpacity style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Shield size={24} color="#2563EB" />
                <Text style={styles.sectionTitle}>Safety Checklist</Text>
              </View>
              <View style={styles.sectionMeta}>
                <Text style={styles.progressText}>
                  {completedCount}/{totalCount} completed
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${(completedCount / totalCount) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
            </TouchableOpacity>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent style={styles.checklistContent}>
              {checklist.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.checklistItem}
                  onPress={() => toggleChecklistItem(item.id)}
                >
                  <View style={styles.checklistItemHeader}>
                    <View style={styles.checklistItemInfo}>
                      <Text style={[
                        styles.checklistItemTitle,
                        item.completed && styles.checklistItemTitleCompleted
                      ]}>
                        {item.title}
                      </Text>
                      <Text style={styles.checklistItemDescription}>
                        {item.description}
                      </Text>
                    </View>
                    <View style={styles.checklistItemActions}>
                      {getPriorityBadge(item.priority)}
                      <View style={[
                        styles.checkbox,
                        item.completed && styles.checkboxCompleted
                      ]}>
                        {item.completed && <CheckCircle size={16} color="#10B981" />}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Emergency Contacts */}
      <Card style={styles.sectionCard}>
        <Collapsible
          open={openSections.has('contacts')}
          onOpenChange={() => toggleSection('contacts')}
        >
          <CollapsibleTrigger asChild>
            <TouchableOpacity style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Phone size={24} color="#EF4444" />
                <Text style={styles.sectionTitle}>Emergency Contacts</Text>
              </View>
              <Text style={styles.sectionSubtitle}>
                Tap to expand
              </Text>
            </TouchableOpacity>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent style={styles.contactsContent}>
              {EMERGENCY_CONTACTS.map((contact) => (
                <View key={contact.id} style={styles.contactItem}>
                  <View style={styles.contactIcon}>
                    {getContactIcon(contact.type)}
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactValue}>{contact.value}</Text>
                    <Text style={styles.contactDescription}>{contact.description}</Text>
                  </View>
                </View>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.sectionCard}>
        <CardHeader>
          <CardTitle style={styles.quickActionsTitle}>
            <AlertTriangle size={20} color="#F59E0B" />
            <Text style={styles.quickActionsTitleText}>Quick Actions</Text>
          </CardTitle>
        </CardHeader>
        <CardContent style={styles.quickActionsContent}>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Shield size={24} color="#2563EB" />
              <Text style={styles.quickActionText}>Emergency Kit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Phone size={24} color="#EF4444" />
              <Text style={styles.quickActionText}>Call 111</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Globe size={24} color="#10B981" />
              <Text style={styles.quickActionText}>Weather</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <InfoIcon size={24} color="#F59E0B" />
              <Text style={styles.quickActionText}>More Info</Text>
            </TouchableOpacity>
          </View>
        </CardContent>
      </Card>

      {/* Emergency Tips */}
      <Card style={styles.sectionCard}>
        <CardHeader>
          <CardTitle style={styles.tipsTitle}>
            <InfoIcon size={20} color="#10B981" />
            <Text style={styles.tipsTitleText}>Emergency Tips</Text>
          </CardTitle>
        </CardHeader>
        <CardContent style={styles.tipsContent}>
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>1</Text>
            <Text style={styles.tipText}>
              Stay calm and assess the situation before taking action
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>2</Text>
            <Text style={styles.tipText}>
              Follow official instructions from emergency services
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>3</Text>
            <Text style={styles.tipText}>
              Keep emergency supplies easily accessible
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>4</Text>
            <Text style={styles.tipText}>
              Have a communication plan with family and friends
            </Text>
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
  sectionCard: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 0,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sectionMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  checklistContent: {
    padding: 16,
    gap: 12,
  },
  checklistItem: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  checklistItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  checklistItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  checklistItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  checklistItemTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  checklistItemDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  checklistItemActions: {
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxCompleted: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  contactsContent: {
    padding: 16,
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  quickActionsTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickActionsTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  quickActionsContent: {
    padding: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  tipsTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipsTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  tipsContent: {
    padding: 16,
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  highPriorityBadge: {
    backgroundColor: '#EF4444',
    color: '#ffffff',
  },
  mediumPriorityBadge: {
    backgroundColor: '#F59E0B',
    color: '#ffffff',
  },
  lowPriorityBadge: {
    backgroundColor: '#10B981',
    color: '#ffffff',
  },
});
