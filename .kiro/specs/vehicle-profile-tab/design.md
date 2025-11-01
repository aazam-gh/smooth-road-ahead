# Design Document

## Overview

The Vehicle Profile Tab feature adds a new navigation tab and dedicated page for managing comprehensive vehicle information. The design follows the existing mobile-first approach with consistent UI patterns, card-based layouts, and internationalization support. The feature integrates seamlessly with the current bottom navigation system and maintains visual consistency with existing pages.

## Architecture

### Component Structure
```
VehicleProfile (Page Component)
├── Header Section (with language toggle)
├── Vehicle Profile Form (Card Container)
│   ├── Form Fields (Input components)
│   ├── Date Pickers (for service dates)
│   └── Validation Logic
└── BottomNav (Updated with vehicle tab)
```

### Navigation Integration
- Extends existing `BottomNav` component with a fourth tab
- Uses React Router for navigation to `/vehicle-profile` route
- Maintains active state styling consistent with existing tabs

### Data Management
- Utilizes existing `VehicleProfile` interface from `types.ts`
- Implements local state management for form data
- Provides save/update functionality for vehicle information

## Components and Interfaces

### 1. Updated BottomNav Component
**Purpose**: Add vehicle profile tab to existing navigation
**Changes**:
- Add new tab object with vehicle icon (Car or Truck icon from lucide-react)
- Update tabs array to include vehicle profile route
- Maintain existing styling and behavior patterns

### 2. VehicleProfile Page Component
**Purpose**: Main page component for vehicle profile management
**Structure**:
```typescript
interface VehicleProfileProps {
  onLanguageChange: (lang: LanguageCode) => void;
  currentLang: LanguageCode;
}
```

**Layout**:
- Header with title "Vehicle Profile" and vehicle icon
- Language toggle positioned consistently with other pages
- Card-based form layout following OnboardingDetails pattern
- Responsive design with max-width container

### 3. Form Field Components
**Input Types**:
- Text inputs: VIN, Zip Code
- Number inputs: Odometer, mileage fields, age fields
- Date inputs: Service dates, insurance expiry (using HTML5 date input)

**Validation**:
- VIN format validation (17 characters, alphanumeric)
- Numeric validation for mileage and age fields
- Date validation for service dates
- Required field indicators

## Data Models

### VehicleProfile Interface (Existing)
```typescript
interface VehicleProfile {
  vin: string;
  odometer: number | '';
  lastOilChangeDate: string;
  lastOilChangeMileage: number | '';
  lastAirFilterChangeMiles: number | '';
  zipCode: string;
  lastServiceDate: string;
  tireAgeMonths: number | '';
  batteryAgeMonths: number | '';
  insuranceExpiryDate: string;
}
```

### Form State Management
- Local state using React useState hook
- Form data structure matching VehicleProfile interface
- Controlled inputs with onChange handlers
- Form submission handling with validation

## User Interface Design

### Visual Hierarchy
1. **Header Section**: Title with icon, language toggle
2. **Form Section**: Card container with grouped form fields
3. **Action Section**: Save/Update buttons (if needed)

### Form Field Layout
**Two-column responsive grid**:
- VIN (full width)
- Odometer | Last Service Date
- Last Oil Change Date | Last Oil Change Mileage
- Last Air Filter Change | Tire Age
- Battery Age | Insurance Expiry Date
- Zip Code (full width)

### Styling Patterns
- Consistent with existing pages (Dashboard, OnboardingDetails)
- Card-based layout with shadow-card class
- Input styling matching existing form components
- Proper spacing and typography hierarchy
- RTL support for Arabic language

## Internationalization

### New Translation Keys
```typescript
// English translations to add
'vehicle.profile_title': 'Vehicle Profile',
'vehicle.profile_subtitle': 'Manage your vehicle information',
'nav.vehicle': 'Vehicle',

// Arabic translations to add
'vehicle.profile_title': 'ملف المركبة',
'vehicle.profile_subtitle': 'إدارة معلومات مركبتك',
'nav.vehicle': 'المركبة',
```

### Existing Keys to Reuse
- All vehicle field labels already exist in i18n system
- Form validation messages can reuse existing patterns
- Navigation and common UI elements already translated

## Error Handling

### Input Validation
- Real-time validation for VIN format
- Numeric input constraints for mileage fields
- Date validation for service dates
- Visual feedback for invalid inputs using existing toast system

### Form Submission
- Validation before save operations
- Error messages using existing toast notifications
- Success feedback for successful updates

### Edge Cases
- Handle empty/undefined values gracefully
- Provide sensible defaults for numeric fields
- Graceful degradation for date picker on older browsers

## Testing Strategy

### Component Testing
- Unit tests for form validation logic
- Component rendering tests for VehicleProfile page
- Navigation integration tests for BottomNav updates
- Internationalization tests for both languages

### Integration Testing
- Form submission and data persistence
- Navigation flow between tabs
- Language switching functionality
- Responsive design across different screen sizes

### User Experience Testing
- Form usability and accessibility
- Touch interaction on mobile devices
- Keyboard navigation support
- Screen reader compatibility

## Implementation Considerations

### Performance
- Lazy loading for vehicle profile page
- Optimized re-renders using React best practices
- Efficient form state management

### Accessibility
- Proper ARIA labels for form fields
- Keyboard navigation support
- Screen reader friendly structure
- High contrast support

### Browser Compatibility
- HTML5 date input with fallback
- CSS Grid with flexbox fallback
- Modern JavaScript with appropriate polyfills

### Mobile Optimization
- Touch-friendly input sizes
- Appropriate keyboard types for different inputs
- Smooth scrolling and navigation
- Proper viewport handling