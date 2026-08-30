import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Play, Film, Image as ImageIcon, Sparkles } from 'lucide-react';
import { AbrajCreativeItem, Currency } from '../types';
import { formatMoney } from '../currency';

interface CreativePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  creative: AbrajCreativeItem | null;
  currency: Currency;
  isArabic?: boolean;
}

export const CreativePreviewModal: React.FC<CreativePreviewModalProps> = ({
  isOpen,
  onClose,
  creative,
  currency,
  isArabic = false
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !creative) return null;

  const embedUrl = creative.driveFileId 
    ? `https://drive.google.com/file/d/${creative.driveFileId}/preview`
    : creative.driveUrl;

  const getStatusBadge = () => {
    switch (creative.badgeType) {
      case 'winner':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {isArabic ? creative.statusAr : creative.status}
          </span>
        );
      case 'promising':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
            {isArabic ? creative.statusAr : creative.status}
          </span>
        );
      case 'pause':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
            {isArabic ? creative.statusAr : creative.status}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            {isArabic ? creative.statusAr : creative.status}
          </span>
        );
    }
  };

  return (
    <AnimatePresence>
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md ${isArabic ? 'font-cairo' : ''}`}
        onClick={onClose}
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-gray-800 bg-gray-950/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-900/40 border border-purple-700/50 flex items-center justify-center text-purple-300">
                {creative.format === 'Video' ? <Film className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                    {isArabic ? creative.campaignAr : creative.campaign}
                  </span>
                  <span className="text-gray-600">·</span>
                  <span className="text-[11px] font-mono text-purple-400 font-semibold">
                    {creative.format}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  {isArabic ? creative.nameAr : creative.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                {getStatusBadge()}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                title={isArabic ? 'إغلاق' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Media Player Container */}
          <div className="relative bg-black w-full flex items-center justify-center min-h-[360px] sm:min-h-[460px] max-h-[68vh]">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={creative.name}
                className="w-full h-[380px] sm:h-[480px] border-0 rounded-none"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className="p-8 text-center text-gray-400 space-y-3">
                <div className="w-14 h-14 rounded-full bg-gray-800/80 mx-auto flex items-center justify-center text-gray-500">
                  <Sparkles className="w-7 h-7" />
                </div>
                <p className="text-sm font-medium">
                  {isArabic 
                    ? 'رابط المشاهدة لهذا الإعلان قيد التجهيز.' 
                    : 'Preview link for this creative is being processed.'}
                </p>
              </div>
            )}
          </div>

          {/* Footer & KPI summary */}
          <div className="p-5 sm:p-6 bg-gray-950 border-t border-gray-800 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">
                  {isArabic ? 'الإنفاق الإعلاني' : 'Spend'}
                </span>
                <span className="text-base font-extrabold text-white font-mono">
                  {formatMoney(creative.spend, currency)}
                </span>
              </div>

              <div className="bg-gray-900/90 border border-purple-900/40 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-purple-400 uppercase font-bold block">
                  {isArabic ? 'العملاء المحتملين' : 'Leads'}
                </span>
                <span className="text-base font-black text-purple-300 font-mono">
                  {creative.leads}
                </span>
              </div>

              <div className="bg-gray-900/90 border border-emerald-900/40 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">
                  {isArabic ? 'تكلفة العميل (CPL)' : 'Cost Per Lead'}
                </span>
                <span className="text-base font-extrabold text-emerald-400 font-mono">
                  {formatMoney(creative.cpl, currency)}
                </span>
              </div>

              <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">
                  {creative.ctr ? 'CTR / CPC' : (isArabic ? 'الحالة' : 'Status')}
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-200 font-mono">
                  {creative.ctr ? `${creative.ctr.toFixed(2)}% · ${formatMoney(creative.cpc || 0, currency)}` : (isArabic ? creative.statusAr : creative.status)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
              <p className="text-xs text-gray-300 leading-relaxed font-medium">
                <strong className="text-white font-bold">{isArabic ? 'الرؤية التحليلية: ' : 'Insight: '}</strong>
                {isArabic ? (creative.keyInsightAr || creative.keyInsight || 'إعلان نشط قيد المتابعة والتقييم المستمر.') : (creative.keyInsight || 'Active creative asset under ongoing monitoring and evaluation.')}
              </p>

              {creative.driveUrl && (
                <a
                  href={creative.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors shrink-0 cursor-pointer shadow-sm"
                >
                  <span>{isArabic ? 'فتح في Google Drive' : 'Open in Drive'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
