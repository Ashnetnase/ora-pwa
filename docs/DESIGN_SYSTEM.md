# Ora PWA Design System

## Color Palette

### Primary Colors
- **Primary**: `#2563EB` (blue) - Main brand color, primary actions, active states
- **Accent**: `#10B981` (green) - Success states, community alerts, positive actions
- **Warning**: `#F59E0B` (orange) - Road alerts, warnings, moderate severity
- **Error**: `#EF4444` (red) - Earthquakes (high magnitude), errors, critical alerts
- **Background**: `#F9FAFB` (light gray) - Page backgrounds, subtle containers

### Semantic Usage
```css
/* Earthquake Markers */
.earthquake-low { color: #2563EB; }      /* Magnitude < 4 */
.earthquake-high { color: #EF4444; }     /* Magnitude >= 4 */

/* Road Alerts */
.road-alert { color: #F59E0B; }          /* All road conditions */

/* Community Reports */
.community-alert { color: #10B981; }     /* Community reports */

/* Backgrounds */
.page-bg { background: #F9FAFB; }        /* Main page background */
.card-bg { background: #FFFFFF; }        /* Card/modal backgrounds */
```

## Typography Scale

### Font Weights
- **Regular**: 400 (body text)
- **Medium**: 500 (labels, secondary headings)
- **Semibold**: 600 (primary headings, emphasis)
- **Bold**: 700 (major headings, alerts)

### Size Scale (Mobile-First)
```css
/* Base sizes */
.text-xs { font-size: 0.75rem; }    /* 12px - Small labels */
.text-sm { font-size: 0.875rem; }   /* 14px - Secondary text */
.text-base { font-size: 1rem; }     /* 16px - Body text */
.text-lg { font-size: 1.125rem; }   /* 18px - Headings */
.text-xl { font-size: 1.25rem; }    /* 20px - Page titles */
```

## Layout System

### Container Pattern
```css
/* Mobile-first 390px max width */
.app-container {
  max-width: 390px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Responsive breakpoints */
@media (min-width: 640px) {
  .app-container {
    max-width: 640px;
    padding: 0 24px;
  }
}
```

### Spacing Scale
- **xs**: 4px - Icon margins, tight spacing
- **sm**: 8px - Component internal spacing
- **md**: 16px - Standard component gaps
- **lg**: 24px - Section spacing
- **xl**: 32px - Major layout spacing

## Component Patterns

### Filter Chips
```tsx
<Badge
  variant={isActive ? 'default' : 'secondary'}
  className={`cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
    isActive 
      ? 'bg-primary hover:bg-primary/90 text-white border-primary' 
      : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
  }`}
>
  <Icon className="w-3 h-3 mr-1" />
  Label ({count})
</Badge>
```

### Map Markers
```tsx
// Earthquake: Circle (●)
// Roads: Triangle (▲) 
// Community: Pin (📍)

const markerStyles = {
  earthquake: {
    color: magnitude >= 4 ? '#EF4444' : '#2563EB',
    shape: '●',
    border: magnitude >= 4 ? '#DC2626' : '#1D4ED8'
  },
  road: {
    color: '#F59E0B',
    shape: '▲',
    border: '#D97706'
  },
  community: {
    color: '#10B981',
    shape: '📍',
    border: '#059669'
  }
}
```

### Interactive States
```css
/* Hover effects */
.interactive:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

/* Active states */
.active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}

/* Focus states */
.focus-visible {
  outline: 2px solid #2563EB;
  outline-offset: 2px;
}
```

## Map UI Patterns

### Filter Bar (Top)
- Position: `absolute top-4 left-4 right-4`
- Z-index: `z-[1000]`
- Gap: `gap-2`
- Flex wrap for mobile

### Legend (Bottom Left)
- Position: `absolute bottom-4 left-4`
- Background: `bg-white/95 backdrop-blur-sm`
- Border: `border border-gray-200`
- Shadow: `shadow-lg`
- Rounded: `rounded-lg`

### Popups
- Max width: `min-w-[200px] max-w-[280px]`
- Padding: `p-3`
- Background: `bg-white`
- Border: `border border-gray-200`
- Shadow: `shadow-xl`

## Loading & Empty States

### Loading Spinner
```tsx
<div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
```

### Empty States
```tsx
<div className="text-center p-6">
  <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
  <h3 className="text-lg font-medium text-gray-900 mb-2">No Data</h3>
  <p className="text-gray-600">Description of empty state</p>
</div>
```

## Mobile-First Responsive Classes

### Spacing
```css
/* Mobile: 2, Desktop: 4 */
.responsive-gap { @apply gap-2 sm:gap-4; }

/* Mobile: 3, Desktop: 6 */
.responsive-padding { @apply p-3 sm:p-6; }
```

### Text Sizes
```css
/* Mobile: sm, Desktop: base */
.responsive-text { @apply text-sm sm:text-base; }
```

### Layout
```css
/* Mobile: full width, Desktop: auto */
.responsive-width { @apply w-full sm:w-auto; }
```

## Accessibility Guidelines

### Color Contrast
- All text must meet WCAG AA standards (4.5:1 ratio)
- Interactive elements need sufficient color contrast
- Don't rely solely on color to convey information

### Focus Management
- All interactive elements must be keyboard accessible
- Focus indicators must be visible
- Tab order should be logical

### Screen Readers
- Use semantic HTML elements
- Provide alt text for images
- Use ARIA labels for complex interactions

## Implementation Checklist

### Colors ✓
- [ ] Primary blue (#2563EB) for main actions
- [ ] Green (#10B981) for community/success
- [ ] Orange (#F59E0B) for warnings/roads
- [ ] Red (#EF4444) for errors/critical earthquakes
- [ ] Light gray (#F9FAFB) for backgrounds

### Typography ✓
- [ ] Consistent font weights (400, 500, 600, 700)
- [ ] Mobile-first text sizing
- [ ] Proper line heights for readability

### Layout ✓
- [ ] 390px max width mobile container
- [ ] Consistent spacing scale
- [ ] Responsive breakpoints

### Components ✓
- [ ] ShadCN UI badge patterns
- [ ] Interactive state animations
- [ ] Consistent shadow usage
- [ ] Proper z-index layering

### Accessibility ✓
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Color contrast compliance
- [ ] Focus indicators
