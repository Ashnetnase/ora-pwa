import * as React from "react"
import { View, StyleSheet, ViewStyle } from "react-native"
import { Toggle } from "./toggle"
import { Ionicons } from '@expo/vector-icons'

// Common icon mappings for easy use
const iconMap = {
  'warning': 'warning',
  'cloud': 'cloud', 
  'traffic': 'car',
  'list': 'list',
  'block': 'ban',
  'schedule': 'calendar',
  'check-circle': 'checkmark-circle',
  'do-not-disturb': 'notifications-off',
  'map-pin': 'location',
  'clock': 'time',
  'info': 'information-circle',
  'plus': 'add',
  'x': 'close',
  'home': 'home',
  'file-text': 'document-text',
} as const

interface ToggleGroupItem {
  value: string
  label: string
  icon?: keyof typeof iconMap | string
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