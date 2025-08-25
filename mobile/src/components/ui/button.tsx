import * as React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  onPress?: () => void;
  onClick?: () => void; // For compatibility with existing code
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

function Button({
  variant = 'default',
  size = 'default',
  disabled = false,
  onPress,
  onClick,
  style,
  textStyle,
  children,
  ...props
}: ButtonProps) {
  
  const handlePress = onPress || onClick;

  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return {
          backgroundColor: disabled ? '#FECACA' : '#EF4444',
          borderColor: '#EF4444',
          borderWidth: 1,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: '#E5E7EB',
          borderWidth: 1,
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? '#E5E7EB' : '#F3F4F6',
          borderColor: '#E5E7EB',
          borderWidth: 1,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
        };
      case 'link':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: disabled ? '#93C5FD' : '#2563EB',
          borderColor: '#2563EB',
          borderWidth: 1,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          height: 36,
          paddingHorizontal: 12,
          borderRadius: 6,
        };
      case 'lg':
        return {
          height: 44,
          paddingHorizontal: 32,
          borderRadius: 6,
        };
      case 'icon':
        return {
          height: 40,
          width: 40,
          paddingHorizontal: 0,
          borderRadius: 6,
        };
      default:
        return {
          height: 40,
          paddingHorizontal: 16,
          borderRadius: 6,
        };
    }
  };

  const getTextStyles = () => {
    const baseTextStyle = {
      fontSize: size === 'sm' ? 14 : size === 'lg' ? 16 : 14,
      fontWeight: '500' as const,
      textAlign: 'center' as const,
    };

    switch (variant) {
      case 'destructive':
        return { ...baseTextStyle, color: '#FFFFFF' };
      case 'outline':
        return { ...baseTextStyle, color: '#374151' };
      case 'secondary':
        return { ...baseTextStyle, color: '#374151' };
      case 'ghost':
        return { ...baseTextStyle, color: '#374151' };
      case 'link':
        return { ...baseTextStyle, color: '#2563EB', textDecorationLine: 'underline' as const };
      default:
        return { ...baseTextStyle, color: '#FFFFFF' };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const textStyles = getTextStyles();

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles,
        sizeStyles,
        disabled && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});

export { Button };