import * as React from "react";
import { View, Text, TextStyle, ViewStyle } from "react-native";

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  style?: ViewStyle | TextStyle;
  children?: React.ReactNode;
}

function Badge({ 
  variant = 'default', 
  style, 
  children, 
  ...props 
}: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: '#F3F4F6',
          borderColor: '#E5E7EB',
          color: '#374151',
        };
      case 'destructive':
        return {
          backgroundColor: '#EF4444',
          borderColor: '#EF4444',
          color: '#FFFFFF',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: '#E5E7EB',
          color: '#374151',
        };
      default:
        return {
          backgroundColor: '#2563EB',
          borderColor: '#2563EB',
          color: '#FFFFFF',
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          borderWidth: 1,
          paddingHorizontal: 8,
          paddingVertical: 2,
          alignSelf: 'flex-start',
        },
        {
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
        },
        style as ViewStyle,
      ]}
      {...props}
    >
      <Text
        style={[
          {
            fontSize: 12,
            fontWeight: '500',
            color: variantStyles.color,
          },
          style as TextStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

export { Badge };