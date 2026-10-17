export type Language = 'en' | 'id';

export interface TokenAllocation {
  id: string;
  categoryEn: string;
  categoryFaId: string;
  percentage: number;
  tokens: number;
  color: string;
  status: 'Planned' | 'Allocated' | 'Verified';
  descriptionEn: string;
  descriptionId: string;
}

export interface EcosystemProduct {
  id: string;
  name: string;
  status: 'Active' | 'In Development' | 'Planned';
  descriptionEn: string;
  descriptionId: string;
  specs: string[];
  image: string;
}

export interface RoadmapPhase {
  phase: string;
  titleEn: string;
  titleId: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  itemsEn: string[];
  itemsId: string[];
}

export interface MarketData {
  priceUsd: number | null;
  priceChange24h: number | null;
  volume24h: number | null;
  liquidityUsd: number | null;
  marketCapUsd: number | null;
  pairAddress: string | null;
  dexName: string | null;
  status: 'Live' | 'Delayed' | 'Stale' | 'Unavailable';
  lastUpdated: string | null;
  source: string;
  priceHistory: { timestamp: number; price: number }[];
}

export interface OnChainData {
  targetSupply: number;
  onChainSupply: string | null;
  decimals: number;
  name: string;
  symbol: string;
  status: 'Verified' | 'Verification Pending' | 'Error';
  lastChecked: string | null;
  rawBalanceHex?: string;
  errorMessage?: string;
}

export interface RealWorldScenario {
  id: string;
  timestamp: number;
  duration: number;
  titleEn: string;
  titleId: string;
  descEn: string;
  descId: string;
  tagEn: string;
  tagId: string;
  image: string;
  fallbackImage?: string;
  telemetryEn: string;
  telemetryId: string;
  amountSar: string;
  merchantOrNode: string;
}

