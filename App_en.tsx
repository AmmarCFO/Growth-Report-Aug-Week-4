import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import { CreativePreviewModal } from './components/CreativePreviewModal';
import { CreativeThumbnail } from './components/CreativeThumbnail';
import { motion } from 'framer-motion';
import { Play, Film, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { 
    ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
    Line, ComposedChart
} from 'recharts';
import { 
    AlMuznDailyPoint,
    CampaignComparisonData,
    AbrajCreativeItem,
    CreativeClassification,
    Currency
} from './types';
import { formatMoney, convertAmount, CURRENCY_RATES } from './currency';

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
// REAL DATA DEFINITIONS (AUG 20 - AUG 29, 2026)
// ==========================================

const AL_MUZN_DAILY_DATA: AlMuznDailyPoint[] = [
    { date: 'Aug 20', dayLabel: 'Aug 20', spend: 6.27, leads: 7, cpl: 0.90 },
    { date: 'Aug 21', dayLabel: 'Aug 21', spend: 26.08, leads: 30, cpl: 0.87 },
    { date: 'Aug 22', dayLabel: 'Aug 22', spend: 23.38, leads: 25, cpl: 0.94 },
    { date: 'Aug 23', dayLabel: 'Aug 23', spend: 24.20, leads: 20, cpl: 1.21 },
    { date: 'Aug 24', dayLabel: 'Aug 24', spend: 32.20, leads: 16, cpl: 2.01 },
    { date: 'Aug 25', dayLabel: 'Aug 25', spend: 23.92, leads: 20, cpl: 1.20 },
    { date: 'Aug 26', dayLabel: 'Aug 26', spend: 23.74, leads: 21, cpl: 1.13 },
    { date: 'Aug 27', dayLabel: 'Aug 27', spend: 31.21, leads: 33, cpl: 0.95 },
    { date: 'Aug 28', dayLabel: 'Aug 28', spend: 22.29, leads: 28, cpl: 0.80 },
    { date: 'Aug 29', dayLabel: 'Aug 29 (Partial)', spend: 15.97, leads: 17, cpl: 0.94, isPartial: true },
];

const AL_KHOUDH_DAILY_DATA: AlMuznDailyPoint[] = [
    { date: 'Aug 20', dayLabel: 'Aug 20', spend: 3.10, leads: 6, cpl: 0.52 },
    { date: 'Aug 21', dayLabel: 'Aug 21', spend: 28.31, leads: 19, cpl: 1.49 },
    { date: 'Aug 22', dayLabel: 'Aug 22', spend: 26.29, leads: 17, cpl: 1.55 },
    { date: 'Aug 23', dayLabel: 'Aug 23', spend: 29.31, leads: 23, cpl: 1.27 },
    { date: 'Aug 24', dayLabel: 'Aug 24', spend: 30.94, leads: 20, cpl: 1.55 },
    { date: 'Aug 25', dayLabel: 'Aug 25', spend: 28.10, leads: 33, cpl: 0.85 },
    { date: 'Aug 26', dayLabel: 'Aug 26', spend: 15.86, leads: 14, cpl: 1.13 },
    { date: 'Aug 27', dayLabel: 'Aug 27', spend: 26.60, leads: 24, cpl: 1.11 },
    { date: 'Aug 28', dayLabel: 'Aug 28', spend: 20.76, leads: 18, cpl: 1.15 },
    { date: 'Aug 29', dayLabel: 'Aug 29 (Partial)', spend: 30.43, leads: 18, cpl: 1.69, isPartial: true },
];

const CAMPAIGN_COMPARISON_DATA: CampaignComparisonData[] = [
    {
        id: 'al-muzn-2',
        name: 'Al Muzn 2',
        nameAr: 'المزن 2',
        spend: 229.26,
        leads: 217,
        cpl: 1.06,
        impressions: 41066,
        linkClicks: 374,
        ctr: 0.91,
        cpc: 0.61,
        cpm: 5.58,
        clickToLeadRate: 58.0,
        dailyBudget: 25,
        adSetsCount: 1,
        highlightInsight: 'Generated more leads at a lower CPL with exceptional bottom-funnel conversion efficiency (58.0% Click-to-Lead).',
        highlightInsightAr: 'حققت حجماً أعلى من العملاء المحتملين بتكلفة أقل للعميل وبمعدل تحويل استثنائي من النقرة إلى عميل (58.0%).',
        funnelRole: 'Lead Acquisition & Conversion Powerhouse',
        funnelRoleAr: 'محرك التحويل واكتساب العملاء المحتملين'
    },
    {
        id: 'al-khoudh-villa',
        name: 'Al Khoudh Villa',
        nameAr: 'فيلا الخوض',
        spend: 232.79,
        leads: 190,
        cpl: 1.23,
        impressions: 50473,
        linkClicks: 1257,
        ctr: 2.49,
        cpc: 0.19,
        cpm: 4.61,
        clickToLeadRate: 15.1,
        dailyBudget: 25,
        adSetsCount: 1,
        highlightInsight: 'Generated clicks significantly more efficiently, achieving a 2.49% CTR, delivering 1,257 intent clicks.',
        highlightInsightAr: 'حققت كفاءة فائقة في توليد الزيارات والنقرات بمعدل نقر 2.49%، محققة 1,257 نقرة.',
        funnelRole: 'High-Volume Traffic & Interest Generator',
        funnelRoleAr: 'محرك توليد الزيارات والاهتمام العالي'
    }
];

const AL_MUZN_CREATIVES: AbrajCreativeItem[] = [
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
        launchDate: 'August 27, 2026',
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
        nameAr: 'إعلان الكاروسيل للصور',
        campaign: 'Al Muzn 2',
        campaignAr: 'المزن 2',
        format: 'Image Carousel',
        launchDate: 'August 20, 2026',
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
        launchDate: 'August 27, 2026',
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

const AL_KHOUDH_CREATIVES: AbrajCreativeItem[] = [
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
        nameAr: 'كاروسيل الصور',
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
        keyInsightAr: 'ليس الأقل تكلفة للعميل، لكنه فائق الكفاءة في توليد النقرات (3.00% CTR).',
        badgeType: 'promising',
        driveUrl: 'https://drive.google.com/file/d/1Qaj4pS8yI6HCG919BYyzUtegxTii_bJ9/view?usp=sharing',
        driveFileId: '1Qaj4pS8yI6HCG919BYyzUtegxTii_bJ9'
    },
    {
        id: 'khoudh-ai-video',
        name: 'AI Generated Video',
        nameAr: 'فيديو مولد بالذكاء الاصطناعي',
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

interface AppEnProps {
    currency: Currency;
    onCurrencyChange: (currency: Currency) => void;
    onToggleLanguage: () => void;
}

const App_en: React.FC<AppEnProps> = ({ currency, onCurrencyChange, onToggleLanguage }) => {
    const [selectedTrendView, setSelectedTrendView] = useState<'all' | 'leads' | 'cpl'>('all');
    const [selectedKhoudhTrendView, setSelectedKhoudhTrendView] = useState<'all' | 'leads' | 'cpl'>('all');
    const [selectedCreativeForPreview, setSelectedCreativeForPreview] = useState<AbrajCreativeItem | null>(null);

    // Chart daily data converted to active currency for Al Muzn 2
    const dailyChartData = useMemo(() => {
        return AL_MUZN_DAILY_DATA.map(d => ({
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
        return AL_KHOUDH_DAILY_DATA.map(d => ({
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
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 border border-emerald-300/60 font-mono">Control Winner</span>;
            case 'Winner / Prioritize':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 border border-emerald-300/60 font-mono">Winner / Prioritize</span>;
            case 'Promising / Continue Testing':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 font-mono">Promising / Testing</span>;
            case 'Strong':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">Strong</span>;
            case 'Strong Traffic Generator':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200 font-mono">Traffic Engine</span>;
            case 'Early Testing':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200 font-mono">Early Testing</span>;
            case 'Monitor':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 font-mono">Monitor</span>;
            case 'Pause / Reduce Candidate':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 font-mono">Pause Candidate</span>;
            default:
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">Active</span>;
        }
    };

    return (
        <div className="min-h-screen pb-24 selection:bg-[#4A2C5A] selection:text-white bg-[#F5F5F7] font-sans antialiased text-[#1D1D1F]">
            <Header 
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
                                <span className="text-xs font-bold tracking-widest text-[#4A2C5A] uppercase bg-[#4A2C5A]/10 px-3 py-1 rounded-full font-mono">
                                    Abraj Bousher
                                </span>
                                <span className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-0.5 rounded-full font-mono">
                                    August 20, 2026 - August 29, 2026
                                </span>
                                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                                    First Reporting Period
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight mt-3">
                                Weekly Meta Paid Ads <span className="text-[#4A2C5A]">Performance Report</span>
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 font-medium mt-2 max-w-3xl leading-relaxed">
                                Objective: Generate WhatsApp leads efficiently through Meta paid advertising. Evaluates media investment, lead generation volume, acquisition cost efficiency, and creative delivery across active campaigns.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-white border border-gray-200/80 rounded-2xl px-4 py-3 shadow-xs self-start md:self-auto">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Lead Metric Definition</span>
                                <span className="text-xs font-bold text-gray-800 font-mono">Messaging Conversations Started</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ========================================================================= */}
                {/* 01. EXECUTIVE OVERVIEW */}
                {/* ========================================================================= */}
                <motion.section 
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-[#1E1B24] border border-[#4A2C5A]/30 rounded-[2rem] p-6 sm:p-8 shadow-xl relative overflow-hidden text-white"
                    id="section-executive-overview"
                >
                    {/* Decorative ambient lighting */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#4A2C5A]/20 blur-3xl rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        {/* Section Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-md font-mono">
                                        01
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium font-mono">High-Level Executive Summary</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5">Executive Overview</h2>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-xl font-mono text-xs text-purple-200">
                                <span>Core Priority:</span>
                                <strong className="text-white font-bold">Spend &rarr; Leads &rarr; CPL &rarr; Click-to-Lead Rate</strong>
                            </div>
                        </div>

                        {/* Top 4 Visually Prioritized KPIs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
                            {/* Metric 1: Total Spend */}
                            <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.08] transition-all">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Spend</p>
                                    <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">Priority 1</span>
                                </div>
                                <p className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                                    {formatMoney(462.05, currency)}
                                </p>
                                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10 text-[11px] text-slate-400">
                                    <span>Daily Budget Pace:</span>
                                    <span className="font-mono text-purple-200 font-bold">{formatMoney(50.00, currency)} / day total</span>
                                </div>
                            </div>

                            {/* Metric 2: Total Leads */}
                            <div className="bg-purple-950/30 border border-purple-500/30 rounded-2xl p-5 hover:bg-purple-950/40 transition-all">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">Total Leads</p>
                                    <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">Priority 2</span>
                                </div>
                                <p className="text-3xl sm:text-4xl font-extrabold text-purple-200 font-mono tracking-tight">407</p>
                                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-purple-500/20 text-[11px] text-purple-300">
                                    <span>Lead Metric:</span>
                                    <span className="font-mono text-white font-bold">Messaging Conversations Started</span>
                                </div>
                            </div>

                            {/* Metric 3: Blended CPL */}
                            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-5 hover:bg-emerald-950/40 transition-all">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Blended CPL</p>
                                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">Priority 3</span>
                                </div>
                                <p className="text-3xl sm:text-4xl font-extrabold text-emerald-300 font-mono tracking-tight">
                                    {formatMoney(1.14, currency)}
                                </p>
                                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-emerald-500/20 text-[11px] text-emerald-400">
                                    <span>Cost per Conversation:</span>
                                    <span className="font-mono text-white font-bold">First-Period CPL Baseline</span>
                                </div>
                            </div>

                            {/* Metric 4: Click-to-Lead Rate */}
                            <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.08] transition-all">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">Click-to-Lead Rate</p>
                                    <span className="text-[10px] font-mono text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded">Priority 4</span>
                                </div>
                                <p className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">25.0%</p>
                                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10 text-[11px] text-slate-400">
                                    <span>Rate Definition:</span>
                                    <span className="font-mono text-sky-300 font-bold">Messaging Conversations / Link Clicks</span>
                                </div>
                            </div>
                        </div>

                        {/* Supporting Metrics Bar */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 mb-5">
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono">
                                    Supporting Diagnostic Metrics (Account-Level Delivery)
                                </span>
                                <span className="text-[10px] text-purple-300 font-mono font-bold bg-purple-500/20 px-2 py-0.5 rounded">
                                    Currency: {currency} (1 USD = {CURRENCY_RATES[currency]} {currency})
                                </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
                                <div className="bg-black/20 rounded-xl p-2.5">
                                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Impressions</span>
                                    <span className="text-base font-bold text-white font-mono">91,539</span>
                                </div>
                                <div className="bg-black/20 rounded-xl p-2.5">
                                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Link Clicks</span>
                                    <span className="text-base font-bold text-white font-mono">1,631</span>
                                </div>
                                <div className="bg-black/20 rounded-xl p-2.5">
                                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">CTR</span>
                                    <span className="text-base font-bold text-white font-mono">1.78%</span>
                                </div>
                                <div className="bg-black/20 rounded-xl p-2.5">
                                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">CPC</span>
                                    <span className="text-base font-bold text-white font-mono">{formatMoney(0.28, currency)}</span>
                                </div>
                                <div className="bg-black/20 rounded-xl p-2.5">
                                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">CPM</span>
                                    <span className="text-base font-bold text-white font-mono">{formatMoney(5.05, currency)}</span>
                                </div>
                                <div className="bg-black/20 rounded-xl p-2.5">
                                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Active Campaigns</span>
                                    <span className="text-base font-bold text-purple-300 font-mono">2 (2 Ad Sets)</span>
                                </div>
                                <div className="bg-black/20 rounded-xl p-2.5 col-span-2 sm:col-span-1">
                                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Active Creatives</span>
                                    <span className="text-base font-bold text-emerald-300 font-mono">9 Creatives</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ========================================================================= */}
                {/* 02. CAMPAIGN PERFORMANCE */}
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
                                <span className="text-xs text-gray-500 font-semibold">Side-by-Side Campaign Analysis</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950 mt-1">Campaign Performance</h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                Evaluating full-funnel efficiency between the two active campaigns (Al Muzn 2 & Al Khoudh Villa).
                            </p>
                        </div>
                        <div className="text-xs font-mono text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                            Total Daily Budget: <strong>{formatMoney(50, currency)}/day ({formatMoney(25, currency)} + {formatMoney(25, currency)})</strong>
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
                                            <span className="text-xs font-extrabold uppercase tracking-widest text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-md font-mono">
                                                Campaign 1
                                            </span>
                                            <span className="text-xs font-bold text-gray-400 font-mono">{formatMoney(25, currency)}/day · 1 Ad Set</span>
                                        </div>
                                        <h3 className="text-2xl font-extrabold text-gray-950 mt-1.5">Al Muzn 2</h3>
                                        <p className="text-xs text-purple-700 font-semibold font-mono mt-0.5">Lead Acquisition & Conversion Powerhouse</p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                                        58.0% Conv.
                                    </span>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-purple-100 mb-4">
                                    <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-2xs">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Total Spend</span>
                                        <span className="text-lg font-extrabold text-gray-950 font-mono">{formatMoney(229.26, currency)}</span>
                                    </div>
                                    <div className="bg-white border border-purple-100 rounded-xl p-3 text-center shadow-2xs">
                                        <span className="text-[10px] font-bold text-purple-700 uppercase block">Leads Generated</span>
                                        <span className="text-lg font-black text-[#4A2C5A] font-mono">217</span>
                                    </div>
                                    <div className="bg-white border border-emerald-100 rounded-xl p-3 text-center shadow-2xs">
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase block">Cost Per Lead</span>
                                        <span className="text-lg font-extrabold text-emerald-600 font-mono">{formatMoney(1.06, currency)}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs mb-4">
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <span className="text-[9px] text-gray-400 block font-semibold">Impressions</span>
                                        <span className="font-bold text-gray-800 font-mono">41,066</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <span className="text-[9px] text-gray-400 block font-semibold">Link Clicks</span>
                                        <span className="font-bold text-gray-800 font-mono">374</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <span className="text-[9px] text-gray-400 block font-semibold">CTR</span>
                                        <span className="font-bold text-gray-800 font-mono">0.91%</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <span className="text-[9px] text-gray-400 block font-semibold">CPC</span>
                                        <span className="font-bold text-gray-800 font-mono">{formatMoney(0.61, currency)}</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2 col-span-3 sm:col-span-1">
                                        <span className="text-[9px] text-gray-400 block font-semibold">CPM</span>
                                        <span className="font-bold text-gray-800 font-mono">{formatMoney(5.58, currency)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-100/50 border border-purple-200/60 rounded-xl p-3.5 text-xs text-purple-950 leading-relaxed font-medium">
                                <strong>Core Strength:</strong> Generated more total leads at a significantly lower CPL ({formatMoney(1.06, currency)}) with an outstanding 58.0% Click-to-Lead conversion rate.
                            </div>
                        </div>

                        {/* Campaign 2: Al Khoudh Villa */}
                        <div className="bg-gradient-to-b from-sky-50/50 via-white to-white border-2 border-sky-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-extrabold uppercase tracking-widest text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-md font-mono">
                                                Campaign 2
                                            </span>
                                            <span className="text-xs font-bold text-gray-400 font-mono">{formatMoney(25, currency)}/day · 1 Ad Set</span>
                                        </div>
                                        <h3 className="text-2xl font-extrabold text-gray-950 mt-1.5">Al Khoudh Villa</h3>
                                        <p className="text-xs text-sky-700 font-semibold font-mono mt-0.5">High-Volume Traffic & Interest Generator</p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-sky-50 text-sky-700 border border-sky-200 font-mono">
                                        1,257 Clicks
                                    </span>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-sky-100 mb-4">
                                    <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-2xs">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Total Spend</span>
                                        <span className="text-lg font-extrabold text-gray-950 font-mono">{formatMoney(232.79, currency)}</span>
                                    </div>
                                    <div className="bg-white border border-sky-100 rounded-xl p-3 text-center shadow-2xs">
                                        <span className="text-[10px] font-bold text-sky-700 uppercase block">Leads Generated</span>
                                        <span className="text-lg font-black text-sky-900 font-mono">190</span>
                                    </div>
                                    <div className="bg-white border border-sky-100 rounded-xl p-3 text-center shadow-2xs">
                                        <span className="text-[10px] font-bold text-sky-600 uppercase block">Cost Per Lead</span>
                                        <span className="text-lg font-extrabold text-sky-700 font-mono">{formatMoney(1.23, currency)}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs mb-4">
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <span className="text-[9px] text-gray-400 block font-semibold">Impressions</span>
                                        <span className="font-bold text-gray-800 font-mono">50,473</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <span className="text-[9px] text-gray-400 block font-semibold">Link Clicks</span>
                                        <span className="font-bold text-gray-800 font-mono">1,257</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <span className="text-[9px] text-gray-400 block font-semibold">CTR</span>
                                        <span className="font-bold text-emerald-600 font-mono">2.49%</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <span className="text-[9px] text-gray-400 block font-semibold">CPC</span>
                                        <span className="font-bold text-emerald-600 font-mono">{formatMoney(0.19, currency)}</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2 col-span-3 sm:col-span-1">
                                        <span className="text-[9px] text-gray-400 block font-semibold">CPM</span>
                                        <span className="font-bold text-gray-800 font-mono">{formatMoney(4.61, currency)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-sky-100/50 border border-sky-200/60 rounded-xl p-3.5 text-xs text-sky-950 leading-relaxed font-medium">
                                <strong>Core Strength:</strong> Exceptional click efficiency engine delivering 1,257 intent clicks at {formatMoney(0.19, currency)} CPC with an above-average 2.49% CTR.
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ========================================================================= */}
                {/* 03. DAILY LEAD & CPL TREND */}
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
                                <span className="text-xs text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded">
                                    Campaign-Specific Daily Performance
                                </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 mt-1">
                                Daily Lead & CPL Trend
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Daily lead volume generation correlated with Cost Per Lead (CPL in {currency}) movement across the 10-day period for both active campaigns.
                            </p>
                        </div>
                    </div>

                    {/* CAMPAIGN 1: AL MUZN 2 */}
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-purple-100/70">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#4A2C5A]" />
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-950">
                                        Al Muzn 2 - Daily Lead & CPL Trend
                                    </h3>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Daily lead volume and acquisition cost metrics for Al Muzn 2 (Aug 20 – Aug 29).
                                </p>
                            </div>
                            
                            {/* View Switcher Tabs */}
                            <div className="flex items-center bg-gray-100/80 p-1 rounded-xl border border-gray-200/50 self-start md:self-auto text-xs font-semibold">
                                <button 
                                    onClick={() => setSelectedTrendView('all')}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedTrendView === 'all' ? 'bg-white text-[#4A2C5A] shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Leads & CPL
                                </button>
                                <button 
                                    onClick={() => setSelectedTrendView('leads')}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedTrendView === 'leads' ? 'bg-white text-[#4A2C5A] shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Leads Volume
                                </button>
                                <button 
                                    onClick={() => setSelectedTrendView('cpl')}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedTrendView === 'cpl' ? 'bg-white text-[#4A2C5A] shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    CPL Curve
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
                                        tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 600 }} 
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
                                        contentStyle={{ backgroundColor: '#1E1B24', borderColor: '#4A2C5A', borderRadius: '14px', color: '#fff', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                                        formatter={(value: any, name: string) => {
                                            if (name.includes('CPL') || name.includes('Cost Per Lead')) return [`${value} ${currency}`, `Cost Per Lead (${currency})`];
                                            if (name.includes('Spend') || name.includes('Daily Spend')) return [`${value} ${currency}`, `Daily Spend (${currency})`];
                                            return [`${value} Leads`, name];
                                        }}
                                        labelFormatter={(label) => `Date: ${label}`}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                                    
                                    {(selectedTrendView === 'all' || selectedTrendView === 'leads') && (
                                        <Bar 
                                            yAxisId="leads" 
                                            dataKey="leads" 
                                            name="Daily Leads" 
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
                                            name={`Cost Per Lead (${currency})`} 
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
                        <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono px-2">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                * August 29 represents a partial day of delivery data.
                            </span>
                            <span>Spend & leads tracked through current time</span>
                        </div>

                        {/* 3 Performance Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            {/* Card 1: Highest Lead Volume */}
                            <div className="bg-purple-50/60 border border-purple-200/80 rounded-2xl p-4 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 block">
                                        Highest Lead Volume
                                    </span>
                                    <p className="text-2xl sm:text-3xl font-black text-[#4A2C5A] font-mono mt-1">
                                        33 leads
                                    </p>
                                </div>
                                <div className="pt-2 mt-2 border-t border-purple-200/50 flex items-center justify-between text-xs font-semibold text-purple-900">
                                    <span>Date Captured:</span>
                                    <span className="font-mono font-bold">August 27</span>
                                </div>
                            </div>

                            {/* Card 2: Lowest CPL */}
                            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                                        Lowest CPL
                                    </span>
                                    <p className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono mt-1">
                                        {formatMoney(0.80, currency)}
                                    </p>
                                </div>
                                <div className="pt-2 mt-2 border-t border-emerald-200/50 flex items-center justify-between text-xs font-semibold text-emerald-900">
                                    <span>Date Captured:</span>
                                    <span className="font-mono font-bold">August 28 (28 leads)</span>
                                </div>
                            </div>

                            {/* Card 3: Highest CPL */}
                            <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-4 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 block">
                                        Highest CPL
                                    </span>
                                    <p className="text-2xl sm:text-3xl font-black text-rose-600 font-mono mt-1">
                                        {formatMoney(2.01, currency)}
                                    </p>
                                </div>
                                <div className="pt-2 mt-2 border-t border-rose-200/50 flex items-center justify-between text-xs font-semibold text-rose-900">
                                    <span>Date Captured:</span>
                                    <span className="font-mono font-bold">August 24 (16 leads)</span>
                                </div>
                            </div>
                        </div>

                        {/* Concise Insight Box */}
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                                <strong className="text-gray-950 font-bold">Trend Analysis:</strong> Al Muzn CPL rose to {formatMoney(2.01, currency)} on August 24 before improving over the following days, reaching {formatMoney(0.95, currency)} on August 27 and {formatMoney(0.80, currency)} on August 28.
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
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-950">
                                        Al Khoudh Villa - Daily Lead & CPL Trend
                                    </h3>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Daily lead volume and acquisition cost metrics for Al Khoudh Villa (Aug 20 – Aug 29).
                                </p>
                            </div>
                            
                            {/* View Switcher Tabs */}
                            <div className="flex items-center bg-gray-100/80 p-1 rounded-xl border border-gray-200/50 self-start md:self-auto text-xs font-semibold">
                                <button 
                                    onClick={() => setSelectedKhoudhTrendView('all')}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedKhoudhTrendView === 'all' ? 'bg-white text-sky-800 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Leads & CPL
                                </button>
                                <button 
                                    onClick={() => setSelectedKhoudhTrendView('leads')}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedKhoudhTrendView === 'leads' ? 'bg-white text-sky-800 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Leads Volume
                                </button>
                                <button 
                                    onClick={() => setSelectedKhoudhTrendView('cpl')}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedKhoudhTrendView === 'cpl' ? 'bg-white text-sky-800 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    CPL Curve
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
                                        tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 600 }} 
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
                                        contentStyle={{ backgroundColor: '#1E1B24', borderColor: '#0369A1', borderRadius: '14px', color: '#fff', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                                        formatter={(value: any, name: string) => {
                                            if (name.includes('CPL') || name.includes('Cost Per Lead')) return [`${value} ${currency}`, `Cost Per Lead (${currency})`];
                                            if (name.includes('Spend') || name.includes('Daily Spend')) return [`${value} ${currency}`, `Daily Spend (${currency})`];
                                            return [`${value} Leads`, name];
                                        }}
                                        labelFormatter={(label) => `Date: ${label}`}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                                    
                                    {(selectedKhoudhTrendView === 'all' || selectedKhoudhTrendView === 'leads') && (
                                        <Bar 
                                            yAxisId="leads" 
                                            dataKey="leads" 
                                            name="Daily Leads" 
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
                                            name={`Cost Per Lead (${currency})`} 
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
                        <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono px-2">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                * August 29 represents a partial day of delivery data.
                            </span>
                            <span>Spend & leads tracked through current time</span>
                        </div>

                        {/* 3 Performance Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            {/* Card 1: Highest Lead Volume */}
                            <div className="bg-sky-50/60 border border-sky-200/80 rounded-2xl p-4 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 block">
                                        Highest Lead Volume
                                    </span>
                                    <p className="text-2xl sm:text-3xl font-black text-sky-900 font-mono mt-1">
                                        33 Leads
                                    </p>
                                </div>
                                <div className="pt-2 mt-2 border-t border-sky-200/50 flex items-center justify-between text-xs font-semibold text-sky-900">
                                    <span>Date Captured:</span>
                                    <span className="font-mono font-bold">August 25</span>
                                </div>
                            </div>

                            {/* Card 2: Lowest CPL */}
                            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                                        Lowest CPL
                                    </span>
                                    <p className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono mt-1">
                                        {formatMoney(0.52, currency)}
                                    </p>
                                </div>
                                <div className="pt-2 mt-2 border-t border-emerald-200/50 flex items-center justify-between text-xs font-semibold text-emerald-900">
                                    <span>Date Captured:</span>
                                    <span className="font-mono font-bold">August 20</span>
                                </div>
                            </div>

                            {/* Card 3: Highest CPL */}
                            <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-4 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 block">
                                        Highest CPL
                                    </span>
                                    <p className="text-2xl sm:text-3xl font-black text-rose-600 font-mono mt-1">
                                        {formatMoney(1.69, currency)}
                                    </p>
                                </div>
                                <div className="pt-2 mt-2 border-t border-rose-200/50 flex items-center justify-between text-xs font-semibold text-rose-900">
                                    <span>Date Captured:</span>
                                    <span className="font-mono font-bold">August 29</span>
                                </div>
                            </div>
                        </div>

                        {/* Concise Insight Box & Subtle Note */}
                        <div className="space-y-2.5">
                            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                                    <strong className="text-gray-950 font-bold">Trend Analysis:</strong> Al Khoudh delivered its highest lead volume on August 25, generating 33 leads at {formatMoney(0.85, currency)} CPL. CPL increased toward the end of the period, reaching {formatMoney(1.69, currency)} on August 29.
                                </p>
                            </div>
                            <div className="px-4 py-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                <span>
                                    <strong>Note:</strong> August 20 had very low spend ({formatMoney(3.10, currency)}), so its {formatMoney(0.52, currency)} CPL should not be treated as a mature performance benchmark.
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ========================================================================= */}
                {/* 04. CREATIVE PERFORMANCE */}
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
                                <span className="text-xs text-purple-600 font-bold">9 Active Creatives Evaluated</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950 mt-1">
                                Creative Performance Analysis
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                Granular asset breakdown segmented by campaign (Al Muzn 2 & Al Khoudh Villa).
                            </p>
                        </div>
                    </div>

                    {/* Group 1: Al Muzn 2 Creatives */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#4A2C5A]" />
                                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                    Al Muzn 2 Creatives (4 Assets)
                                </h3>
                            </div>
                            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                                Total Leads: 217 · {formatMoney(229.26, currency)} Spend
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {AL_MUZN_CREATIVES.map((creative) => (
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
                                                    <span className="text-[9px] font-extrabold uppercase bg-gray-900 text-white px-2 py-0.5 rounded font-mono">
                                                        {creative.format}
                                                    </span>
                                                    {creative.launchDate && (
                                                        <span className="text-[10px] text-gray-500 font-mono">
                                                             Launched: {creative.launchDate}
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="text-base font-bold text-gray-950 mt-1.5">
                                                    {creative.name}
                                                </h4>
                                            </div>
                                            {getClassificationBadge(creative.status)}
                                        </div>

                                        {/* Creative Thumbnail with Play / Preview Trigger */}
                                        <CreativeThumbnail
                                            creative={creative}
                                            onClick={() => setSelectedCreativeForPreview(creative)}
                                            isArabic={false}
                                        />

                                        {/* Metrics Row */}
                                        <div className="grid grid-cols-3 gap-2 bg-white border border-gray-200/70 rounded-xl p-3 text-center shadow-2xs">
                                            <div>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase block">Spend</span>
                                                <span className="text-sm font-bold text-gray-900 font-mono">{formatMoney(creative.spend, currency)}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase block">Leads</span>
                                                <span className="text-sm font-black text-[#4A2C5A] font-mono">{creative.leads}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase block">CPL</span>
                                                <span className="text-sm font-extrabold text-emerald-600 font-mono">{formatMoney(creative.cpl, currency)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        {creative.keyInsight ? (
                                            <div className="pt-2 border-t border-gray-100 text-xs text-gray-600 leading-snug">
                                                <strong className="text-gray-800">Insight:</strong> {creative.keyInsight}
                                            </div>
                                        ) : (
                                            <div className="pt-2 border-t border-gray-100 text-xs text-gray-500 font-mono">
                                                Status: Stable asset delivery under ongoing monitoring.
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
                                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                    Al Khoudh Villa Creatives (5 Assets)
                                </h3>
                            </div>
                            <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md">
                                Total Leads: 190 · {formatMoney(232.79, currency)} Spend
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {AL_KHOUDH_CREATIVES.map((creative) => (
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
                                            <span className="text-[9px] font-extrabold uppercase bg-gray-900 text-white px-2 py-0.5 rounded font-mono">
                                                {creative.format}
                                            </span>
                                            {getClassificationBadge(creative.status)}
                                        </div>
                                        <h4 className="text-sm sm:text-base font-bold text-gray-950">
                                            {creative.name}
                                        </h4>

                                        {/* Creative Thumbnail with Play / Preview Trigger */}
                                        <CreativeThumbnail
                                            creative={creative}
                                            onClick={() => setSelectedCreativeForPreview(creative)}
                                            isArabic={false}
                                        />

                                        {/* Metrics Row */}
                                        <div className="grid grid-cols-3 gap-2 bg-white border border-gray-200/70 rounded-xl p-3 text-center shadow-2xs">
                                            <div>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase block">Spend</span>
                                                <span className="text-xs sm:text-sm font-bold text-gray-900 font-mono">{formatMoney(creative.spend, currency)}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase block">Leads</span>
                                                <span className="text-xs sm:text-sm font-black text-[#4A2C5A] font-mono">{creative.leads}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase block">CPL</span>
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
                                        {creative.keyInsight && (
                                            <div className="pt-2 border-t border-gray-100 text-xs text-gray-600 leading-snug">
                                                <strong className="text-gray-800">Insight:</strong> {creative.keyInsight}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* ========================================================================= */}
                {/* 05. CREATIVE TEST LEARNINGS */}
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
                                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                                    Creative Insights
                                </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 mt-1">
                                Creative Test Learnings
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                What the initial performance data reveals regarding format, messaging, and audience resonance.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Learning 1 */}
                        <div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-mono">
                                        Control Winner
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                        166 Leads · {formatMoney(1.00, currency)} CPL
                                    </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug">
                                    Al Muzn 3D Video is the Primary Control Creative
                                </h4>
                                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                                    The Al Muzn 3D Video remains the primary control creative, producing 166 leads at approximately {formatMoney(1.00, currency)} CPL.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-mono text-gray-400">
                                Observation #1
                            </div>
                        </div>

                        {/* Learning 2 */}
                        <div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-mono">
                                        Early Promising
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                        34 Leads · {formatMoney(1.16, currency)} CPL
                                    </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug">
                                    Al Diyar Inspired Shows Strong Early Momentum
                                </h4>
                                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                                    Al Diyar Inspired has shown promising early performance, generating 34 leads at approximately {formatMoney(1.16, currency)} CPL despite only launching on August 27.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-mono text-gray-400">
                                Observation #2
                            </div>
                        </div>

                        {/* Learning 3 */}
                        <div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-mono">
                                        Testing Stage
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                        {formatMoney(7.95, currency)} Spend · 6 Leads
                                    </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug">
                                    Retal Inspired Requires More Data Delivery
                                </h4>
                                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                                    Retal Inspired still has insufficient spend ({formatMoney(7.95, currency)}) to make a fair performance judgment.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-mono text-gray-400">
                                Observation #3
                            </div>
                        </div>

                        {/* Learning 4 */}
                        <div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-mono">
                                        Creative Variation
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                        {formatMoney(1.03, currency)} vs {formatMoney(3.61, currency)} CPL
                                    </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug">
                                    Dark Captions Substantially Outperformed Light Captions
                                </h4>
                                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                                    For Al Khoudh, the darker-caption influencer version significantly outperformed the lighter-caption version (Dark Caption: {formatMoney(1.03, currency)} CPL vs Light Caption: {formatMoney(3.61, currency)} CPL).
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-mono text-gray-400">
                                Observation #4
                            </div>
                        </div>

                        {/* Learning 5 */}
                        <div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-mono">
                                        Traffic Engine
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                        3.00% CTR · {formatMoney(0.12, currency)} CPC
                                    </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug">
                                    Al Khoudh Image Carousel Drives Low-Cost Engagement
                                </h4>
                                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                                    The Al Khoudh Image Carousel is particularly strong at generating low-cost traffic, with approximately 3.00% CTR and {formatMoney(0.12, currency)} CPC.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-mono text-gray-400">
                                Observation #5
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ========================================================================= */}
                {/* 06. MARKETING TO SALES HANDOFF */}
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
                                <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                                    Accountability Delineation
                                </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 mt-1">
                                Marketing &rarr; Sales Handoff
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                Clear structural separation between paid media advertising responsibility and downstream sales team execution.
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
                                    <h3 className="text-sm font-black uppercase tracking-wider text-[#4A2C5A]">
                                        PAID MEDIA RESPONSIBILITY
                                    </h3>
                                </div>
                                <span className="text-[10px] font-extrabold uppercase bg-[#4A2C5A] text-white px-2 py-0.5 rounded font-mono">
                                    Marketing Scope
                                </span>
                            </div>
                            <div className="flex items-center justify-between bg-white rounded-xl p-3.5 border border-purple-100 my-3 font-mono text-xs font-bold text-gray-900 text-center">
                                <div>Ads Served</div>
                                <div className="text-purple-400">&rarr;</div>
                                <div>407 Leads Generated</div>
                                <div className="text-purple-400">&rarr;</div>
                                <div className="text-emerald-700 font-extrabold">407 Leads Sent to Sales</div>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                Paid media responsibility ends at lead generation. Campaign evaluation is governed by delivery volume, CPL, click-to-lead rates, and message initiation.
                            </p>
                        </div>

                        {/* Sales Scope */}
                        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-slate-600" />
                                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                                        SALES RESPONSIBILITY
                                    </h3>
                                </div>
                                <span className="text-[10px] font-extrabold uppercase bg-slate-700 text-white px-2 py-0.5 rounded font-mono">
                                    Sales Team Scope
                                </span>
                            </div>
                            <div className="flex items-center justify-between bg-white rounded-xl p-3.5 border border-slate-200 my-3 font-mono text-xs font-bold text-gray-800 text-center">
                                <div>Lead Contact</div>
                                <div className="text-slate-400">&rarr;</div>
                                <div>Qualification</div>
                                <div className="text-slate-400">&rarr;</div>
                                <div>Follow-Up</div>
                                <div className="text-slate-400">&rarr;</div>
                                <div className="text-purple-900 font-extrabold">Won Deals</div>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                Handled independently by sales reps. Sales closing rates, negotiations, and won contracts remain separate from advertising KPI evaluation.
                            </p>
                        </div>
                    </div>

                    {/* Sales Feedback Section */}
                    <div className="bg-gradient-to-br from-amber-50/30 via-white to-gray-50 border border-amber-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-amber-100">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">💬</span>
                                <h4 className="text-sm font-bold text-gray-900">
                                    Qualitative Sales Team Feedback
                                </h4>
                            </div>
                            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full font-mono">
                                In-Flight Feedback
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Al Khoudh Feedback */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-bold text-sky-700 font-mono uppercase">Al Khoudh Villa</span>
                                    <span className="text-[11px] font-semibold text-gray-500 font-mono">Feedback: Marwa</span>
                                </div>
                                <blockquote className="text-xs text-gray-800 italic bg-sky-50/50 p-2.5 rounded-lg border-l-2 border-sky-400">
                                    "Lead quality has been good."
                                </blockquote>
                            </div>

                            {/* Al Muzn 2 Feedback */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-bold text-purple-700 font-mono uppercase">Al Muzn 2</span>
                                    <span className="text-[11px] font-semibold text-gray-500 font-mono">Feedback: Mohammed</span>
                                </div>
                                <blockquote className="text-xs text-gray-800 italic bg-purple-50/50 p-2.5 rounded-lg border-l-2 border-purple-400">
                                    "There are currently 5 serious potential customers in the pipeline."
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ========================================================================= */}
                {/* 07. KEY INSIGHTS */}
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
                                <span className="text-xs text-gray-400 font-semibold">Executive Highlights</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 mt-1">
                                Key Insights
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                6 core takeaways synthesizing performance, efficiency, creative behavior, and sales alignment.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Insight 1 */}
                        <div className="bg-gray-50/60 border border-gray-200/70 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-mono">
                                        Portfolio Scale
                                    </span>
                                    <span className="text-xs font-mono font-bold text-gray-400">#01</span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug">
                                    Overall Investment & Lead Scale
                                </h4>
                                <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                                    Across both campaigns, {formatMoney(462.05, currency)} in spend generated 407 WhatsApp leads at a blended CPL of {formatMoney(1.14, currency)}.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-mono text-gray-400">
                                Verified Ad Performance Fact
                            </div>
                        </div>

                        {/* Insight 2 */}
                        <div className="bg-gray-50/60 border border-gray-200/70 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                                        Lead Efficiency
                                    </span>
                                    <span className="text-xs font-mono font-bold text-gray-400">#02</span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug">
                                    Al Muzn Lead Cost Efficiency
                                </h4>
                                <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                                    Al Muzn generated 217 leads at {formatMoney(1.06, currency)} CPL, outperforming Al Khoudh's {formatMoney(1.23, currency)} CPL on lead-acquisition efficiency.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-mono text-gray-400">
                                Verified Ad Performance Fact
                            </div>
                        </div>

                        {/* Insight 3 */}
                        <div className="bg-gray-50/60 border border-gray-200/70 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded font-mono">
                                        Traffic Engine
                                    </span>
                                    <span className="text-xs font-mono font-bold text-gray-400">#03</span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug">
                                    Al Khoudh Traffic & Click Efficiency
                                </h4>
                                <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                                    Al Khoudh generated traffic significantly more efficiently, with 2.49% CTR and {formatMoney(0.19, currency)} CPC compared with Al Muzn's 0.91% CTR and {formatMoney(0.61, currency)} CPC.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-mono text-gray-400">
                                Verified Ad Performance Fact
                            </div>
                        </div>

                        {/* Insight 4 */}
                        <div className="bg-gray-50/60 border border-gray-200/70 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-mono">
                                        Creative Control
                                    </span>
                                    <span className="text-xs font-mono font-bold text-gray-400">#04</span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug">
                                    Proven Control Asset
                                </h4>
                                <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                                    The Al Muzn 3D Video remains the strongest proven creative, with 166 leads at approximately {formatMoney(1.00, currency)} CPL.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-mono text-gray-400">
                                Verified Ad Performance Fact
                            </div>
                        </div>

                        {/* Insight 5 */}
                        <div className="bg-gray-50/60 border border-gray-200/70 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-mono">
                                        A/B Learning
                                    </span>
                                    <span className="text-xs font-mono font-bold text-gray-400">#05</span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug">
                                    Caption Contrast Impact on Conversions
                                </h4>
                                <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                                    The Al Khoudh darker-caption influencer video generated leads much more efficiently than the lighter-caption version ({formatMoney(1.03, currency)} vs {formatMoney(3.61, currency)} CPL).
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-mono text-gray-400">
                                Verified Ad Performance Fact
                            </div>
                        </div>

                        {/* Insight 6 */}
                        <div className="bg-gray-50/60 border border-gray-200/70 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A2C5A]/40 transition-all shadow-2xs">
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded font-mono">
                                        Sales Alignment
                                    </span>
                                    <span className="text-xs font-mono font-bold text-gray-400">#06</span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug">
                                    Positive Qualitative Sales Feedback
                                </h4>
                                <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                                    Sales feedback is positive so far, with good lead-quality feedback for Al Khoudh and 5 serious prospects currently in the Al Muzn pipeline.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/50 text-[10px] font-mono text-gray-400">
                                Verified Ad Performance Fact
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ========================================================================= */}
                {/* 08. WHAT WE'RE DOING NEXT */}
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
                                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                                    Operational Strategy
                                </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950 mt-1">
                                What We're Doing Next
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                Tactical next steps for creative testing, asset prioritization, and budget management.
                            </p>
                        </div>
                    </div>

                    {/* Action Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {/* Action 1 */}
                        <div className="bg-gray-50/50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xs transition-all">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md font-mono border bg-blue-100 text-blue-800 border-blue-200">
                                        MAINTAIN
                                    </span>
                                    <span className="text-[10px] font-mono text-gray-400 truncate max-w-[150px]">
                                        Al Muzn 2 · 3D Video Ad
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-950 mb-1.5">
                                    Al Muzn 3D Video
                                </h4>
                                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                                    Continue using the 3D Video as the primary control creative.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/60 text-xs text-gray-500 font-mono">
                                <strong className="text-gray-700">Rationale:</strong> Proven reliability with 166 leads at approximately {formatMoney(1.00, currency)} CPL.
                            </div>
                        </div>

                        {/* Action 2 */}
                        <div className="bg-gray-50/50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xs transition-all">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md font-mono border bg-purple-100 text-purple-800 border-purple-200">
                                        CONTINUE TESTING
                                    </span>
                                    <span className="text-[10px] font-mono text-gray-400 truncate max-w-[150px]">
                                        Al Muzn 2 · Al Diyar Inspired Ad
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-950 mb-1.5">
                                    Al Diyar Inspired Video
                                </h4>
                                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                                    Continue running and gathering more delivery data.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/60 text-xs text-gray-500 font-mono">
                                <strong className="text-gray-700">Rationale:</strong> Promising early start (34 leads at ~{formatMoney(1.16, currency)} CPL) launched on Aug 27.
                            </div>
                        </div>

                        {/* Action 3 */}
                        <div className="bg-gray-50/50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xs transition-all">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md font-mono border bg-purple-100 text-purple-800 border-purple-200">
                                        CONTINUE TESTING
                                    </span>
                                    <span className="text-[10px] font-mono text-gray-400 truncate max-w-[150px]">
                                        Al Muzn 2 · Retal Inspired Ad
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-950 mb-1.5">
                                    Retal Inspired Video
                                </h4>
                                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                                    Continue gathering data before making a final decision.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/60 text-xs text-gray-500 font-mono">
                                <strong className="text-gray-700">Rationale:</strong> Only {formatMoney(7.95, currency)} has been spent so far; delivery volume is still low.
                            </div>
                        </div>

                        {/* Action 4 */}
                        <div className="bg-gray-50/50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xs transition-all">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md font-mono border bg-emerald-100 text-emerald-800 border-emerald-200">
                                        NEW CREATIVE
                                    </span>
                                    <span className="text-[10px] font-mono text-gray-400 truncate max-w-[150px]">
                                        Al Muzn 2 · Lodha Richmond Inspired
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-950 mb-1.5">
                                    New Al Muzn 2 Video (August 29)
                                </h4>
                                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                                    Today we will be adding a new Al Muzn 2 video creative inspired by popular developer Lodha Richmond.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/60 text-xs text-gray-500 font-mono">
                                <strong className="text-gray-700">Rationale:</strong> Purpose: Test another strong real-estate creative direction against the Al Muzn Campaign CPL (~{formatMoney(1.06, currency)}) & 3D Control CPL (~{formatMoney(1.00, currency)}).
                            </div>
                        </div>

                        {/* Action 5 */}
                        <div className="bg-gray-50/50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xs transition-all">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md font-mono border bg-indigo-100 text-indigo-800 border-indigo-200">
                                        PRIORITIZE
                                    </span>
                                    <span className="text-[10px] font-mono text-gray-400 truncate max-w-[150px]">
                                        Al Khoudh Villa · Dark Captions
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-950 mb-1.5">
                                    Al Khoudh Dark-Caption Video
                                </h4>
                                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                                    Continue prioritizing this version over the lighter-caption variant.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/60 text-xs text-gray-500 font-mono">
                                <strong className="text-gray-700">Rationale:</strong> Dark Caption CPL = {formatMoney(1.03, currency)} vs Light Caption CPL = {formatMoney(3.61, currency)}.
                            </div>
                        </div>

                        {/* Action 6 */}
                        <div className="bg-gray-50/50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xs transition-all">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md font-mono border bg-rose-100 text-rose-800 border-rose-200">
                                        REDUCE / PAUSE
                                    </span>
                                    <span className="text-[10px] font-mono text-gray-400 truncate max-w-[150px]">
                                        Al Khoudh Villa · Light Captions
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-950 mb-1.5">
                                    Al Khoudh Light-Caption Video
                                </h4>
                                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                                    Consider reducing or pausing this variation.
                                </p>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200/60 text-xs text-gray-500 font-mono">
                                <strong className="text-gray-700">Rationale:</strong> Current CPL is {formatMoney(3.61, currency)}, significantly above campaign average and dark version.
                            </div>
                        </div>
                    </div>

                    {/* Monitoring Framework */}
                    <div className="bg-gradient-to-br from-purple-50/30 via-white to-gray-50 border-2 border-purple-200/70 rounded-2xl p-5 sm:p-6 space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded font-mono">
                                MONITORING AGENDA
                            </span>
                            <h4 className="text-sm font-bold text-gray-950">
                                Key Signals Tracked Throughout Next Cycle
                            </h4>
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-gray-700 font-medium pt-1">
                            <li className="flex items-start gap-2 bg-white/80 border border-gray-200/60 rounded-xl p-3 shadow-2xs">
                                <span className="text-purple-600 font-bold">&bull;</span>
                                <span>Whether Al Diyar maintains its CPL as spend increases over the coming days.</span>
                            </li>
                            <li className="flex items-start gap-2 bg-white/80 border border-gray-200/60 rounded-xl p-3 shadow-2xs">
                                <span className="text-purple-600 font-bold">&bull;</span>
                                <span>Performance of the new Lodha Richmond-inspired Al Muzn video after launch today.</span>
                            </li>
                            <li className="flex items-start gap-2 bg-white/80 border border-gray-200/60 rounded-xl p-3 shadow-2xs">
                                <span className="text-purple-600 font-bold">&bull;</span>
                                <span>Whether Al Muzn continues operating around the ~{formatMoney(1.00, currency)} CPL baseline benchmark.</span>
                            </li>
                            <li className="flex items-start gap-2 bg-white/80 border border-gray-200/60 rounded-xl p-3 shadow-2xs">
                                <span className="text-purple-600 font-bold">&bull;</span>
                                <span>Al Khoudh frequency trends and early creative fatigue signals.</span>
                            </li>
                            <li className="flex items-start gap-2 bg-white/80 border border-gray-200/60 rounded-xl p-3 shadow-2xs col-span-1 md:col-span-2">
                                <span className="text-purple-600 font-bold">&bull;</span>
                                <span>Continued qualitative lead-quality feedback from sales representatives.</span>
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
                isArabic={false}
            />
        </div>
    );
};

export default App_en;
