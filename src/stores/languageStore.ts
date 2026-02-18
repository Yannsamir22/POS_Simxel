import { create } from 'zustand';

interface LanguageStore {
  language: 'en' | 'fr';
  setLanguage: (lang: 'en' | 'fr') => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  toggleLanguage: () =>
    set((state) => ({
      language: state.language === 'en' ? 'fr' : 'en',
    })),
}));
