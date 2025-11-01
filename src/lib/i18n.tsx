import React, { createContext, useContext, useMemo } from 'react';
import { LanguageCode } from '../../types';

type Dict = Record<string, string>;

const en: Dict = {
  'app.brand': 'DriveSense',
  'app.analyzing': 'Analyzing...',
  'app.calculate': 'Calculate PRR Score',
  'app.calc_failed': 'Failed to calculate PRR score. Please try again.',

  'nav.home': 'Home',
  'nav.chat': 'DriveSense Chat',
  'nav.profile': 'Profile',
  'nav.version': 'DriveSense Module v1.3',

  'vehicle.title': 'Vehicle Profile',
  'vehicle.vin': 'VIN',
  'vehicle.odometer': 'Odometer (miles)',
  'vehicle.lastServiceDate': 'Last Service Date',
  'vehicle.lastOilChangeDate': 'Last Oil Change Date',
  'vehicle.lastOilChangeMileage': 'Last Oil Change (miles)',
  'vehicle.lastAirFilterChangeMiles': 'Last Air Filter Change (miles)',
  'vehicle.tireAgeMonths': 'Tire Age (months)',
  'vehicle.batteryAgeMonths': 'Battery Age (months)',
  'vehicle.insuranceExpiryDate': 'Insurance Expiry Date',
  'vehicle.zipCode': 'Zip Code',

  'env.title': 'Environmental Data',
  'env.currentTemp': 'Current Temperature (°C)',
  'env.daysAbove45': 'Days > 45°C (Last 90 Days)',
  'env.sandstorms': 'Sandstorm Events (Last 30 Days)',
  'env.dustLevel': 'Dust Level',
  'env.weatherForecastSummary': 'Weather Forecast (summary)',
  'env.dust.low': 'Low',
  'env.dust.medium': 'Medium',
  'env.dust.high': 'High',
  'env.select': 'Select',

  'results.prr_label': 'PREDICTIVE RISK & REPAIR SCORE',
  'results.score.excellent': 'EXCELLENT',
  'results.score.good': 'GOOD',
  'results.score.attention': 'ATTENTION',
  'results.priority': 'Priority Car Care',
  'results.book_service': 'Book QIC Service & Earn Loyalty Points',
  'results.ai_recs': 'AI Recommendations',
  'results.urgency': 'Urgency',
  'results.run_new': 'Run New Analysis',
  'results.nearby_garages': 'Nearby Garages:',

  'chat.title': 'DriveSense Chat',
  'chat.find_garages': 'Find Nearby Garages',
  'chat.placeholder': 'Ask about your vehicle...',
  'chat.connecting': 'Connecting voice...',
  'chat.live': 'Live',
  'chat.voice_connecting_msg': 'Connecting to voice agent...',
  'chat.voice_open_msg': 'Connection opened. You can start speaking.',
  'chat.voice_closed_msg': 'Voice connection closed.',
  'chat.voice_perm_error': 'Could not access microphone. Please grant permission and try again.',
  'chat.voice_key_error': 'Voice chat requires GEMINI_API_KEY. Add it to a .env file and restart.',
  'chat.location_error': "I couldn't access your location. Please enable location permissions in your browser settings to use this feature.",
  'chat.maps_error': "Sorry, I couldn't find garages near you. Please ensure location services are enabled.",

  'login.welcome': 'Welcome to DriveSense',
  'login.subtitle': 'Sign in to continue',
  'login.username': 'Username',
  'login.password': 'Password',
  'login.signin': 'Sign In',
  'login.username_ph': 'Enter any username',
  'login.password_ph': 'Enter any password',

  'profile.member': 'QIC Member',
  'profile.name': 'Name',
  'profile.language': 'Language',
  'profile.drivingStyle': 'Driving Style',
  'profile.style.calm': 'Calm',
  'profile.style.normal': 'Normal',
  'profile.style.aggressive': 'Aggressive',
  'profile.loyalty_points': 'QIC Loyalty Points',
  'profile.service_history': 'Service History',
};

const ar: Dict = {
  'app.brand': 'درايف سنس',
  'app.analyzing': 'جاري التحليل...',
  'app.calculate': 'احسب درجة المخاطر والصيانة',
  'app.calc_failed': 'فشل في حساب الدرجة. يرجى المحاولة لاحقًا.',

  'nav.home': 'الرئيسية',
  'nav.chat': 'محادثة درايف سنس',
  'nav.profile': 'الملف الشخصي',
  'nav.version': 'إصدار درايف سنس 1.3',

  'vehicle.title': 'بيانات المركبة',
  'vehicle.vin': 'رقم الهيكل (VIN)',
  'vehicle.odometer': 'عداد المسافة (ميل)',
  'vehicle.lastServiceDate': 'تاريخ آخر صيانة',
  'vehicle.lastOilChangeDate': 'تاريخ آخر تغيير زيت',
  'vehicle.lastOilChangeMileage': 'المسافة منذ آخر تغيير زيت (ميل)',
  'vehicle.lastAirFilterChangeMiles': 'المسافة منذ تغيير فلتر الهواء (ميل)',
  'vehicle.tireAgeMonths': 'عمر الإطارات (بالأشهر)',
  'vehicle.batteryAgeMonths': 'عمر البطارية (بالأشهر)',
  'vehicle.insuranceExpiryDate': 'تاريخ انتهاء التأمين',
  'vehicle.zipCode': 'الرمز البريدي',

  'env.title': 'البيئة المحيطة',
  'env.currentTemp': 'درجة الحرارة الحالية (°م)',
  'env.daysAbove45': 'الأيام فوق 45°م (آخر 90 يومًا)',
  'env.sandstorms': 'عواصف رملية (آخر 30 يومًا)',
  'env.dustLevel': 'مستوى الغبار',
  'env.weatherForecastSummary': 'ملخص حالة الطقس',
  'env.dust.low': 'منخفض',
  'env.dust.medium': 'متوسط',
  'env.dust.high': 'مرتفع',
  'env.select': 'اختر',

  'results.prr_label': 'درجة المخاطر والصيانة التنبؤية',
  'results.score.excellent': 'ممتاز',
  'results.score.good': 'جيد',
  'results.score.attention': 'بحاجة للاهتمام',
  'results.priority': 'أولويات العناية بالمركبة',
  'results.book_service': 'احجز خدمة QIC واحصل على نقاط الولاء',
  'results.ai_recs': 'توصيات الذكاء الاصطناعي',
  'results.urgency': 'الأولوية',
  'results.run_new': 'تشغيل تحليل جديد',
  'results.nearby_garages': 'ورش قريبة:',

  'chat.title': 'محادثة درايف سنس',
  'chat.find_garages': 'ابحث عن ورش قريبة',
  'chat.placeholder': 'اسأل عن مركبتك...',
  'chat.connecting': 'جاري الاتصال بالصوت...',
  'chat.live': 'مباشر',
  'chat.voice_connecting_msg': 'جاري الاتصال بالوكيل الصوتي...',
  'chat.voice_open_msg': 'تم فتح الاتصال. يمكنك البدء بالتحدث.',
  'chat.voice_closed_msg': 'تم إغلاق الاتصال الصوتي.',
  'chat.voice_perm_error': 'تعذر الوصول إلى الميكروفون. يرجى السماح وإعادة المحاولة.',
  'chat.voice_key_error': 'المحادثة الصوتية تتطلب مفتاح GEMINI_API_KEY. الرجاء إضافته وإعادة التشغيل.',
  'chat.location_error': 'تعذر الوصول إلى موقعك. فعّل أذونات الموقع لاستخدام هذه الميزة.',
  'chat.maps_error': 'عذرًا، لم أتمكن من العثور على ورش قريبة. تأكد من تفعيل خدمات الموقع.',

  'login.welcome': 'مرحبًا بك في درايف سنس',
  'login.subtitle': 'سجّل الدخول للمتابعة',
  'login.username': 'اسم المستخدم',
  'login.password': 'كلمة المرور',
  'login.signin': 'تسجيل الدخول',
  'login.username_ph': 'أدخل أي اسم مستخدم',
  'login.password_ph': 'أدخل أي كلمة مرور',

  'profile.member': 'عضو QIC',
  'profile.name': 'الاسم',
  'profile.language': 'اللغة',
  'profile.drivingStyle': 'أسلوب القيادة',
  'profile.style.calm': 'هادئ',
  'profile.style.normal': 'عادي',
  'profile.style.aggressive': 'عدواني',
  'profile.loyalty_points': 'نقاط ولاء QIC',
  'profile.service_history': 'سجل الصيانة',
};

const dicts: Record<LanguageCode, Dict> = { en, ar };

export const I18nContext = createContext<{ lang: LanguageCode; t: (k: string) => string }>({
  lang: 'en',
  t: (k: string) => k,
});

export const I18nProvider: React.FC<{ lang: LanguageCode; children: React.ReactNode }> = ({ lang, children }) => {
  const t = useMemo(() => {
    const d = dicts[lang] || en;
    return (k: string) => d[k] ?? en[k] ?? k;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
