import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useI18n } from '@/lib/i18n';
import {
  X,
  MapPin,
  Clock,
  Calendar,
  Star,
  Share2,
  Heart,
  CheckCircle
} from 'lucide-react';

interface Offer {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  validUntil: string;
  discount: string;
  visible: boolean;
  fullDescription?: string;
  location?: string;
  rating?: number;
  originalPrice?: string;
  discountedPrice?: string;
  terms?: string[];
}

interface OfferModalProps {
  offer: Offer | null;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (offerId: number) => void;
  isClaimed: boolean;
}

export function OfferModal({ offer, isOpen, onClose, onClaim, isClaimed }: OfferModalProps) {
  const { t } = useI18n();
  const [isLiked, setIsLiked] = useState(false);

  if (!isOpen || !offer) return null;

  const handleClaim = () => {
    onClaim(offer.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: offer.title,
        text: offer.description,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        {/* Header Image */}
        <div className="relative h-64 sm:h-80">
          <ImageWithFallback
            src={offer.image}
            alt={offer.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-[#6568F4] text-white border-0 text-sm">
              {offer.discount} OFF
            </Badge>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/90 hover:bg-white text-gray-700"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/90 hover:bg-white text-gray-700"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/90 hover:bg-white text-gray-700"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {isClaimed && (
            <div className="absolute bottom-4 left-4">
              <Badge className="bg-green-500 text-white border-0 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {t('newdashboard.claimed')}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category and Rating */}
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="text-sm">
              {offer.category}
            </Badge>
            {offer.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{offer.rating}</span>
                <span className="text-sm text-gray-500">(124 reviews)</span>
              </div>
            )}
          </div>

          {/* Title and Description */}
          <h2 className="text-2xl font-bold mb-2">{offer.title}</h2>
          <p className="text-gray-600 mb-4">{offer.description}</p>

          {/* Full Description */}
          {offer.fullDescription && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">{t('newdashboard.about_offer')}</h3>
              <p className="text-gray-700 leading-relaxed">{offer.fullDescription}</p>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {offer.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{offer.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{t('newdashboard.valid_until')} {offer.validUntil}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{t('newdashboard.limited_time')}</span>
            </div>
          </div>

          {/* Pricing */}
          {offer.originalPrice && offer.discountedPrice && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-[#6568F4]">{offer.discountedPrice}</span>
                <span className="text-lg text-gray-500 line-through">{offer.originalPrice}</span>
                <Badge className="bg-green-100 text-green-800 border-0">
                  {t('newdashboard.save')} {offer.discount}
                </Badge>
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          {offer.terms && offer.terms.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">{t('newdashboard.terms_conditions')}</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {offer.terms.map((term, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isClaimed ? (
              <Button 
                className="flex-1 bg-[#6568F4] hover:bg-[#6568F4]"
                onClick={handleClaim}
              >
                {t('newdashboard.claim_offer')}
              </Button>
            ) : (
              <Button 
                className="flex-1 bg-green-500 hover:bg-green-600"
                disabled
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {t('newdashboard.claimed')}
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              {t('newdashboard.close')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}