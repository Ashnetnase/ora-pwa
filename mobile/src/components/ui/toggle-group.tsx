import * as React from "react"
import { View, StyleSheet, ViewStyle } from "react-native"
import { Toggle } from "./toggle"
import { LucideIcon, AlertTriangle, Cloud, Car, List, Ban, Calendar, CheckCircle, BellOff, MapPin, Clock, Info, Plus, X, Home, FileText } from "lucide-react"

// Common icon mappings for easy use
const iconMap = {
  'warning': AlertTriangle,
  'cloud': Cloud, 
  'traffic': Car,
  'list': List,
  'block': Ban,
  'schedule': Calendar,
  'check-circle': CheckCircle,
  'do-not-disturb': BellOff,
  'map-pin': MapPin,
  'clock': Clock,
  'info': Info,
  'plus': Plus,
  'x': X,
  'home': Home,
  'file-text': FileText,
} as const

interface ToggleGroupItem {
  value: string
  label: string
  icon?: keyof typeof iconMap | LucideIcon
}

interface ToggleGroupProps {
  type?: "single" | "multiple"
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  items: ToggleGroupItem[]
  disabled?: boolean
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  style?: ViewStyle
  className?: string
}

function ToggleGroup({
  type = "single",
  value,
  onValueChange,
  items,
  disabled = false,
  variant = "default",
  size = "default",
  style,
  className,
  ...props
}: ToggleGroupProps) {
  const isPressed = (itemValue: string) => {
    if (type === "single") {
      return value === itemValue
    } else {
      return Array.isArray(value) && value.includes(itemValue)
    }
  }

  const handlePress = (itemValue: string) => {
    if (disabled) return

    if (type === "single") {
      const newValue = value === itemValue ? "" : itemValue
      onValueChange?.(newValue)
    } else {
      const currentValues = Array.isArray(value) ? value : []
      const newValues = currentValues.includes(itemValue)
        ? currentValues.filter(v => v !== itemValue)
        : [...currentValues, itemValue]
      onValueChange?.(newValues)
    }
  }

  return (
    <View style={[styles.container, style]} {...props}>
      {items.map((item, index) => (
        <Toggle
          key={item.value}
          pressed={isPressed(item.value)}
          onPress={() => handlePress(item.value)}
          disabled={disabled}
          variant={variant}
          size={size}
          icon={item.icon}
          style={[
            styles.item,
            index === 0 && styles.firstItem,
            index === items.length - 1 && styles.lastItem,
            index > 0 && index < items.length - 1 && styles.middleItem
          ]}
        >
          {item.label}
        </Toggle>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB', // muted
    borderRadius: 8,
    padding: 4,
  },
  item: {
    flex: 1,
    borderRadius: 4,
  },
  firstItem: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  middleItem: {
    borderRadius: 0,
    marginLeft: 1,
    marginRight: 1,
  },
  lastItem: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
})

export { ToggleGroup }