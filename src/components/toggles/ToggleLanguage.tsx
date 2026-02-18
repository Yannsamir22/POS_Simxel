import { useLanguageStore } from '../../stores/languageStore';
import { Globe } from 'lucide-react';

const ToggleLanguage = () => {
  const { language, toggleLanguage } = useLanguageStore();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleLanguage}
        className="btn btn-sm btn-ghost gap-2 hover:bg-base-200"
        title={`Switch to ${language === 'en' ? 'Français' : 'English'}`}
      >
        <Globe size={18} />
        <span className="font-semibold">{language.toUpperCase()}</span>
      </button>
    </div>
  );
};

export default ToggleLanguage;
