
import React from 'react';
import { motion } from 'framer-motion';
import { Currency } from '../types';

interface HeaderProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onToggleLanguage: () => void;
}

const Header: React.FC<HeaderProps> = ({ currency, onCurrencyChange, onToggleLanguage }) => {
  const currencies: { code: Currency; label: string }[] = [
    { code: 'USD', label: 'USD ($)' },
    { code: 'OMR', label: 'OMR' },
    { code: 'SAR', label: 'SAR' },
  ];

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-6 z-50 px-4 sm:px-6 mb-8"
      id="main-report-header"
    >
      <div className="max-w-7xl mx-auto bg-white/85 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl px-4 sm:px-6 py-3.5 sm:py-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#1D1D1F] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
               <span className="text-[#4A2C5A] font-black text-sm bg-white/95 rounded-lg w-7 h-7 flex items-center justify-center font-mono">AB</span>
             </div>
             <div>
                <div className="flex items-center gap-2">
                  <span className="block text-base sm:text-lg font-extrabold text-[#1D1D1F] tracking-tight leading-none">Abraj Bousher</span>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider bg-[#4A2C5A]/10 text-[#4A2C5A] px-2.5 py-0.5 rounded-full font-mono">
                    Meta Paid Ads
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-gray-500">Aug 20 - Aug 29, 2026 · Performance Baseline</span>
             </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 ml-auto sm:ml-0">
            {/* Currency Flick Switcher */}
            <div className="flex items-center bg-gray-100/90 p-1 rounded-xl border border-gray-200/70 shadow-xs" id="currency-switcher">
              {currencies.map(({ code, label }) => (
                <button
                  key={code}
                  type="button"
                  id={`currency-btn-${code.toLowerCase()}`}
                  onClick={() => onCurrencyChange(code)}
                  className={`px-2.5 sm:px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all active:scale-95 cursor-pointer font-mono ${
                    currency === code
                      ? 'bg-white text-[#4A2C5A] shadow-xs ring-1 ring-black/5'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title={code === 'USD' ? 'US Dollar (1.00 USD)' : code === 'OMR' ? 'Omani Rial (1 USD = 0.38 OMR)' : 'Saudi Riyal (1 USD = 3.79 SAR)'}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-2 bg-emerald-50/80 border border-emerald-200/60 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-800 font-mono">First Reporting Period</span>
            </div>

            <button 
              onClick={onToggleLanguage}
              id="language-toggle-btn"
              className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#1D1D1F] bg-gray-100 hover:bg-gray-200/80 rounded-xl transition-all active:scale-95 border border-gray-200/60 shadow-xs cursor-pointer"
            >
              العربية
            </button>
          </div>
      </div>
    </motion.header>
  );
};

export default Header;

