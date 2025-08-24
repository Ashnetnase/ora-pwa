import * as React from "react";
import { View, Text, ViewStyle, TextStyle } from "react-native";
import { cn } from "./utils";

interface CardProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

interface CardHeaderProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

interface CardTitleProps {
  style?: TextStyle | ViewStyle;
  children?: React.ReactNode;
}

interface CardContentProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

interface CardFooterProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

interface CardDescriptionProps {
  style?: TextStyle;
  children?: React.ReactNode;
}

function Card({ style, children, ...props }: CardProps) {
  return (
    <View
      style={[
        {
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          backgroundColor: '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

function CardHeader({ style, children, ...props }: CardHeaderProps) {
  return (
    <View
      style={[
        {
          padding: 24,
          paddingBottom: 12,
        },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

function CardTitle({ style, children, ...props }: CardTitleProps) {
  return (
    <Text
      style={[
        {
          fontSize: 20,
          fontWeight: '600',
          color: '#111827',
          lineHeight: 28,
        },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

function CardDescription({ style, children, ...props }: CardDescriptionProps) {
  return (
    <Text
      style={[
        {
          fontSize: 14,
          color: '#6B7280',
          lineHeight: 20,
          marginTop: 4,
        },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

function CardContent({ style, children, ...props }: CardContentProps) {
  return (
    <View
      style={[
        {
          padding: 24,
          paddingTop: 0,
        },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

function CardFooter({ style, children, ...props }: CardFooterProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          padding: 24,
          paddingTop: 0,
        },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };