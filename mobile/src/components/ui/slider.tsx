import * as React from "react"
import { View, Text, StyleSheet, Platform } from "react-native"
import { cn } from "../../utils"

// Web-compatible slider component
const WebSlider = ({ value, onValueChange, min, max, step, style, ...props }: any) => {
  const handleChange = (e: any) => {
    onValueChange?.(parseFloat(e.target.value))
  }

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={handleChange}
      style={{
        width: '100%',
        height: 6,
        borderRadius: 3,
        background: `linear-gradient(to right, #2563EB 0%, #2563EB ${((value - min) / (max - min)) * 100}%, #E5E7EB ${((value - min) / (max - min)) * 100}%, #E5E7EB 100%)`,
        outline: 'none',
        appearance: 'none',
        WebkitAppearance: 'none',
        ...style
      }}
      {...props}
    />
  )
}

// Native slider component
let NativeSlider: any = null
try {
  if (Platform.OS !== 'web') {
    NativeSlider = require("@react-native-community/slider").default
  }
} catch (e) {
  // Fallback for web or if package not available
}

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

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        <WebSlider
          value={sliderValue}
          onValueChange={handleValueChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          style={{
            height: 8,
            borderRadius: 4,
            background: `linear-gradient(to right, ${minimumTrackTintColor} 0%, ${minimumTrackTintColor} ${((sliderValue - min) / (max - min)) * 100}%, ${maximumTrackTintColor} ${((sliderValue - min) / (max - min)) * 100}%, ${maximumTrackTintColor} 100%)`,
          }}
          {...props}
        />
      </View>
    )
  }

  return (
    <View style={[styles.container, style]}>
      {NativeSlider && (
        <NativeSlider
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
      )}
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