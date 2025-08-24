import * as React from "react"
import { Switch as RNSwitch, StyleSheet, ViewStyle } from "react-native"

interface SwitchProps {
  value?: boolean
  onValueChange?: (value: boolean) => void
  disabled?: boolean
  trackColor?: {
    false?: string
    true?: string
  }
  thumbColor?: string
  ios_backgroundColor?: string
  style?: ViewStyle
  className?: string
}

function Switch({
  value = false,
  onValueChange,
  disabled = false,
  trackColor = {
    false: "#E5E7EB", // muted
    true: "#2563EB"   // primary
  },
  thumbColor = "#FFFFFF",
  ios_backgroundColor = "#E5E7EB",
  style,
  className,
  ...props
}: SwitchProps) {
  return (
    <RNSwitch
      style={[styles.switch, style]}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={trackColor}
      thumbColor={thumbColor}
      ios_backgroundColor={ios_backgroundColor}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }], // Slightly larger for better touch target
  },
})

export { Switch }