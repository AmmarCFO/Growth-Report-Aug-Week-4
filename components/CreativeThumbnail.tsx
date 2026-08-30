import React, { useState } from 'react';
import { Play, Film, Image as ImageIcon, Sparkles, ExternalLink } from 'lucide-react';
import { AbrajCreativeItem } from '../types';

interface CreativeThumbnailProps {
  creative: AbrajCreativeItem;
  onClick: () => void;
  isArabic?: boolean;
}

export const CreativeThumbnail: React.FC<CreativeThumbnailProps> = ({
  creative,
  onClick,
  isArabic = false
}) => {
  const [imgError, setImgError] = useState(false);
  const [useFallbackUrl, setUseFallbackUrl] = useState(false);

  const fileId = creative.driveFileId;
  const primaryThumb = fileId ? `https://lh3.googleusercontent.com/d/${fileId}=w800` : null;
  const fallbackThumb = fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w800` : null;

  const currentThumbUrl = useFallbackUrl ? fallbackThumb : primaryThumb;

  const handleImageError = () => {
    if (!useFallbackUrl && fallbackThumb) {
      setUseFallbackUrl(true);
    } else {
      setImgError(true);
    }
  };

  const isVideo = creative.format === 'Video';

  return (
    <div
      onClick={onClick}
      className="relative w-full aspect-video sm:aspect-[16/10] rounded-xl overflow-hidden bg-gray-900 border border-gray-200/80 shadow-xs cursor-pointer group select-none transition-all duration-200 hover:shadow-md hover:border-purple-400"
      title={isArabic ? 'انقر لتشغيل ومعاينة الإعلان' : 'Click to play and preview creative'}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Thumbnail Image or Visual Fallback */}
      {currentThumbUrl && !imgError ? (
        <img
          src={currentThumbUrl}
          alt={creative.name}
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-[#2A1635] p-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center justify-center text-white mb-2 shadow-inner group-hover:scale-110 transition-transform">
            {isVideo ? <Film className="w-6 h-6 text-purple-300" /> : <ImageIcon className="w-6 h-6 text-sky-300" />}
          </div>
          <span className="text-[11px] font-bold text-gray-200 tracking-wide">
            {isArabic ? creative.nameAr : creative.name}
          </span>
          <span className="text-[10px] text-gray-400 font-mono mt-0.5">
            {isVideo ? (isArabic ? 'إعلان فيديو' : 'Video Creative') : (isArabic ? 'كاروسيل صور' : 'Image Carousel')}
          </span>
        </div>
      )}

      {/* Dark overlay with soft gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* Format & Campaign badge overlay top-left */}
      <div className={`absolute top-2.5 ${isArabic ? 'right-2.5' : 'left-2.5'} flex items-center gap-1.5 z-10`}>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold font-mono text-white border border-white/15 shadow-xs">
          {isVideo ? <Film className="w-2.5 h-2.5 text-purple-400" /> : <ImageIcon className="w-2.5 h-2.5 text-sky-400" />}
          {creative.format}
        </span>
      </div>

      {/* Center Interactive Play / View Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#4A2C5A]/90 hover:bg-[#3B2248] text-white flex items-center justify-center shadow-lg border border-white/25 transform transition-all duration-300 group-hover:scale-115 group-hover:bg-purple-600">
          {isVideo ? (
            <Play className={`w-5 h-5 sm:w-6 sm:h-6 fill-current ${isArabic ? '-scale-x-100 mr-0.5' : 'ml-0.5'}`} />
          ) : (
            <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </div>
      </div>

      {/* Bottom Bar: Action Pill */}
      <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between z-10">
        <span className="text-[11px] font-bold text-white drop-shadow-sm flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>{isVideo ? (isArabic ? 'تشغيل الفيديو' : 'Play Video') : (isArabic ? 'استعراض الإعلان' : 'Preview Carousel')}</span>
        </span>

        <span className="text-[10px] font-mono text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 px-1.5 py-0.5 rounded">
          {isArabic ? 'تكبير / تشغيل' : 'Click to open'}
        </span>
      </div>
    </div>
  );
};
