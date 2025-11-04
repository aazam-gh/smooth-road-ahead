# Qatar Insurance Lifestyle

Your personal lifestyle companion for discovering, planning, and enjoying life in Qatar.

## Project Overview

Qatar Insurance Lifestyle is a comprehensive lifestyle application designed specifically for Qatar residents. The app combines AI-powered recommendations, personalized planning tools, and insurance management features to enhance your daily life experience in Qatar.

Note: For a comprehensive, end-to-end product and technical overview (user flows, architecture, data model, i18n, AI, and more), see docs/APP_DOCUMENTATION.md.

## Key Features

### 🎯 Smart Lifestyle Recommendations
- AI-powered suggestions based on your preferences and interests
- Personalized offers and deals from local businesses
- Curated content for dining, entertainment, fitness, and shopping

### 📅 Daily Planning & Check-ins
- Daily check-in system with streak tracking
- Personal activity planning and scheduling
- Event discovery and management
- Quick actions for common tasks

### 🤖 AI Chat Assistant
- **Family Activities Planner**: AI-powered planning for group and family experiences
- **Travel Optimization**: Weekend trip planning with weather and traffic considerations
- **Insurance Assistant**: Help with policy questions, claims, and coverage advice
- Voice chat capabilities for hands-free interaction

### 🏥 Insurance Management
- **Vehicle Insurance**: Track policy details, maintenance schedules, and service history
- **Health Insurance**: Manage coverage, appointments, and medical services
- **Home Insurance**: Property protection and policy management

### 🌍 Bilingual Support
- Full Arabic and English language support
- RTL (Right-to-Left) layout for Arabic
- Culturally appropriate content and recommendations

### 📱 Mobile-First Design
- Responsive design optimized for mobile devices
- Bottom navigation for easy thumb navigation
- Touch-friendly interface elements

## Technology Stack

This project is built with modern web technologies:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom theming
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **AI Integration**: Google Gemini AI for chat and recommendations
- **Internationalization**: Custom i18n implementation
- **Audio Processing**: Web Audio API for voice features

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd qatar-insurance-lifestyle
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Add your Gemini API key for AI features
VITE_GEMINI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Custom components
├── pages/              # Application pages/routes
├── lib/                # Utility functions and services
├── hooks/              # Custom React hooks
└── main.tsx           # Application entry point
```

## Features in Detail

### Dashboard
- Weather information and traffic updates
- Today's plans and quick actions
- Personalized offers and recommendations
- Activity tracking and statistics

### Discover Feed
- AI-curated content based on user preferences
- Like and save functionality
- Category-based filtering
- Related content suggestions

### Chat Assistant
- Natural language processing for lifestyle queries
- Voice input and output capabilities
- Integration with Maps for location-based services
- Booking and reservation assistance

### Insurance Profiles
- Comprehensive vehicle, health, and home insurance management
- Service scheduling and maintenance tracking
- Policy document storage and reminders
- Claims assistance and guidance

## Deployment

The application can be deployed using various platforms:

1. **Lovable Platform**: Direct deployment through the Lovable interface
2. **Vercel/Netlify**: Connect your repository for automatic deployments
3. **Traditional hosting**: Build and deploy the `dist` folder

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software developed for Qatar Insurance Company.

## Support

For support and questions, please contact the development team or refer to the in-app help section.
