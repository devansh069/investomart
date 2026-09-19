export type AssetCategory = 'stocks' | 'crypto' | 'mutual_funds' | 'commodities';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  category: AssetCategory;
  price: number;
  change24h: number;
  marketCap: string;
  holdings?: number;
  value?: number;
  color: string;
}

export interface PortfolioSummary {
  totalBalance: number;
  investedAmount: number;
  todaysReturns: number;
  todaysReturnsPercentage: number;
  totalReturns: number;
  totalReturnsPercentage: number;
}

export interface Transaction {
  id: string;
  assetSymbol: string;
  assetName: string;
  type: 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  units?: number;
  date: string;
  status: 'COMPLETED' | 'PENDING';
}

export interface UserProfile {
  name: string;
  tag: string;
  email: string;
  kycVerified: boolean;
  avatarUrl?: string;
  currency: string;
}
