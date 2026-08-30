export type Currency = 'USD' | 'OMR' | 'SAR';

export const CURRENCY_RATES: Record<Currency, number> = {
  USD: 1.0,
  OMR: 0.38,
  SAR: 3.79,
};

export const CURRENCY_CONFIGS: Record<Currency, {
  code: Currency;
  name: string;
  nameAr: string;
  symbol: string;
  symbolAr: string;
  rate: number;
  decimals: number;
}> = {
  USD: {
    code: 'USD',
    name: 'US Dollar',
    nameAr: 'دولار أمريكي',
    symbol: '$',
    symbolAr: '$',
    rate: 1.0,
    decimals: 2,
  },
  OMR: {
    code: 'OMR',
    name: 'Omani Rial',
    nameAr: 'ريال عماني',
    symbol: 'OMR',
    symbolAr: 'ر.ع',
    rate: 0.38,
    decimals: 2,
  },
  SAR: {
    code: 'SAR',
    name: 'Saudi Riyal',
    nameAr: 'ريال سعودي',
    symbol: 'SAR',
    symbolAr: 'ر.س',
    rate: 3.79,
    decimals: 2,
  },
};

export function convertAmount(usdAmount: number, currency: Currency): number {
  return usdAmount * CURRENCY_RATES[currency];
}

export function formatMoney(
  usdAmount: number,
  currency: Currency = 'USD',
  options?: {
    decimals?: number;
    isArabic?: boolean;
    showSymbol?: boolean;
  }
): string {
  const isAr = options?.isArabic ?? false;
  const config = CURRENCY_CONFIGS[currency];
  const converted = usdAmount * config.rate;
  const decimals = options?.decimals ?? config.decimals;
  const showSymbol = options?.showSymbol ?? true;

  const formattedNumber = converted.toLocaleString(isAr ? 'ar-OM' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (!showSymbol) return formattedNumber;

  if (currency === 'USD') {
    return `$${formattedNumber}`;
  }

  if (isAr) {
    return `${formattedNumber} ${config.symbolAr}`;
  }

  return `${formattedNumber} ${config.symbol}`;
}
