import * as React from "react"
import { View, Text, StyleSheet } from "react-native"
import Slider from "@react-native-community/slider"

import { cn } from "../../utils"

interface SliderProps {
  className?: string
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number) => void
  disabled?: boolean
  style?: any
  thumbStyle?: any
  trackStyle?: any
  minimumTrackTintColor?: string
  maximumTrackTintColor?: string
  thumbTintColor?: string
}

function CustomSlider({
  className,
  value,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled = false,
  style,
  thumbStyle,
  trackStyle,
  minimumTrackTintColor = "#2563EB", // primary color
  maximumTrackTintColor = "#E5E7EB", // muted color
  thumbTintColor = "#FFFFFF",
  ...props
}: SliderProps) {
  const [sliderValue, setSliderValue] = React.useState(value || defaultValue)

  React.useEffect(() => {
    if (value !== undefined) {
      setSliderValue(value)
    }
  }, [value])

  const handleValueChange = (newValue: number) => {
    setSliderValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <View style={[styles.container, style]}>
      <Slider
        style={[styles.slider, trackStyle]}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={sliderValue}
        onValueChange={handleValueChange}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor={maximumTrackTintColor}
        thumbStyle={[styles.thumb, thumbStyle]}
        disabled={disabled}
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  thumb: {
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
})

export { CustomSlider as Slider }