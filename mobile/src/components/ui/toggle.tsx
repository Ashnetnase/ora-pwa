import * as React from "react"
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

interface ToggleProps {
  pressed?: boolean
  onPress?: () => void
  disabled?: boolean
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  children?: React.ReactNode
  icon?: keyof typeof MaterialIcons.glyphMap
  style?: ViewStyle
  textStyle?: TextStyle
  className?: string
}

function Toggle({
  pressed = false,
  onPress,
  disabled = false,
  variant = "default",
  size = "default",
  children,
  icon,
  style,
  textStyle,
  className,
  ...props
}: ToggleProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "outline":
        return pressed 
          ? { ...styles.outlinePressed, ...styles[`${size}Container`] }
          : { ...styles.outline, ...styles[`${size}Container`] }
      default:
        return pressed 
          ? { ...styles.defaultPressed, ...styles[`${size}Container`] }
          : { ...styles.default, ...styles[`${size}Container`] }
    }
  }

  const getTextStyles = () => {
    const baseTextStyle = styles[`${size}Text`]
    const variantTextStyle = pressed 
      ? styles.pressedText 
      : styles.normalText
    
    return [baseTextStyle, variantTextStyle, textStyle]
  }

  const getIconSize = () => {
    switch (size) {
      case "sm": return 16
      case "lg": return 24
      default: return 20
    }
  }

  return (
    <TouchableOpacity
      style={[
        styles.base,
        getVariantStyles(),
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}
    >
      {icon && (
        <MaterialIcons 
          name={icon} 
          size={getIconSize()} 
          color={pressed ? "#FFFFFF" : "#6B7280"}
          style={children ? styles.iconWithText : undefined}
        />
      )}
      {children && (
        <Text style={getTextStyles()}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    transition: 'all 0.2s',
  },
  
  // Size variants
  defaultContainer: {
    height: 36,
    paddingHorizontal: 8,
    minWidth: 36,
  },
  smContainer: {
    height: 32,
    paddingHorizontal: 6,
    minWidth: 32,
  },
  lgContainer: {
    height: 40,
    paddingHorizontal: 10,
    minWidth: 40,
  },
  
  // Text sizes
  defaultText: {
    fontSize: 14,
    fontWeight: '500',
  },
  smText: {
    fontSize: 12,
    fontWeight: '500',
  },
  lgText: {
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Color variants
  default: {
    backgroundColor: 'transparent',
  },
  defaultPressed: {
    backgroundColor: '#F3F4F6', // accent
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D1D5DB', // input border
  },
  outlinePressed: {
    backgroundColor: '#F3F4F6', // accent
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  
  // Text colors
  normalText: {
    color: '#6B7280', // muted-foreground
  },
  pressedText: {
    color: '#111827', // accent-foreground
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  
  // Icon spacing
  iconWithText: {
    marginRight: 6,
  },
})

export { Toggle }