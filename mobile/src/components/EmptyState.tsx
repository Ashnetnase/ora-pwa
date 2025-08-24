import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({ 
  icon = '📋', 
  title, 
  subtitle, 
  actionText, 
  onAction 
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionText && onAction && (
        <Text style={styles.actionText} onPress={onAction}>
          {actionText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  actionText: {
    fontSize: 14,
    color: theme.colors.blue,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
