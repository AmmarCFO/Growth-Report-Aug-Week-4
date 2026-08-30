import React, { useState, useMemo } from 'react';
import Header_ar from './components/Header_ar';
import { CreativePreviewModal } from './components/CreativePreviewModal';
import { CreativeThumbnail } from './components/CreativeThumbnail';
import { motion } from 'framer-motion';
import { Play, Film, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { 
    ResponsiveContainer,
    Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
    Line, ComposedChart
} from 'recharts';
import { 
    AlMuznDailyPoint,
    AbrajCreativeItem,
    CreativeClassification,
    Currency
} from './types';
import { formatMoney, CURRENCY_RATES } from './currency';

// Animation variants matching existing visual system
const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
    }
};

// ==========================================
// REAL DATA DEFINITIONS (20 - 29 AUG 2026)
// ==========================================

const AL_MUZN_DAILY_DATA_AR: AlMuznDailyPoint[] = [
    { date: '20 أغسطس', dayLabel: '20 أغسطس', spend: 6.27, leads: 7, cpl: 0.90 },
    { date: '21 أغسطس', dayLabel: '21 أغسطس', spend: 26.08, leads: 30, cpl: 0.87 },
    { date: '22 أغسطس', dayLabel: '22 أغسطس', spend: 23.38, leads: 25, cpl: 0.94 },
    { date: '23 أغسطس', dayLabel: '23 أغسطس', spend: 24.20, leads: 20, cpl: 1.21 },
    { date: '24 أغسطس', dayLabel: '24 أغسطس', spend: 32.20, leads: 16, cpl: 2.01 },
    { date: '25 أغسطس', dayLabel: '25 أغسطس', spend: 23.92, leads: 20, cpl: 1.20 },
    { date: '26 أغسطس', dayLabel: '26 أغسطس', spend: 23.74, leads: 21, cpl: 1.13 },
    { date: '27 أغسطس', dayLabel: '27 أغسطس', spend: 31.21, leads: 33, cpl: 0.95 },
    { date: '28 أغسطس', dayLabel: '28 أغسطس', spend: 22.29, leads: 28, cpl: 0.80 },
    { date: '29 أغسطس', dayLabel: '29 أغسطس (يوم جزئي)', spend: 15.97, leads: 17, cpl: 0.94, isPartial: true },
];

const AL_KHOUDH_DAILY_DATA_AR: AlMuznDailyPoint[] = [
    { date: '20 أغسطس', dayLabel: '20 أغسطس', spend: 3.10, leads: 6, cpl: 0.52 },
    { date: '21 أغسطس', dayLabel: '21 أغسطس', spend: 28.31, leads: 19, cpl: 1.49 },
    { date: '22 أغسطس', dayLabel: '22 أغسطس', spend: 26.29, leads: 17, cpl: 1.55 },
    { date: '23 أغسطس', dayLabel: '23 أغسطس', spend: 29.31, leads: 23, cpl: 1.27 },
    { date: '24 أغسطس', dayLabel: '24 أغسطس', spend: 30.94, leads: 20, cpl: 1.55 },
    { date: '25 أغسطس', dayLabel: '25 أغسطس', spend: 28.10, leads: 33, cpl: 0.85 },
    { date: '26 أغسطس', dayLabel: '26 أغسطس', spend: 15.86, leads: 14, cpl: 1.13 },
    { date: '27 أغسطس', dayLabel: '27 أغسطس', spend: 26.60, leads: 24, cpl: 1.11 },
    { date: '28 أغسطس', dayLabel: '28 أغسطس', spend: 20.76, leads: 18, cpl: 1.15 },
    { date: '29 أغسطس', dayLabel: '29 أغسطس (جزئي)', spend: 30.43, leads: 18, cpl: 1.69, isPartial: true },
];

const AL_MUZN_CREATIVES_AR: AbrajCreativeItem[] = [
    {
        id: 'muzn-3d-video',
        name: '3D Video Ad',
        nameAr: 'إعلان الفيديو ثلاثي الأبعاد (3D)',
        campaign: 'Al Muzn 2',
        campaignAr: 'المزن 2',
        format: 'Video',
        spend: 166.24,
        leads: 166,
        cpl: 1.00,
        status: 'Established Winner / Control',
        statusAr: 'فائز معتمد / إعلان التحكم الأساسي',
        keyInsight: 'This is currently the strongest proven high-volume creative in the Al Muzn campaign.',
        keyInsightAr: 'أقوى إعلان مثبت ومستقر بحجم تحويلات عالٍ في حملة المزن.',
        badgeType: 'winner',
        driveUrl: 'https://drive.google.com/file/d/1SXPwV2i3v3SqFJ9Fbxbsu2nuz6F1MCfM/view?usp=sharing',
        driveFileId: '1SXPwV2i3v3SqFJ9Fbxbsu2nuz6F1MCfM'
    },
    {
        id: 'muzn-al-diyar',
        name: 'Al Diyar Inspired Ad',
        nameAr: 'إعلان مستوحى من الديار',
        campaign: 'Al Muzn 2',
        campaignAr: 'المزن 2',
        format: 'Video',
        launchDate: '27 أغسطس 2026',
        spend: 39.53,
        leads: 34,
        cpl: 1.16,
        status: 'Promising / Continue Testing',
        statusAr: 'واعد / استمرار الاختبار',
        keyInsight: 'Strong early performance, but it has only been running since August 27 and needs more delivery before a final decision.',
        keyInsightAr: 'أداء أولي قوي، لكنه يعمل منذ 27 أغسطس فقط ويحتاج مزيداً من الظهور قبل اتخاذ قرار نهائي.',
        badgeType: 'promising',
        driveUrl: 'https://drive.google.com/file/d/1gkAcEnbp5-yyseVC57ZsHaIMP78cljbe/view?usp=sharing',
        driveFileId: '1gkAcEnbp5-yyseVC57ZsHaIMP78cljbe'
    },
    {
        id: 'muzn-carousel',
        name: 'Carousel Image Ad',
        nameAr: 'إعلان ألبوم الصور (كاروسيل)',
        campaign: 'Al Muzn 2',
        campaignAr: 'المزن 2',
        format: 'Image Carousel',
        launchDate: '20 أغسطس 2026',
        spend: 15.54,
        leads: 11,
        cpl: 1.41,
        status: 'Monitor',
        statusAr: 'متابعة ومراقبة',
        badgeType: 'monitor',
        driveUrl: 'https://drive.google.com/file/d/10XaGq_7QS0mgne4uukUiBJvwkwEik89U/view?usp=sharing',
        driveFileId: '10XaGq_7QS0mgne4uukUiBJvwkwEik89U'
    },
    {
        id: 'muzn-retal',
        name: 'Retal Inspired Ad',
        nameAr: 'إعلان مستوحى من ريتال',
        campaign: 'Al Muzn 2',
        campaignAr: 'المزن 2',
        format: 'Video',
        launchDate: '27 أغسطس 2026',
        spend: 7.95,
        leads: 6,
        cpl: 1.33,
        status: 'Early Testing',
        statusAr: 'مرحلة اختبار مبكرة',
        keyInsight: 'Spend is still too low for a meaningful decision.',
        keyInsightAr: 'الإنفاق لا يزال منخفضاً للغاية لاتخاذ قرار دقيق.',
        badgeType: 'testing',
        driveUrl: 'https://drive.google.com/file/d/1pi-XK5CSCHr6QRzhx56zSgEmr_Mmqc0S/view?usp=sharing',
        driveFileId: '1pi-XK5CSCHr6QRzhx56zSgEmr_Mmqc0S'
    }
];

const AL_KHOUDH_CREATIVES_AR: AbrajCreativeItem[] = [
    {
        id: 'khoudh-dark-caption',
        name: 'Influencer Video - Darker Captions',
        nameAr: 'فيديو المؤثر - نصوص داكنة',
        campaign: 'Al Khoudh Villa',
        campaignAr: 'فيلا الخوض',
        format: 'Video',
        spend: 75.44,
        leads: 73,
        cpl: 1.03,
        status: 'Winner / Prioritize',
        statusAr: 'فائز / أولوية التشغيل',
        keyInsight: 'Strongest Al Khoudh video creative by CPL.',
        keyInsightAr: 'أقوى إعلان فيديو في فيلا الخوض من حيث كفاءة تكلفة العميل المحتمل.',
        badgeType: 'winner',
        driveUrl: 'https://drive.google.com/file/d/1_ZZ_bjpiyOga9sATMT6TWWeFP22r9ahf/view?usp=sharing',
        driveFileId: '1_ZZ_bjpiyOga9sATMT6TWWeFP22r9ahf'
    },
    {
        id: 'khoudh-music-video',
        name: 'Music Video',
        nameAr: 'فيديو بموسيقى',
        campaign: 'Al Khoudh Villa',
        campaignAr: 'فيلا الخوض',
        format: 'Video',
        spend: 46.80,
        leads: 44,
        cpl: 1.06,
        status: 'Strong',
        statusAr: 'قوي ومستقر',
        badgeType: 'winner'
    },
    {
        id: 'khoudh-carousel',
        name: 'Image Carousel',
        nameAr: 'ألبوم الصور (كاروسيل)',
        campaign: 'Al Khoudh Villa',
        campaignAr: 'فيلا الخوض',
        format: 'Image Carousel',
        spend: 79.72,
        leads: 58,
        cpl: 1.37,
        ctr: 3.00,
        cpc: 0.12,
        cpm: 3.74,
        status: 'Strong Traffic Generator',
        statusAr: 'محرك زيارات قوي',
        keyInsight: 'Not the lowest CPL creative, but highly efficient at generating clicks (3.00% CTR).',
        keyInsightAr: 'ليس الأقل تكلفة للعميل، لكنه فائق الكفاءة في توليد النقرات (معدل النقر 3.00%).',
        badgeType: 'promising',
        driveUrl: 'https://drive.google.com/file/d/1Qaj4pS8yI6HCG919BYyzUtegxTii_bJ9/view?usp=sharing',
        driveFileId: '1Qaj4pS8yI6HCG919BYyzUtegxTii_bJ9'
    },
    {
        id: 'khoudh-ai-video',
        name: 'AI Generated Video',
        nameAr: 'فيديو الذكاء الاصطناعي (AI)',
        campaign: 'Al Khoudh Villa',
        campaignAr: 'فيلا الخوض',
        format: 'Video',
        spend: 16.39,
        leads: 11,
        cpl: 1.49,
        status: 'Monitor',
        statusAr: 'متابعة ومراقبة',
        badgeType: 'monitor',
        driveUrl: 'https://drive.google.com/file/d/18EcMqzfRG8_ylw0XEaZ7j1q1RD5-xky8/view?usp=sharing',
        driveFileId: '18EcMqzfRG8_ylw0XEaZ7j1q1RD5-xky8'
    },
    {
        id: 'khoudh-light-caption',
        name: 'Influencer Video - Lighter Captions',
        nameAr: 'فيديو المؤثر - نصوص فاتحة',
        campaign: 'Al Khoudh Villa',
        campaignAr: 'فيلا الخوض',
        format: 'Video',
        spend: 14.44,
        leads: 4,
        cpl: 3.61,
        status: 'Pause / Reduce Candidate',
        statusAr: 'مرشح للإيقاف / تقليص الإنفاق',
        keyInsight: 'This is currently the weakest Al Khoudh creative with elevated acquisition costs.',
        keyInsightAr: 'أضعف إعلانات فيلا الخوض حالياً بتكلفة عميل مرتفعة.',
        badgeType: 'pause',
        driveUrl: 'https://drive.google.com/file/d/19WjnmDrUKd7iI9Sn_UQDOPKl7HWlgUHd/view?usp=sharing',
        driveFileId: '19WjnmDrUKd7iI9Sn_UQDOPKl7HWlgUHd'
    }
];

interface AppArProps {
    currency: Currency;
    onCurrencyChange: (currency: Currency) => void;
    onToggleLanguage: () => void;
}

const App_ar: React.FC<AppArProps> = ({ currency, onCurrencyChange, onToggleLanguage }) => {
    const [selectedTrendView, setSelectedTrendView] = useState<'all' | 'leads' | 'cpl'>('all');
    const [selectedKhoudhTrendView, setSelectedKhoudhTrendView] = useState<'all' | 'leads' | 'cpl'>('all');
    const [selectedCreativeForPreview, setSelectedCreativeForPreview] = useState<AbrajCreativeItem | null>(null);

    // Chart daily data converted to active currency for Al Muzn 2
    const dailyChartData = useMemo(() => {
        return AL_MUZN_DAILY_DATA_AR.map(d => ({
            ...d,
            convertedSpend: Number((d.spend * CURRENCY_RATES[currency]).toFixed(2)),
            convertedCpl: Number((d.cpl * CURRENCY_RATES[currency]).toFixed(2)),
        }));
    }, [currency]);

    const maxChartCpl = useMemo(() => {
        const peak = Math.max(...dailyChartData.map(d => d.convertedCpl));
        return Math.ceil(peak * 1.25 * 10) / 10;
    }, [dailyChartData]);

    // Chart daily data converted to active currency for Al Khoudh Villa
    const dailyKhoudhChartData = useMemo(() => {
        return AL_KHOUDH_DAILY_DATA_AR.map(d => ({
            ...d,
            convertedSpend: Number((d.spend * CURRENCY_RATES[currency]).toFixed(2)),
            convertedCpl: Number((d.cpl * CURRENCY_RATES[currency]).toFixed(2)),
        }));
    }, [currency]);

    const maxKhoudhChartCpl = useMemo(() => {
        const peak = Math.max(...dailyKhoudhChartData.map(d => d.convertedCpl));
        return Math.ceil(peak * 1.25 * 10) / 10;
    }, [dailyKhoudhChartData]);

    const getClassificationBadge = (cls: CreativeClassification) => {
        switch(cls) {
            case 'Established Winner / Control':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 border border-emerald-300/60 font-cairo">فائز معتمد / أساسي</span>;
            case 'Winner / Prioritize':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 border border-emerald-300/60 font-cairo">فائز / أولوية قصوى</span>;
            case 'Promising / Continue Testing':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 font-cairo">واعد / استمرار الاختبار</span>;
            case 'Strong':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 font-cairo">قوي ومستقر</span>;
            case 'Strong Traffic Generator':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200 font-cairo">محرك زيارات</span>;
            case 'Early Testing':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200 font-cairo">اختبار أولي</span>;
            case 'Monitor':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 font-cairo">مراقبة</span>;
            case 'Pause / Reduce Candidate':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 font-cairo">مرشح للإيقاف</span>;
            default:
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 font-cairo">نشط</span>;
        }
    };

    return (
        <div className="min-h-screen pb-24 selection:bg-[#4A2C5A] selection:text-white bg-[#F5F5F7] font-cairo antialiased text-[#1D1D1F]" dir="rtl">
            <Header_ar 
                currency={currency}
                onCurrencyChange={onCurrencyChange}
                onToggleLanguage={onToggleLanguage} 
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                
                {/* Hero / Report Title Block */}
                <div className="mb-4">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
                    >
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-extrabold tracking-widest text-[#4A2C5A] uppercase bg-[#4A2C5A]/10 px-3 py-1 rounded-full font-cairo">
                                    أبراج بوشر
                                </span>
                                <span className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-0.5 rounded-full font-cairo">
                                    20 أغسطس - 29 أغسطس 2026
                                </span>
                                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full font-cairo">
                                    فترة التقرير الأولى
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-950 tracking-tight mt-3">
                                تقرير أداء <span className="text-[#4A2C5A]">إعلانات ميتا المدفوعة</span>
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 font-medium mt-2 max-w-3xl leading-relaxed">
                                الهدف الرئيسي: توليد عملاء محتملين عبر الواتساب بكفاءة من خلال إعلانات ميتا المدفوعة. يقيّم هذا التقرير حجم الاستثمار الإعلاني، وعدد العملاء المحتملين، وكفاءة تكلفة الاكتساب، وأداء المواد الإعلانية عبر الحملات النشطة.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-white border border-gray-200/80 rounded-2xl px-4 py-3 shadow-xs self-start md:self-auto">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-cairo">تعريف العميل المحتمل</span>
                                <span className="text-xs font-bold text-gray-800 font-cairo">بدء محادثة رسائل جديدة</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ========================================================================= */}
                {/* 01. الملخص التنفيذي */}
                {/* ========================================================================= */}
                <motion.section 
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-[#1E1B24] border border-[#4A2C5A]/30 rounded-[2rem] p-6 sm:p-8 shadow-xl relative overflow-hidden text-white"
                    id="section-executive-overview"
                >
                    {/* Decorative ambient lighting */}
                    <div className="absolute top-0 left-0 w-80 h-80 bg-[#4A2C5A]/20 blur-3xl rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        {/* Section Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-md font-mono">
                                        01
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium font-cairo">ملخص المؤشرات الاستراتيجية</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5 font-cairo">الملخص التنفيذي للأداء</h2>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-xl font-cairo text-xs text-purple-200">
                                <span>ترتيب الأولوية:</span>
                                <strong className="text-white font-bold">الإنفاق &larr; العملاء المحتملين &larr; تكلفة العميل (CPL) &larr; معدل التحويل</strong>
                            </div>
                        </div>

                        {/* Top 4 Visually Prioritized KPIs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
                            {/* Metric 1: Total Spend */}
                            <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.08] transition-all">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-cairo">إجمالي الإنفاق</p>
                                    <span className="text-[10px] font-cairo text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">أولوية 1</span>
                                </div>
                                <p className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                                    {formatMoney(462.05, currency)}
                                </p>
                                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10 text-[11px] text-slate-400">
                                    <span>الميزانية اليومية:</span>
                                    <span className="font-mono text-purple-200 font-bold">{formatMoney(50.00, currency)} / يوم</span>
                                </div>
                            </div>

                            {/* Metric 2: Total Leads */}
                            <div className="bg-purple-950/30 border border-purple-500/30 rounded-2xl p-5 hover:bg-purple-950/40 transition-all">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-[11px] font-bold text-purple-300 uppercase tracking-wider font-cairo">إجمالي العملاء المحتملين</p>
                                    <span className="text-[10px] font-cairo text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">أولوية 2</span>
                                </div>
                                <p className="text-3xl sm:text-4xl font-extrabold text-purple-200 font-mono tracking-tight">407</p>
                                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-purple-500/20 text-[11px] text-purple-300">
                                    <span>مقياس العميل:</span>
                                    <span className="font-cairo text-white font-bold">بدء محادثات الرسائل</span>
                                </div>
                            </div>

                            {/* Metric 3: Blended CPL */}
                            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-5 hover:bg-emerald-950/40 transition-all">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-cairo">متوسط تكلفة العميل (CPL)</p>
                                    <span className="text-[10px] font-cairo text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">أولوية 3</span>
                                </div>
                                <p className="text-3xl sm:text-4xl font-extrabold text-emerald-300 font-mono tracking-tight">
                                    {formatMoney(1.14, currency)}
                                </p>
                                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-emerald-500/20 text-[11px] text-emerald-400">
                                    <span>تكلفة المحادثة:</span>
                                    <span className="font-cairo text-white font-bold">خط أساس تكلفة الفترة الأولى</span>
                                </div>
                            </div>

                            {/* Metric 4: Click-to-Lead Rate */}
                            <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.08] transition-all">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-[11px] font-bold text-sky-400 uppercase tracking-wider font-cairo">تحويل النقرة إلى عميل</p>
                                    <span className="text-[10px] font-cairo text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded">أولوية 4</span>
                                </div>
                                <p className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">25.0%</p>
                                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10 text-[11px] text-slate-400">
                                    <span>معادلة التحويل:</span>
                                    <span className="font-mono text-sky-300 font-bold">محادثات الرسائل / نقرات الرابط</span>
                                </div>
                            </div>
                        </div>

                        {/* Supporting Metrics Bar */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 mb-5">
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-cairo">
                                    مؤشرات التشخيص المساندة (مستوى الحساب الإعلاني)
                                </span>
                                <span className="text-[10px] text-purple-300 font-cairo font-bold bg-purple-500/20 px-2 py-0.5 rounded">
                                    العملة المختارة: {currency} (1 USD = {CURRENCY_RATES[currency]} {currency})
                                </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
                                <div className="bg-black/20 rounded-xl p-2.5">
                                    <span className="text-[10px] text-slate-400 uppercase block font-semibold font-cairo">مرات الظهور</span>
                                    <span className="text-base font-bold text-white font-mono">91,539</span>
                                </div>
                                <div className="bg-black/20 rounded-xl p-2.5">
                                    <span className="text-[10px] text-slate-400 uppercase block font-semibold font-cairo">نقرات الرابط</span>
                                    <span className="text-base font-bold text-white font-mono">1,631</span>
                                </div>
                                <div className="bg-black/20 rounded-xl p-2.5">
                                    <span className="text-[10px] text-slate-400 uppercase block font-semibold font-cairo">معدل النقر (CTR)</span>
                                    <span className="text-base font-bold text-white font-mono">1.78%</span>
                                </div>
                                <div className="bg-black/20 rounded-xl p-2.5">
                                    <span className="text-[10px] text-slate-400 uppercase block font-semibold font-cairo">تكلفة النقرة (CPC)</span>
                                    <span className="text-base font-bold text-white font-mono">{formatMoney(0.28, currency)}</span>
                                </div>
                                <div className="bg-black/20 rounded-xl p-2.5">
                                    <span className="text-[10px] text-slate-400 uppercase block font-semibold font-cairo">تكلفة الألف ظهور (CPM)</span>
                                    <span className="text-base font-bold text-white font-mono">{formatMoney(5.05, currency)}</span>
                                </div>
                                <div className="bg-black/20 rounded-xl p-2.5">
                                    <span className="text-[10px] text-slate-400 uppercase block font-semibold font-cairo">الحملات النشطة</span>
                                    <span className="text-base font-bold text-purple-300 font-cairo">2 (مجموعتان إعلانيتان)</span>
                                </div>
                                <div className="bg-black/20 rounded-xl p-2.5 col-span-2 sm:col-span-1">
                                    <span className="text-[10px] text-slate-400 uppercase block font-semibold font-cairo">المواد الإعلانية</span>
                                    <span className="text-base font-bold text-emerald-300 font-mono">9 Creatives</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ========================================================================= */}
                {/* 02. مقارنة أداء الحملات */}
                {/* ========================================================================= */}
                <motion.section 
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white border border-gray-200/70 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-6"
                    id="section-campaign-performance"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4A2C5A] bg-[#4A2C5A]/10 px-2.5 py-0.5 rounded-md font-mono">
                                    02
                                </span>
                                <span className="text-xs text-gray-500 font-semibold font-cairo">مقارنة تفصيلية بين الحملتين النشطتين</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950 mt-1 font-cairo">أداء الحملات الإعلانية</h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-cairo">
                                تقييم كفاءة مسار التحويل الكامل بين حملة المزن 2 وحملة فيلا الخوض.
                            </p>
                        </div>
                        <div className="text-xs font-mono text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl font-cairo">
                            إجمالي الميزانية اليومية: <strong>{formatMoney(50, currency)}/يوم ({formatMoney(25, currency)} + {formatMoney(25, currency)})</strong>
                        </div>
                    </div>

                    {/* Side-by-Side Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Campaign 1: Al Muzn 2 */}
                        <div className="bg-gradient-to-b from-purple-50/50 via-white to-white border-2 border-purple-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-extrabold uppercase tracking-widest text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-md font-cairo">
                                                الحملة الأولى
                                            </span>
                                            <span className="text-xs font-bold text-gray-400 font-mono">{formatMoney(25, currency)}/يوم · مجموعة إعلانية 1</span>
                                        </div>
                                        <h3 className="text-2xl font-extrabold text-gray-950 mt-1.5 font-cairo">المزن 2</h3>
                                        <p className="text-xs text-purple-700 font-semibold font-cairo mt-0.5">محرك التحويل واكتساب العملاء المحتملين</p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                                        58.0% تحويل
                                    </span>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-purple-100 mb-4">
                                    <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-2xs">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase block font-cairo">إجمالي الإنفاق</span>
                                        <span className="text-lg font-extrabold text-gray-950 font-mono">{formatMoney(229.26, currency)}</span>
                                    </div>
                                    <div className="bg-white border border-purple-100 rounded-xl p-3 text-center shadow-2xs">
                                        <span className="text-[10px] font-bold text-purple-700 uppercase block font-cairo">العملاء المحتملين</span>
                                        <span className="text-lg font-black text-[#4A2C5A] font-mono">217</span>
                                    </div>
                                    <div className="bg-white border border-emerald-100 rounded-xl p-3 text-center shadow-2xs">
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase block font-cairo">تكلفة العميل (CPL)</span>
                                        <span className="text-lg font-extrabold text-emerald-600 font-mono">{formatMoney(1.06, currency)}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs mb-4">
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <span className="text-[9px] text-gray-400 block font-semibold font-cairo">الظهور</span>
                                        <span className="font-bold text-gray-800 font-mono">41,066</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <span className="text-[9px] text-gray-400 block font-semibold font-cairo">النقرات</span>
                                        <span className="font-bold text-gray-800 font-mono">374</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <span className="text-[9px] text-gray-400 block font-semibold font-cairo">معدل النقر</span>
                                        <span className="font-bold text-gray-800 font-mono">0.91%</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <span className="text-[9px] text-gray-400 block font-semibold font-cairo">تكلفة النقرة</span>
                                        <span className="font-bold text-gray-800 font-mono">{formatMoney(0.61, currency)}</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2 col-span-3 sm:col-span-1">
                                        <span className="text-[9px] text-gray-400 block font-semibold font-cairo">الألف ظهور</span>
                                        <span className="font-bold text-gray-800 font-mono">{formatMoney(5.58, currency)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-100/50 border border-purple-200/60 rounded-xl p-3.5 text-xs text-purple-950 leading-relaxed font-medium font-cairo">
                                <strong>نقطة القوة الأساسية:</strong> حققت حجماً أعلى من العملاء المحتملين بتكلفة أقل للعميل ({formatMoney(1.06, currency)}) وبمعدل تحويل استثنائي من النقرة إلى عميل محتمل بلغ 58.0%.
                            </div>
                        </div>

                        {/* Campaign 2: Al Khoudh Villa */}
                        <div className="bg-gradient-to-b from-sky-50/50 via-white to-white border-2 border-sky-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-extrabold uppercase tracking-widest text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-md font-cairo">
                                                الحملة الثانية
                                            </span>
                                            <span className="text-xs font-bold text-gray-400 font-mono">{formatMoney(25, currency)}/يوم · مجموعة إعلانية 1</span>
                                        </div>
                                        <h3 className="text-2xl font-extrabold text-gray-950 mt-1.5 font-cairo">فيلا الخوض</h3>
                                        <p className="text-xs text-sky-700 font-semibold font-cairo mt-0.5">محرك توليد الزيارات والاهتمام العالي</p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-sky-50 text-sky-700 border border-sky-200 font-mono">
                                        1,257 نقرة
                                    </span>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-sky-100 mb-4">
                                    <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-2xs">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase block font-cairo">إجمالي الإنفاق</span>
                                        <span className="text-lg font-extrabold text-gray-950 font-mono">{formatMoney(232.79, currency)}</span>
                                    </div>
                                    <div className="bg-white border border-sky-100 rounded-xl p-3 text-center shadow-2xs">
                                        <span className="text-[10px] font-bold text-sky-700 uppercase block font-cairo">العملاء المحتملين</span>
                                        <span className="text-lg font-black text-sky-900 font-mono">190</span>
                                    </div>
                                    <div className="bg-white border border-sky-100 rounded-xl p-3 text-center shadow-2xs">
                                        <span className="text-[10px] font-bold text-sky-600 uppercase block font-cairo">تكلفة العميل (CPL)</span>
                                        <span className="text-lg font-extrabold text-sky-700 font-mono">{formatMoney(1.23, currency)}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs mb-4">
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <span className="text-[9px] text-gray-400 block font-semibold font-cairo">الظهور</span>
                                        <span className="font-bold text-gray-800 font-mono">50,473</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <span className="text-[9px] text-gray-400 block font-semibold font-cairo">النقرات</span>
                                        <span className="font-bold text-gray-800 font-mono">1,257</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <span className="text-[9px] text-gray-400 block font-semibold font-cairo">معدل النقر</span>
                                        <span className="font-bold text-emerald-600 font-mono">2.49%</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <span className="text-[9px] text-gray-400 block font-semibold font-cairo">تكلفة النقرة</span>
                                        <span className="font-bold text-emerald-600 font-mono">{formatMoney(0.19, currency)}</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2 col-span-3 sm:col-span-1">
                                        <span className="text-[9px] text-gray-400 block font-semibold font-cairo">الألف ظهور</span>
                                        <span className="font-bold text-gray-800 font-mono">{formatMoney(4.61, currency)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-sky-100/50 border border-sky-200/60 rounded-xl p-3.5 text-xs text-sky-950 leading-relaxed font-medium font-cairo">
                                <strong>نقطة القوة الأساسية:</strong> كفاءة فائقة في توليد الزيارات والنقرات بتكلفة منخفضة بلغت {formatMoney(0.19, currency)} للنقرة ومعدل نقر استثنائي 2.49%.
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ========================================================================= */}
                {/* 03. الاتجاه اليومي للعملاء وتكلفة الاكتساب */}
                {/* ========================================================================= */}
                <motion.section 
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white border border-gray-200/70 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-8"
                    id="section-daily-trends"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4A2C5A] bg-[#4A2C5A]/10 px-2.5 py-0.5 rounded-md font-mono">
                                    03
                                </span>
                                <span className="text-xs text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded font-cairo">
                                    الأداء اليومي التفصيلي لكل حملة
                                </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 mt-1 font-cairo">
                                الاتجاه اليومي للعملاء وتكلفة الاكتساب (CPL)
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-cairo">
                                تتبع الحجم اليومي للعملاء المحتملين ومقارنته بمنحنى تكلفة العميل ({currency}) على مدار فترة التقرير لكلا الحملتين.
                            </p>
                        </div>
                    </div>

                    {/* CAMPAIGN 1: AL MUZN 2 */}
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-purple-100/70">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#4A2C5A]" />
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-950 font-cairo">
                                        المزن 2 - الاتجاه اليومي للعملاء وتكلفة الاكتساب
                                    </h3>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 font-cairo">
                                    مؤشرات الحجم وتكلفة الاكتساب اليومية لحملة المزن 2 (20 – 29 أغسطس).
                                </p>
                            </div>
                            
                            {/* View Switcher Tabs */}
                            <div className="flex items-center bg-gray-100/80 p-1 rounded-xl border border-gray-200/50 self-start md:self-auto text-xs font-semibold font-cairo">
                                <button 
                                    onClick={() => setSelectedTrendView('all')}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedTrendView === 'all' ? 'bg-white text-[#4A2C5A] shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    العملاء والتكلفة
                                </button>
                                <button 
                                    onClick={() => setSelectedTrendView('leads')}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedTrendView === 'leads' ? 'bg-white text-[#4A2C5A] shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    حجم العملاء
                                </button>
                                <button 
                                    onClick={() => setSelectedTrendView('cpl')}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedTrendView === 'cpl' ? 'bg-white text-[#4A2C5A] shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    منحنى التكلفة (CPL)
                                </button>
                            </div>
                        </div>

                        {/* Chart Container */}
                        <div className="h-80 w-full pt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={dailyChartData} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F2" />
                                    <XAxis 
                                        dataKey="date" 
                                        tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 600, fontFamily: 'Cairo' }} 
                                        axisLine={{ stroke: '#E5E7EB' }} 
                                        tickLine={false} 
                                    />
                                    <YAxis 
                                        yAxisId="leads" 
                                        orientation="left" 
                                        tick={{ fill: '#4A2C5A', fontSize: 11, fontWeight: 700 }} 
                                        axisLine={false} 
                                        tickLine={false}
                                        domain={[0, 40]}
                                    />
                                    <YAxis 
                                        yAxisId="cpl" 
                                        orientation="right" 
                                        tick={{ fill: '#059669', fontSize: 11, fontWeight: 700 }} 
                                        axisLine={false} 
                                        tickLine={false}
                                        unit={currency === 'USD' ? '$' : ` ${currency}`}
                                        domain={[0, maxChartCpl]}
                                    />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#1E1B24', borderColor: '#4A2C5A', borderRadius: '14px', color: '#fff', fontSize: '12px', fontFamily: 'Cairo', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                                        formatter={(value: any, name: string) => {
                                            if (name.includes('CPL') || name.includes('تكلفة العميل')) return [`${value} ${currency}`, `تكلفة العميل المحتمل (${currency})`];
                                            if (name.includes('Spend') || name.includes('الإنفاق')) return [`${value} ${currency}`, `الإنفاق اليومي (${currency})`];
                                            return [`${value} عميل محتمل`, name];
                                        }}
                                        labelFormatter={(label) => `التاريخ: ${label}`}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px', fontFamily: 'Cairo' }} />
                                    
                                    {(selectedTrendView === 'all' || selectedTrendView === 'leads') && (
                                        <Bar 
                                            yAxisId="leads" 
                                            dataKey="leads" 
                                            name="العملاء المحتملين يومياً" 
                                            fill="#4A2C5A" 
                                            radius={[6, 6, 0, 0]} 
                                            maxBarSize={38} 
                                        />
                                    )}
                                    {(selectedTrendView === 'all' || selectedTrendView === 'cpl') && (
                                        <Line 
                                            yAxisId="cpl" 
                                            type="monotone" 
                                            dataKey="convertedCpl" 
                                            name={`تكلفة العميل (${currency})`} 
                                            stroke="#10B981" 
                                            strokeWidth={3.5} 
                                            dot={{ r: 5, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }} 
                                            activeDot={{ r: 7 }}
                                        />
                                    )}
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Partial Day Notice */}
                        <div className="flex items-center justify-between text-[11px] text-gray-500 font-cairo px-2">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                * يوم 29 أغسطس يمثل يوماً جزئياً للبيانات الإعلانية.
                            </span>
                            <span>الإنفاق والعملاء محسوبون حتى وقت استخراج التقرير</span>
                        </div>

                        {/* 3 Performance Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            {/* Card 1: Highest Lead Volume */}
                            <div className="bg-purple-50/60 border border-purple-200/80 rounded-2xl p-4 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 block font-cairo">
                                        أعلى حجم عملاء محتملين
                                    </span>
                                    <p className="text-2xl sm:text-3xl font-black text-[#4A2C5A] font-cairo mt-1">
                                        33 عميل
                                    </p>
                                </div>
                                <div className="pt-2 mt-2 border-t border-purple-200/50 flex items-center justify-between text-xs font-semibold text-purple-900 font-cairo">
                                    <span>تاريخ التسجيل:</span>
                                    <span className="font-bold">27 أغسطس</span>
                                </div>
                            </div>

                            {/* Card 2: Lowest CPL */}
                            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block font-cairo">
                                        أقل تكلفة للعميل (أعلى كفاءة)
                                    </span>
                                    <p className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono mt-1">
                                        {formatMoney(0.80, currency)}
                                    </p>
                                </div>
                                <div className="pt-2 mt-2 border-t border-emerald-200/50 flex items-center justify-between text-xs font-semibold text-emerald-900 font-cairo">
                                    <span>تاريخ التسجيل:</span>
                                    <span className="font-bold">28 أغسطس (28 عميل)</span>
                                </div>
                            </div>

                            {/* Card 3: Highest CPL */}
                            <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-4 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 block font-cairo">
                                        أعلى تكلفة للعميل
                                    </span>
                                    <p className="text-2xl sm:text-3xl font-black text-rose-600 font-mono mt-1">
                                        {formatMoney(2.01, currency)}
                                    </p>
                                </div>
                                <div className="pt-2 mt-2 border-t border-rose-200/50 flex items-center justify-between text-xs font-semibold text-rose-900 font-cairo">
                                    <span>تاريخ التسجيل:</span>
                                    <span className="font-bold">24 أغسطس (16 عميل)</span>
                                </div>
                            </div>
                        </div>

                        {/* Concise Insight Box */}
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium font-cairo">
                                <strong className="text-gray-950 font-bold">تحليل الاتجاه:</strong> ارتفعت تكلفة العميل في المزن 2 إلى {formatMoney(2.01, currency)} في 24 أغسطس قبل أن تعود للتحسن الملحوظ لتصل إلى {formatMoney(0.95, currency)} في 27 أغسطس ثم {formatMoney(0.80, currency)} في 28 أغسطس.
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200/80" />

                    {/* CAMPAIGN 2: AL KHOUDH VILLA */}
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-sky-100/70">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-950 font-cairo">
                                        فيلا الخوض - الاتجاه اليومي للعملاء وتكلفة الاكتساب
                                    </h3>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 font-cairo">
                                    مؤشرات الحجم وتكلفة الاكتساب اليومية لحملة فيلا الخوض (20 – 29 أغسطس).
                                </p>
                            </div>
                            
                            {/* View Switcher Tabs */}
                            <div className="flex items-center bg-gray-100/80 p-1 rounded-xl border border-gray-200/50 self-start md:self-auto text-xs font-semibold font-cairo">
                                <button 
                                    onClick={() => setSelectedKhoudhTrendView('all')}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedKhoudhTrendView === 'all' ? 'bg-white text-sky-800 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    العملاء والتكلفة
                                </button>
                                <button 
                                    onClick={() => setSelectedKhoudhTrendView('leads')}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedKhoudhTrendView === 'leads' ? 'bg-white text-sky-800 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    حجم العملاء
                                </button>
                                <button 
                                    onClick={() => setSelectedKhoudhTrendView('cpl')}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedKhoudhTrendView === 'cpl' ? 'bg-white text-sky-800 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    منحنى التكلفة (CPL)
                                </button>
                            </div>
                        </div>

                        {/* Chart Container */}
                        <div className="h-80 w-full pt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={dailyKhoudhChartData} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F2" />
                                    <XAxis 
                                        dataKey="date" 
                                        tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 600, fontFamily: 'Cairo' }} 
                                        axisLine={{ stroke: '#E5E7EB' }} 
                                        tickLine={false} 
                                    />
                                    <YAxis 
                                        yAxisId="leads" 
                                        orientation="left" 
                                        tick={{ fill: '#0369A1', fontSize: 11, fontWeight: 700 }} 
                                        axisLine={false} 
                                        tickLine={false}
                                        domain={[0, 40]}
                                    />
                                    <YAxis 
                                        yAxisId="cpl" 
                                        orientation="right" 
                                        tick={{ fill: '#059669', fontSize: 11, fontWeight: 700 }} 
                                        axisLine={false} 
                                        tickLine={false}
                                        unit={currency === 'USD' ? '$' : ` ${currency}`}
                                        domain={[0, maxKhoudhChartCpl]}
                                    />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#1E1B24', borderColor: '#0369A1', borderRadius: '14px', color: '#fff', fontSize: '12px', fontFamily: 'Cairo', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                                        formatter={(value: any, name: string) => {
                                            if (name.includes('CPL') || name.includes('تكلفة العميل')) return [`${value} ${currency}`, `تكلفة العميل المحتمل (${currency})`];
                                            if (name.includes('Spend') || name.includes('الإنفاق')) return [`${value} ${currency}`, `الإنفاق اليومي (${currency})`];
                                            return [`${value} عميل محتمل`, name];
                                        }}
                                        labelFormatter={(label) => `التاريخ: ${label}`}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px', fontFamily: 'Cairo' }} />
                                    
                                    {(selectedKhoudhTrendView === 'all' || selectedKhoudhTrendView === 'leads') && (
                                        <Bar 
                                            yAxisId="leads" 
                                            dataKey="leads" 
                                            name="العملاء المحتملين يومياً" 
                                            fill="#0284C7" 
                                            radius={[6, 6, 0, 0]} 
                                            maxBarSize={38} 
                                        />
                                    )}
                                    {(selectedKhoudhTrendView === 'all' || selectedKhoudhTrendView === 'cpl') && (
                                        <Line 
                                            yAxisId="cpl" 
                                            type="monotone" 
                                            dataKey="convertedCpl" 
                                            name={`تكلفة العميل (${currency})`} 
                                            stroke="#10B981" 
                                            strokeWidth={3.5} 
                                            dot={{ r: 5, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }} 
                                            activeDot={{ r: 7 }}
                                        />
                                    )}
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Partial Day Notice */}
                        <div className="flex items-center justify-between text-[11px] text-gray-500 font-cairo px-2">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                * يوم 29 أغسطس يمثل يوماً جزئياً للبيانات الإعلانية.
                            </span>
                            <span>الإنفاق والعملاء محسوبون حتى وقت استخراج التقرير</span>
                        </div>

                        {/* 3 Performance Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            {/* Card 1: Highest Lead Volume */}
                            <div className="bg-sky-50/60 border border-sky-200/80 rounded-2xl p-4 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 block font-cairo">
                                        أعلى حجم عملاء محتملين
                                    </span>
                                    <p className="text-2xl sm:text-3xl font-black text-sky-900 font-cairo mt-1">
                                        33 عميل
                                    </p>
                                </div>
                                <div className="pt-2 mt-2 border-t border-sky-200/50 flex items-center justify-between text-xs font-semibold text-sky-900 font-cairo">
                                    <span>تاريخ التسجيل:</span>
                                    <span className="font-bold">25 أغسطس</span>
                                </div>
                            </div>

                            {/* Card 2: Lowest CPL */}
                            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block font-cairo">
                                        أقل تكلفة للعميل (أعلى كفاءة)
                                    </span>
                                    <p className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono mt-1">
                                        {formatMoney(0.52, currency)}
                                    </p>
                                </div>
                                <div className="pt-2 mt-2 border-t border-emerald-200/50 flex items-center justify-between text-xs font-semibold text-emerald-900 font-cairo">
                                    <span>تاريخ التسجيل:</span>
                                    <span className="font-bold">20 أغسطس</span>
                                </div>
                            </div>

                            {/* Card 3: Highest CPL */}
                            <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-4 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 block font-cairo">
                                        أعلى تكلفة للعميل
                                    </span>
                                    <p className="text-2xl sm:text-3xl font-black text-rose-600 font-mono mt-1">
                                        {formatMoney(1.69, currency)}
                                    </p>
                                </div>
                                <div className="pt-2 mt-2 border-t border-rose-200/50 flex items-center justify-between text-xs font-semibold text-rose-900 font-cairo">
                                    <span>تاريخ التسجيل:</span>
                                    <span className="font-bold">29 أغسطس</span>
                                </div>
                            </div>
                        </div>

                        {/* Concise Insight Box & Subtle Note */}
                        <div className="space-y-2.5">
                            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium font-cairo">
                                    <strong className="text-gray-950 font-bold">تحليل الاتجاه:</strong> حققت فيلا الخوض أعلى حجم عملاء محتملين في 25 أغسطس بتوليد 33 عميلاً بتكلفة {formatMoney(0.85, currency)} للعميل. ارتفعت تكلفة العميل نحو نهاية الفترة لتصل إلى {formatMoney(1.69, currency)} في 29 أغسطس.
                                </p>
                            </div>
                            <div className="px-4 py-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-center gap-2 font-cairo">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                <span>
                                    <strong>ملاحظة:</strong> شهد يوم 20 أغسطس إنفاقاً منخفضاً جداً ({formatMoney(3.10, currency)})، لذا لا ينبغي اعتبار تكلفة العميل البالغة {formatMoney(0.52, currency)} مقياساً ناضجاً للأداء.
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ========================================================================= */}
                {/* 04. أداء المواد الإعلانية */}
                {/* ========================================================================= */}
                <motion.section 
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white border border-gray-200/70 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-8"
                    id="section-creative-performance"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4A2C5A] bg-[#4A2C5A]/10 px-2.5 py-0.5 rounded-md font-mono">
                                    04
                                </span>
                                <span className="text-xs text-purple-600 font-bold font-cairo">تقييم تفصيلي لـ 9 مواد إعلانية</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950 mt-1 font-cairo">
                                تحليل أداء المواد الإعلانية (Creatives)
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-cairo">
                                تفصيل أداء كل إعلان مقسماً حسب الحملة (المزن 2 وفيلا الخوض).
                            </p>
                        </div>
                    </div>

                    {/* Group 1: Al Muzn 2 Creatives */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#4A2C5A]" />
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 font-cairo">
                                    إعلانات المزن 2 (4 مواد إعلانية)
                                </h3>
                            </div>
                            <span className="text-xs font-cairo font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                                إجمالي العملاء: 217 · إنفاق {formatMoney(229.26, currency)}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {AL_MUZN_CREATIVES_AR.map((creative) => (
                                <div 
                                    key={creative.id} 
                                    className={`border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                                        creative.badgeType === 'winner' 
                                            ? 'bg-gradient-to-br from-purple-50/40 via-white to-white border-purple-300 shadow-sm' 
                                            : 'bg-gray-50/60 border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="space-y-3.5">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-extrabold uppercase bg-gray-900 text-white px-2 py-0.5 rounded font-cairo">
                                                        {creative.format === 'Video' ? 'فيديو' : 'ألبوم صور'}
                                                    </span>
                                                    {creative.launchDate && (
                                                        <span className="text-[10px] text-gray-500 font-cairo">
                                                            تاريخ الإطلاق: {creative.launchDate}
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="text-base font-bold text-gray-950 mt-1.5 font-cairo">
                                                    {creative.nameAr || creative.name}
                                                </h4>
                                            </div>
                                            {getClassificationBadge(creative.status)}
                                        </div>

                                        {/* Creative Thumbnail with Play / Preview Trigger */}
                                        <CreativeThumbnail
                                            creative={creative}
                                            onClick={() => setSelectedCreativeForPreview(creative)}
                                            isArabic={true}
                                        />

                                        {/* Metrics Row */}
                                        <div className="grid grid-cols-3 gap-2 bg-white border border-gray-200/70 rounded-xl p-3 text-center shadow-2xs">
                                            <div>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase block font-cairo">الإنفاق</span>
                                                <span className="text-sm font-bold text-gray-900 font-mono">{formatMoney(creative.spend, currency)}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase block font-cairo">العملاء</span>
                                                <span className="text-sm font-black text-[#4A2C5A] font-mono">{creative.leads}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase block font-cairo">تكلفة العميل</span>
                                                <span className="text-sm font-extrabold text-emerald-600 font-mono">{formatMoney(creative.cpl, currency)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        {creative.keyInsightAr ? (
                                            <div className="pt-2.5 border-t border-gray-100 text-xs text-gray-600 leading-snug font-cairo">
                                                <strong className="text-gray-800">ملاحظة الأداء:</strong> {creative.keyInsightAr}
                                            </div>
                                        ) : (
                                            <div className="pt-2.5 border-t border-gray-100 text-xs text-gray-500 font-cairo">
                                                الحالة: أداء مستقر وقيد المتابعة الدورية.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Group 2: Al Khoudh Villa Creatives */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between pb-2 border-b border-sky-100">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-sky-600" />
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 font-cairo">
                                    إعلانات فيلا الخوض (5 مواد إعلانية)
                                </h3>
                            </div>
                            <span className="text-xs font-cairo font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md">
                                إجمالي العملاء: 190 · إنفاق {formatMoney(232.79, currency)}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {AL_KHOUDH_CREATIVES_AR.map((creative) => (
                                <div 
                                    key={creative.id} 
                                    className={`border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                                        creative.badgeType === 'winner' 
                                            ? 'bg-gradient-to-br from-emerald-50/40 via-white to-white border-emerald-300 shadow-sm' 
                                            : creative.badgeType === 'pause'
                                            ? 'bg-rose-50/30 border-rose-200'
                                            : 'bg-gray-50/60 border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="text-[9px] font-extrabold uppercase bg-gray-900 text-white px-2 py-0.5 rounded font-cairo">
                                                {creative.format === 'Video' ? 'فيديو' : 'ألبوم صور'}
                                            </span>
                                            {getClassificationBadge(creative.status)}
                                        </div>
                                        <h4 className="text-sm sm:text-base font-bold text-gray-950 font-cairo">
                                            {creative.nameAr || creative.name}
                                        </h4>

                                        {/* Creative Thumbnail with Play / Preview Trigger */}
                                        <CreativeThumbnail
                                            creative={creative}
                                            onClick={() => setSelectedCreativeForPreview(creative)}
                                            isArabic={true}
                                        />

                                        {/* Metrics Row */}
                                        <div className="grid grid-cols-3 gap-2 bg-white border border-gray-200/70 rounded-xl p-3 text-center shadow-2xs">
                                            <div>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase block font-cairo">الإنفاق</span>
                                                <span className="text-xs sm:text-sm font-bold text-gray-900 font-mono">{formatMoney(creative.spend, currency)}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase block font-cairo">العملاء</span>
                                                <span className="text-xs sm:text-sm font-black text-[#4A2C5A] font-mono">{creative.leads}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase block font-cairo">تكلفة العميل</span>
                                                <span className={`text-xs sm:text-sm font-extrabold font-mono ${creative.cpl > 2 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                    {formatMoney(creative.cpl, currency)}
                                                </span>
                                            </div>
                                        </div>

                                        {creative.ctr && (
                                            <div className="grid grid-cols-3 gap-1 text-center text-[10px] font-mono text-gray-600 bg-gray-100/70 rounded-lg py-1.5">
                                                <div>CTR: <strong className="text-gray-900">{creative.ctr.toFixed(2)}%</strong></div>
                                                <div>CPC: <strong className="text-gray-900">{creative.cpc ? formatMoney(creative.cpc, currency) : '-'}</strong></div>
                                                <div>CPM: <strong className="text-gray-900">{creative.cpm ? formatMoney(creative.cpm, currency) : '-'}</strong></div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-2">
                                        {creative.keyInsightAr && (
                                            <div className="pt-2 border-t border-gray-100 text-xs text-gray-600 leading-snug font-cairo">
                                                <strong className="text-gray-800">ملاحظة:</strong> {creative.keyInsightAr}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* ========================================================================= */}
                {/* 05. الدروس المستفادة من اختبار المواد الإعلانية */}
                {/* ========================================================================= */}
                <motion.section 
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white border border-gray-200/70 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-6"
                    id="section-creative-test-learnings"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4A2C5A] bg-[#4A2C5A]/10 px-2.5 py-0.5 rounded-md font-mono">
                                    05
                                </span>
                                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded font-cairo">
                                    استخلاص النتائج الإبداعية
                                </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 mt-1 font-cairo">
                                الدروس المستفادة من اختبار المواد الإعلانية
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-cairo">
                                ما توضحه بيانات الأداء الأولية حول أشكال الإعلانات، والرسائل التسويقية، واستجابة الجمهور.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Learning 1 */}
                        <div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-cairo">
                                        الإعلان الأساسي
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                        166 عميل · {formatMoney(1.00, currency)} CPL
                                    </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug font-cairo">
                                    فيديو 3D لمشروع المزن هو الإعلان الضابط الأساسي
                                </h4>
                                <p className="text-xs text-gray-600 mt-2 leading-relaxed font-cairo">
                                    يظل فيديو المزن ثلاثي الأبعاد الإعلان الأساسي الأكثر استقراراً، محققاً 166 عميلاً محتملاً بتكلفة تقارب {formatMoney(1.00, currency)} للعميل.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-cairo text-gray-400">
                                ملاحظة أداء #1
                            </div>
                        </div>

                        {/* Learning 2 */}
                        <div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-cairo">
                                        انطلاقة واعدة
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                        34 عميل · {formatMoney(1.16, currency)} CPL
                                    </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug font-cairo">
                                    إعلان الديار يُظهر مؤشرات أولية قوية
                                </h4>
                                <p className="text-xs text-gray-600 mt-2 leading-relaxed font-cairo">
                                    أظهر الإعلان المستوحى من الديار أداءً مبكراً واعداً بتحقيق 34 عميلاً محتملاً بتكلفة تقارب {formatMoney(1.16, currency)} على الرغم من إطلاقه في 27 أغسطس فقط.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-cairo text-gray-400">
                                ملاحظة أداء #2
                            </div>
                        </div>

                        {/* Learning 3 */}
                        <div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-cairo">
                                        مرحلة اختبار
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                        إنفاق {formatMoney(7.95, currency)} · 6 عملاء
                                    </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug font-cairo">
                                    إعلان ريتال يحتاج مزيداً من بيانات الظهور
                                </h4>
                                <p className="text-xs text-gray-600 mt-2 leading-relaxed font-cairo">
                                    لا يزال الإنفاق على إعلان ريتال محدوداً جداً ({formatMoney(7.95, currency)}) لاتخاذ قرار تقييمي نهائي بحقه.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-cairo text-gray-400">
                                ملاحظة أداء #3
                            </div>
                        </div>

                        {/* Learning 4 */}
                        <div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-cairo">
                                        تباين النسخ الإعلانية
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                        {formatMoney(1.03, currency)} مقابل {formatMoney(3.61, currency)} CPL
                                    </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug font-cairo">
                                    النصوص الداكنة تفوقت بشكل حاسم على النصوص الفاتحة
                                </h4>
                                <p className="text-xs text-gray-600 mt-2 leading-relaxed font-cairo">
                                    في حملة فيلا الخوض، حقق فيديو المؤثر ذو النصوص الداكنة كفاءة أعلى بكثير مقارنة بالنسخة ذات النصوص الفاتحة ({formatMoney(1.03, currency)} مقابل {formatMoney(3.61, currency)} CPL).
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-cairo text-gray-400">
                                ملاحظة أداء #4
                            </div>
                        </div>

                        {/* Learning 5 */}
                        <div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-cairo">
                                        محرك زيارات
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                        3.00% CTR · {formatMoney(0.12, currency)} CPC
                                    </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug font-cairo">
                                    كاروسيل صور الخوض يولد تفاعلاً وزيارات بتكلفة منخفضة
                                </h4>
                                <p className="text-xs text-gray-600 mt-2 leading-relaxed font-cairo">
                                    يتميز إعلان ألبوم صور الخوض بقدرته العالية على جذب نقرات رخيصة بتكلفة {formatMoney(0.12, currency)} للنقرة ومعدل نقر 3.00%.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-cairo text-gray-400">
                                ملاحظة أداء #5
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ========================================================================= */}
                {/* 06. تسليم العملاء من التسويق إلى المبيعات */}
                {/* ========================================================================= */}
                <motion.section 
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white border-2 border-[#4A2C5A]/20 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-6"
                    id="section-marketing-sales-handoff"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4A2C5A] bg-[#4A2C5A]/10 px-2.5 py-0.5 rounded-md font-mono">
                                    06
                                </span>
                                <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded font-cairo">
                                    تحديد المسؤوليات بدقة
                                </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 mt-1 font-cairo">
                                تسليم العملاء: من التسويق إلى المبيعات
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-cairo">
                                فصل هيكلي واضح بين مسؤولية الإعلانات المدفوعة ومسؤولية فريق المبيعات في المتابعة والإغلاق.
                            </p>
                        </div>
                    </div>

                    {/* Delineation Banners */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Paid Media Scope */}
                        <div className="bg-purple-50/70 border-2 border-purple-200 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#4A2C5A]" />
                                    <h3 className="text-sm font-black uppercase tracking-wider text-[#4A2C5A] font-cairo">
                                        مسؤولية الإعلانات المدفوعة (التسويق)
                                    </h3>
                                </div>
                                <span className="text-[10px] font-extrabold uppercase bg-[#4A2C5A] text-white px-2 py-0.5 rounded font-cairo">
                                    نطاق التسويق
                                </span>
                            </div>
                            <div className="flex items-center justify-between bg-white rounded-xl p-3.5 border border-purple-100 my-3 font-cairo text-xs font-bold text-gray-900 text-center">
                                <div>عرض الإعلانات</div>
                                <div className="text-purple-400">&larr;</div>
                                <div>توليد 407 عملاء</div>
                                <div className="text-purple-400">&larr;</div>
                                <div className="text-emerald-700 font-extrabold">تسليم 407 عملاء للمبيعات</div>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed font-medium font-cairo">
                                تنتهي مسؤولية الإعلانات المدفوعة عند توليد العميل المحتمل. يتم تقييم الحملات بناءً على حجم التسليم، وتكلفة العميل (CPL)، ومعدلات النقر، وبدء المحادثات.
                            </p>
                        </div>

                        {/* Sales Scope */}
                        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-slate-600" />
                                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-cairo">
                                        مسؤولية فريق المبيعات
                                    </h3>
                                </div>
                                <span className="text-[10px] font-extrabold uppercase bg-slate-700 text-white px-2 py-0.5 rounded font-cairo">
                                    نطاق المبيعات
                                </span>
                            </div>
                            <div className="flex items-center justify-between bg-white rounded-xl p-3.5 border border-slate-200 my-3 font-cairo text-xs font-bold text-gray-800 text-center">
                                <div>التواصل الفوري</div>
                                <div className="text-slate-400">&larr;</div>
                                <div>التأهيل والتصنيف</div>
                                <div className="text-slate-400">&larr;</div>
                                <div>المتابعة والعروض</div>
                                <div className="text-slate-400">&larr;</div>
                                <div className="text-purple-900 font-extrabold">الصفقات الناجحة</div>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed font-medium font-cairo">
                                تُدار مرحلة ما بعد التسليم بشكل مستقل بواسطة مسؤولي المبيعات، وتظل نسب الإغلاق والتعاقدات منفصلة تماماً عن مؤشرات كفاءة الإعلانات.
                            </p>
                        </div>
                    </div>

                    {/* Sales Feedback Section */}
                    <div className="bg-gradient-to-br from-amber-50/30 via-white to-gray-50 border border-amber-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-amber-100">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">💬</span>
                                <h4 className="text-sm font-bold text-gray-900 font-cairo">
                                    انطباعات فريق المبيعات الأولية
                                </h4>
                            </div>
                            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full font-cairo">
                                متابعة مرحلية
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Al Khoudh Feedback */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-bold text-sky-700 font-cairo uppercase">فيلا الخوض</span>
                                    <span className="text-[11px] font-semibold text-gray-500 font-cairo">المسؤول: مروة</span>
                                </div>
                                <blockquote className="text-xs text-gray-800 italic bg-sky-50/50 p-2.5 rounded-lg border-r-2 border-sky-400 font-cairo">
                                    "جودة العملاء المحتملين جيدة وإيجابية."
                                </blockquote>
                            </div>

                            {/* Al Muzn 2 Feedback */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-bold text-purple-700 font-cairo uppercase">المزن 2</span>
                                    <span className="text-[11px] font-semibold text-gray-500 font-cairo">المسؤول: محمد</span>
                                </div>
                                <blockquote className="text-xs text-gray-800 italic bg-purple-50/50 p-2.5 rounded-lg border-r-2 border-purple-400 font-cairo">
                                    "يوجد حالياً 5 عملاء جادين محتملين في مراحل المتابعة المتقدمة."
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ========================================================================= */}
                {/* 07. الرؤى والأفكار الرئيسية */}
                {/* ========================================================================= */}
                <motion.section 
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white border border-gray-200/70 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-6"
                    id="section-key-insights"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4A2C5A] bg-[#4A2C5A]/10 px-2.5 py-0.5 rounded-md font-mono">
                                    07
                                </span>
                                <span className="text-xs text-gray-400 font-semibold font-cairo">أبرز الخلاصات الإدارية</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 mt-1 font-cairo">
                                الرؤى والنتائج الرئيسية
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-cairo">
                                6 خلاصات رئيسية تلخص الأداء والكفاءة وسلوك المواد الإعلانية والتنسيق مع المبيعات.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Insight 1 */}
                        <div className="bg-gray-50/60 border border-gray-200/70 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-cairo">
                                        حجم الاستثمار
                                    </span>
                                    <span className="text-xs font-mono font-bold text-gray-400">#01</span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug font-cairo">
                                    حجم الاستثمار وتوليد العملاء
                                </h4>
                                <p className="text-xs text-gray-600 mt-2.5 leading-relaxed font-cairo">
                                    عبر الحملتين معاً، تم استثمار {formatMoney(462.05, currency)} لتوليد 407 عملاء محتملين عبر الواتساب بمتوسط تكلفة {formatMoney(1.14, currency)} للعميل.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-cairo text-gray-400">
                                حقيقة أداء موثقة
                            </div>
                        </div>

                        {/* Insight 2 */}
                        <div className="bg-gray-50/60 border border-gray-200/70 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-cairo">
                                        كفاءة التحويل
                                    </span>
                                    <span className="text-xs font-mono font-bold text-gray-400">#02</span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug font-cairo">
                                    كفاءة تكلفة العميل في المزن 2
                                </h4>
                                <p className="text-xs text-gray-600 mt-2.5 leading-relaxed font-cairo">
                                    حققت حملة المزن 217 عميلاً بتكلفة {formatMoney(1.06, currency)} للعميل، متفوقة على فيلا الخوض ({formatMoney(1.23, currency)}) في كفاءة الاستحواذ.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-cairo text-gray-400">
                                حقيقة أداء موثقة
                            </div>
                        </div>

                        {/* Insight 3 */}
                        <div className="bg-gray-50/60 border border-gray-200/70 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded font-cairo">
                                        محرك الزيارات
                                    </span>
                                    <span className="text-xs font-mono font-bold text-gray-400">#03</span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug font-cairo">
                                    كفاءة جذب الزيارات في فيلا الخوض
                                </h4>
                                <p className="text-xs text-gray-600 mt-2.5 leading-relaxed font-cairo">
                                    ولدت فيلا الخوض نقرات بكفاءة أعلى بكثير بمعدل نقر 2.49% وتكلفة نقرة {formatMoney(0.19, currency)} مقارنة بـ 0.91% و {formatMoney(0.61, currency)} للمزن.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-cairo text-gray-400">
                                حقيقة أداء موثقة
                            </div>
                        </div>

                        {/* Insight 4 */}
                        <div className="bg-gray-50/60 border border-gray-200/70 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-cairo">
                                        الإعلان الأساسي
                                    </span>
                                    <span className="text-xs font-mono font-bold text-gray-400">#04</span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug font-cairo">
                                    ثبات وقوة فيديو 3D
                                </h4>
                                <p className="text-xs text-gray-600 mt-2.5 leading-relaxed font-cairo">
                                    يظل فيديو المزن ثلاثي الأبعاد أقوى إعلان مثبت بحجم 166 عميلاً محتملاً وتكلفة تقارب {formatMoney(1.00, currency)} للعميل.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-cairo text-gray-400">
                                حقيقة أداء موثقة
                            </div>
                        </div>

                        {/* Insight 5 */}
                        <div className="bg-gray-50/60 border border-gray-200/70 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-cairo">
                                        نتيجة اختبار A/B
                                    </span>
                                    <span className="text-xs font-mono font-bold text-gray-400">#05</span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug font-cairo">
                                    تأثير وضوح النصوص على التحويلات
                                </h4>
                                <p className="text-xs text-gray-600 mt-2.5 leading-relaxed font-cairo">
                                    أظهرت نسخة فيديو المؤثر ذات النصوص الداكنة كفاءة أعلى بكثير في التحويل مقارنة بالنصوص الفاتحة ({formatMoney(1.03, currency)} مقابل {formatMoney(3.61, currency)} CPL).
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-cairo text-gray-400">
                                حقيقة أداء موثقة
                            </div>
                        </div>

                        {/* Insight 6 */}
                        <div className="bg-gray-50/60 border border-gray-200/70 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded font-cairo">
                                        تنسيق المبيعات
                                    </span>
                                    <span className="text-xs font-mono font-bold text-gray-400">#06</span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug font-cairo">
                                    انطباعات إيجابية من فريق المبيعات
                                </h4>
                                <p className="text-xs text-gray-600 mt-2.5 leading-relaxed font-cairo">
                                    الانطباعات الأولية إيجابية مع تأكيد جودة عملاء الخوض وتواجد 5 عملاء جادين قيد المتابعة المتقدمة لحملة المزن.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-cairo text-gray-400">
                                حقيقة أداء موثقة
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ========================================================================= */}
                {/* 08. خطوات العمل القادمة */}
                {/* ========================================================================= */}
                <motion.section 
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white border border-gray-200/70 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-6"
                    id="section-next-steps"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4A2C5A] bg-[#4A2C5A]/10 px-2.5 py-0.5 rounded-md font-mono">
                                    08
                                </span>
                                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded font-cairo">
                                    الاستراتيجية التشغيلية
                                </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950 mt-1 font-cairo">
                                خطوات العمل والقرارات القادمة
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-cairo">
                                الإجراءات التكتيكية لاختبار المواد الإعلانية، وترتيب الأولويات، وإدارة الميزانيات.
                            </p>
                        </div>
                    </div>

                    {/* Action Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {/* Action 1 */}
                        <div className="bg-gray-50/50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xs transition-all">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md font-cairo border bg-blue-100 text-blue-800 border-blue-200">
                                        الحفاظ والاستمرار
                                    </span>
                                    <span className="text-[10px] font-cairo text-gray-400 truncate max-w-[150px]">
                                        المزن 2 · فيديو 3D
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-950 mb-1.5 font-cairo">
                                    فيديو المزن ثلاثي الأبعاد (3D)
                                </h4>
                                <p className="text-xs text-gray-700 leading-relaxed font-medium font-cairo">
                                    الاستمرار في استخدام فيديو 3D كإعلان تحكم وضبط أساسي للحملة.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/60 text-xs text-gray-500 font-cairo">
                                <strong className="text-gray-700">المبرر:</strong> موثوقية مثبتة بـ 166 عميلاً محتملاً بتكلفة تقارب {formatMoney(1.00, currency)} للعميل.
                            </div>
                        </div>

                        {/* Action 2 */}
                        <div className="bg-gray-50/50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xs transition-all">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md font-cairo border bg-purple-100 text-purple-800 border-purple-200">
                                        استمرار الاختبار
                                    </span>
                                    <span className="text-[10px] font-cairo text-gray-400 truncate max-w-[150px]">
                                        المزن 2 · إعلان الديار
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-950 mb-1.5 font-cairo">
                                    فيديو مستوحى من الديار
                                </h4>
                                <p className="text-xs text-gray-700 leading-relaxed font-medium font-cairo">
                                    الاستمرار في تشغيل الإعلان وجمع المزيد من بيانات الظهور والتحويل.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/60 text-xs text-gray-500 font-cairo">
                                <strong className="text-gray-700">المبرر:</strong> بداية واعدة (34 عميلاً بمتوسط ~{formatMoney(1.16, currency)}) منذ إطلاقه في 27 أغسطس.
                            </div>
                        </div>

                        {/* Action 3 */}
                        <div className="bg-gray-50/50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xs transition-all">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md font-cairo border bg-purple-100 text-purple-800 border-purple-200">
                                        استمرار الاختبار
                                    </span>
                                    <span className="text-[10px] font-cairo text-gray-400 truncate max-w-[150px]">
                                        المزن 2 · إعلان ريتال
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-950 mb-1.5 font-cairo">
                                    فيديو مستوحى من ريتال
                                </h4>
                                <p className="text-xs text-gray-700 leading-relaxed font-medium font-cairo">
                                    مواصلة جمع البيانات قبل اتخاذ قرار تقييمي نهائي.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/60 text-xs text-gray-500 font-cairo">
                                <strong className="text-gray-700">المبرر:</strong> تم إنفاق {formatMoney(7.95, currency)} فقط حتى الآن، وحجم الظهور لا يزال منخفضاً.
                            </div>
                        </div>

                        {/* Action 4 */}
                        <div className="bg-gray-50/50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xs transition-all">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md font-cairo border bg-emerald-100 text-emerald-800 border-emerald-200">
                                        مادة إعلانية جديدة
                                    </span>
                                    <span className="text-[10px] font-cairo text-gray-400 truncate max-w-[150px]">
                                        المزن 2 · مستوحى من لودها ريتشموند
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-950 mb-1.5 font-cairo">
                                    فيديو جديد للمزن 2 (29 أغسطس)
                                </h4>
                                <p className="text-xs text-gray-700 leading-relaxed font-medium font-cairo">
                                    إضافة إعلان فيديو جديد اليوم لمشروع المزن مستوحى من أسلوب المطور المعروف لودها ريتشموند.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/60 text-xs text-gray-500 font-cairo">
                                <strong className="text-gray-700">المبرر:</strong> اختبار اتجاه إبداعي عقاري مميز مقابل خط الأساس لحملة المزن (~{formatMoney(1.06, currency)}) وفيديو 3D (~{formatMoney(1.00, currency)}).
                            </div>
                        </div>

                        {/* Action 5 */}
                        <div className="bg-gray-50/50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xs transition-all">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md font-cairo border bg-indigo-100 text-indigo-800 border-indigo-200">
                                        أولوية التشغيل
                                    </span>
                                    <span className="text-[10px] font-cairo text-gray-400 truncate max-w-[150px]">
                                        فيلا الخوض · نصوص داكنة
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-950 mb-1.5 font-cairo">
                                    فيديو الخوض بالنصوص الداكنة
                                </h4>
                                <p className="text-xs text-gray-700 leading-relaxed font-medium font-cairo">
                                    الاستمرار في إعطاء الأولوية لهذه النسخة مقارنة بنسخة النصوص الفاتحة.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/60 text-xs text-gray-500 font-cairo">
                                <strong className="text-gray-700">المبرر:</strong> تكلفة العميل للنصوص الداكنة = {formatMoney(1.03, currency)} مقابل {formatMoney(3.61, currency)} للنصوص الفاتحة.
                            </div>
                        </div>

                        {/* Action 6 */}
                        <div className="bg-gray-50/50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xs transition-all">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md font-cairo border bg-rose-100 text-rose-800 border-rose-200">
                                        تقليص / إيقاف
                                    </span>
                                    <span className="text-[10px] font-cairo text-gray-400 truncate max-w-[150px]">
                                        فيلا الخوض · نصوص فاتحة
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-950 mb-1.5 font-cairo">
                                    فيديو الخوض بالنصوص الفاتحة
                                </h4>
                                <p className="text-xs text-gray-700 leading-relaxed font-medium font-cairo">
                                    النظر في تقليص الإنفاق على هذا المتغير أو إيقافه مؤقتاً.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/60 text-xs text-gray-500 font-cairo">
                                <strong className="text-gray-700">المبرر:</strong> تكلفة العميل الحالية {formatMoney(3.61, currency)}، وهي أعلى بكثير من متوسط الحملة والنسخة الداكنة.
                            </div>
                        </div>
                    </div>

                    {/* Monitoring Framework */}
                    <div className="bg-gradient-to-br from-purple-50/30 via-white to-gray-50 border-2 border-purple-200/70 rounded-2xl p-5 sm:p-6 space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded font-cairo">
                                أجندة المتابعة الدورية
                            </span>
                            <h4 className="text-sm font-bold text-gray-950 font-cairo">
                                أبرز الإشارات والمؤشرات المرصودة خلال الدورة القادمة
                            </h4>
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-gray-700 font-medium pt-1 font-cairo">
                            <li className="flex items-start gap-2 bg-white/80 border border-gray-200/60 rounded-xl p-3 shadow-2xs">
                                <span className="text-purple-600 font-bold">&bull;</span>
                                <span>متابعة ثبات تكلفة العميل لإعلان الديار مع زيادة حجم الإنفاق في الأيام القادمة.</span>
                            </li>
                            <li className="flex items-start gap-2 bg-white/80 border border-gray-200/60 rounded-xl p-3 shadow-2xs">
                                <span className="text-purple-600 font-bold">&bull;</span>
                                <span>تقييم أداء فيديو لودها ريتشموند الجديد للمزن 2 بعد إطلاقه اليوم.</span>
                            </li>
                            <li className="flex items-start gap-2 bg-white/80 border border-gray-200/60 rounded-xl p-3 shadow-2xs">
                                <span className="text-purple-600 font-bold">&bull;</span>
                                <span>التأكد من استمرار حملة المزن في العمل حول معيار ~{formatMoney(1.00, currency)} لتكلفة العميل.</span>
                            </li>
                            <li className="flex items-start gap-2 bg-white/80 border border-gray-200/60 rounded-xl p-3 shadow-2xs">
                                <span className="text-purple-600 font-bold">&bull;</span>
                                <span>رصد اتجاهات التردد وإشارات تشبع المواد الإعلانية في حملة الخوض.</span>
                            </li>
                            <li className="flex items-start gap-2 bg-white/80 border border-gray-200/60 rounded-xl p-3 shadow-2xs col-span-1 md:col-span-2">
                                <span className="text-purple-600 font-bold">&bull;</span>
                                <span>استمرار جمع الملاحظات النوعية حول جودة وتأهيل العملاء من مسؤولي المبيعات.</span>
                            </li>
                        </ul>
                    </div>
                </motion.section>

            </main>

            {/* Creative Play / Preview Modal */}
            <CreativePreviewModal
                isOpen={!!selectedCreativeForPreview}
                onClose={() => setSelectedCreativeForPreview(null)}
                creative={selectedCreativeForPreview}
                currency={currency}
                isArabic={true}
            />
        </div>
    );
};

export default App_ar;
