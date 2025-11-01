

export type LanguageCode = 'en' | 'ar';
export type DrivingStyle = 'calm' | 'normal' | 'aggressive';
export type DustLevel = '' | 'low' | 'medium' | 'high';

export interface UserProfile {
  name: string;
  language: LanguageCode;
  drivingStyle: DrivingStyle;
}

export interface VehicleProfile {
  vin: string;
  odometer: number | '';
  lastOilChangeDate: string;
  lastOilChangeMileage: number | '';
  lastAirFilterChangeMiles: number | '';
  zipCode: string;
  // Phase 1 additions
  lastServiceDate: string;
  tireAgeMonths: number | '';
  batteryAgeMonths: number | '';
  insuranceExpiryDate: string;
}

export interface EnvironmentalData {
  currentTemperature_C: number | '';
  daysAbove_45C_Last_90Days: number | '';
  sandstorm_Events_Last_30Days: number | '';
  // Phase 1 additions
  dustLevel: DustLevel;
  weatherForecastSummary: string; // free-text summary for next few days
}

export interface Recommendation {
  component: string;
  recommendationText: string;
  urgency: 'High' | 'Medium' | 'Low';
}

export interface PredictionResult {
  prrScore: number;
  overallAssessment: string;
  recommendations: Recommendation[];
  alerts: string[];
}

export interface ChatMessage {
  sender: 'user' | 'model';
  content: string;
  groundingChunks?: any[];
}

export interface ServiceBooking {
  id: string;
  service: string;
  date: string;
  location: string;
  pointsEarned: number;
}