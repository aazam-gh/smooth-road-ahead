import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProfileContent from "./ProfileContent";
import { useI18n } from "@/lib/i18n";
import { LanguageCode } from "../../types";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLanguageChange: (lang: LanguageCode) => void;
  currentLang: LanguageCode;
}

const ProfileModal = ({ isOpen, onClose, onLanguageChange, currentLang }: ProfileModalProps) => {
  const { t } = useI18n();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('account.title')}</DialogTitle>
        </DialogHeader>
        <ProfileContent 
          onLanguageChange={onLanguageChange}
          currentLang={currentLang}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;