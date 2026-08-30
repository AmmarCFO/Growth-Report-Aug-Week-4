
export enum ScenarioType {
  HYBRID = 'HYBRID',
  LONG_TERM = 'LONG_TERM',
  SHORT_TERM = 'SHORT_TERM',
}

export interface UnitMixItem {
  name: string;
  count: number;
  avgPrice: number;
  priceRange?: {
    min: number;
    max: number;
    avg: number;
  };
  videoUrl?: string;
}

export interface CaseFinancials {
  revenue: number;
  netIncome: number;
  mabaatShare: number;
  roi: number;
}

export interface Scenario {
  id: string;
  type: ScenarioType;
  name: string;
  color: string;
  description: string;
  financials: {
    worst: CaseFinancials;
    base: CaseFinancials;
    best: CaseFinancials;
  };
  propertyValue: number;
  unitCount: number;
  unitLabel: string;
  occupancyDurationLabel: string;
  unitMix: UnitMixItem[];
}

export interface MarketingVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface ComparisonLink {
  platform: string;
  title: string;
  url: string;
  location?: string;
  area?: string;
  price?: number;
  type?: string;
  period?: string;
  photosUrl?: string;
}

export interface Tenant {
  name: string;
  branch: string;
  unit: string;
  source: string;
  duration: string;
  rent: number;
  status: 'Confirmed' | 'Pending' | 'Canceled' | 'Contract Issued';
  cashCollected: number;
  mathwaaRevenue: number;
}

export interface SalesPerformanceItem {
  name: string;
  januaryValue: number;
  lifetimeValue: number;
}

export enum ApartmentStatus {
  VACANT = 'VACANT',
  RENTED = 'RENTED',
  RESERVED = 'RESERVED',
}

export enum ApartmentType {
  STUDIO = 'Studio',
  ONE_BEDROOM = '1 Bedroom',
  TWO_BEDROOM = '2 Bedroom',
}

export interface Apartment {
  id: string;
  number: string;
  type: ApartmentType;
  status: ApartmentStatus;
  monthlyRent: number;
  cashCollected: number;
  lifetimeValue: number;
  contractDurationMonths?: number;
  howHeard?: string;
}

export interface Branch {
  id: string;
  name: string;
  targetYearlyRevenue: {
    min: number;
    max: number;
  };
  apartments: Apartment[];
}

export interface NewBooking {
  branchId: string;
  apartmentId: string;
  contractDurationMonths: number;
  howHeard: string;
}

export interface RawDeal {
  id: number;
  tenantName: string;
  branch: string;
  location: string;
  channel: string;
  channelType: string;
  isPaidSocial: boolean;
  monthlyRent: number | null;
  committedMonths: number;
  committedGross: number;
  annualContract: boolean;
  mgmtFeePct: number;
  mathwaaNet: number;
  salesRep: string;
  contractStart: string;
  notes: string;
}

// ==========================================
// META PAID ADS PERFORMANCE REPORT TYPES
// ==========================================

export type Currency = 'USD' | 'OMR' | 'SAR';

export type CampaignStatus = 'Strong' | 'Monitor' | 'Weak' | 'Pending';
export type CreativeClassification = 
  | 'Established Winner / Control' 
  | 'Promising / Continue Testing' 
  | 'Monitor' 
  | 'Early Testing' 
  | 'Winner / Prioritize' 
  | 'Strong' 
  | 'Strong Traffic Generator' 
  | 'Pause / Reduce Candidate';

export interface MetaExecutiveSummary {
  reportPeriod: string;
  totalSpend: number;
  totalLeads: number;
  blendedCPL: number;
  totalImpressions: number;
  totalLinkClicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  clickToLeadRate: number;
  activeCampaigns: number;
  activeAdSets: number;
  activeCreatives: number;
  summaryNote: string;
}

export interface AlMuznDailyPoint {
  date: string;
  dayLabel: string;
  spend: number;
  leads: number;
  cpl: number;
  isPartial?: boolean;
}

export interface CampaignComparisonData {
  id: string;
  name: string;
  nameAr: string;
  spend: number;
  leads: number;
  cpl: number;
  impressions: number;
  linkClicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  clickToLeadRate: number;
  dailyBudget: number;
  adSetsCount: number;
  highlightInsight: string;
  highlightInsightAr: string;
  funnelRole: string;
  funnelRoleAr: string;
}

export interface AbrajCreativeItem {
  id: string;
  name: string;
  nameAr: string;
  campaign: 'Al Muzn 2' | 'Al Khoudh Villa';
  campaignAr: string;
  format: 'Video' | 'Image Carousel';
  launchDate?: string;
  spend: number;
  leads: number;
  cpl: number;
  ctr?: number;
  cpc?: number;
  cpm?: number;
  status: CreativeClassification;
  statusAr: string;
  keyInsight?: string;
  keyInsightAr?: string;
  badgeType: 'winner' | 'promising' | 'testing' | 'monitor' | 'pause';
  driveUrl?: string;
  driveFileId?: string;
}

export interface CreativeLearningPoint {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  metricBadge?: string;
  category: 'Control Winner' | 'Early Promising' | 'Testing Stage' | 'Creative Variation' | 'Traffic Engine';
}

export interface KeyInsightItem {
  id: number;
  number: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  tag: string;
  tagAr: string;
  accent: 'purple' | 'emerald' | 'sky' | 'amber' | 'indigo';
}

export interface NextActionItem {
  type: 'MAINTAIN' | 'CONTINUE TESTING' | 'NEW CREATIVE' | 'PRIORITIZE' | 'REDUCE / PAUSE' | 'MONITOR';
  badgeColor: string;
  title: string;
  titleAr: string;
  targetAsset?: string;
  actionText: string;
  actionTextAr: string;
  reasonOrBenchmark: string;
  reasonOrBenchmarkAr: string;
}


