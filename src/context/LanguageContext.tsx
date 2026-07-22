/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { dictionary, t as translate } from '../utils/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: keyof typeof dictionary['en'], params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('spaceguard_lang');
    return (saved === 'pl' || saved === 'en') ? saved : 'en'; // Default EN
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('spaceguard_lang', newLang);
  };

  const toggleLang = () => {
    const next = lang === 'en' ? 'pl' : 'en';
    setLang(next);
  };

  const t = (key: keyof typeof dictionary['en'], params?: Record<string, string | number>) => {
    return translate(key, lang, params);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
