import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CarouselSlide {
  image: string;
  title: string;
  subtitle: string;
}

const slides: CarouselSlide[] = [
  {
    image: "https://images.unsplash.com/photo-1685113872064-de4180a0ea93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxRYXRhciUyMGFyY2hpdGVjdHVyZSUyMHNreWxpbmV8ZW58MXx8fHwxNzYyMjQyMjc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Discover Your City",
    subtitle: "Personalized recommendations tailored to your lifestyle"
  },
  {
    image: "https://images.unsplash.com/photo-1723083640561-ce9615fe3d0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxRYXRhciUyMG11c2V1bSUyMGN1bHR1cmV8ZW58MXx8fHwxNzYyMjQyMjc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Cultural Experiences",
    subtitle: "Explore events, exhibitions, and activities curated for you"
  },
  {
    image: "https://images.unsplash.com/photo-1697126248437-db26a30024c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNaWRkbGUlMjBFYXN0ZXJuJTIwZGluaW5nJTIwZm9vZHxlbnwxfHx8fDE3NjIyNDIyNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Culinary Journeys",
    subtitle: "Find restaurants and dining experiences matched to your taste"
  },
  {
    image: "https://images.unsplash.com/photo-1591419582743-741b2d998dca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaWZlc3R5bGUlMjBhY3Rpdml0aWVzfGVufDF8fHx8MTc2MjI0MjI3OHww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Lifestyle & Leisure",
    subtitle: "Activities and experiences designed around your interests"
  }
];

interface ImageCarouselProps {
  currentStep: number;
}

export function ImageCarousel({ currentStep }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Change slide based on step
    const slideIndex = Math.min(currentStep - 1, slides.length - 1);
    setCurrentIndex(slideIndex);
  }, [currentStep]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#8B1538]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <ImageWithFallback
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B1538]/60 via-[#8B1538]/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center p-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center text-white max-w-2xl"
          >
            <h1 className="mb-4 text-white">{slides[currentIndex].title}</h1>
            <p className="text-white/90 text-xl">
              {slides[currentIndex].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2 px-16">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-12 bg-white' 
                : 'w-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}