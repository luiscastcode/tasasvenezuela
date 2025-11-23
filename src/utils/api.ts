// API utility functions for fetching exchange rates

export interface ExchangeRate {
  name: string;
  code: string;
  rate: number;
  lastUpdate: string;
  symbol: string;
}

/**
 * Fetch BCV Dollar rate from DolarApi.com
 */
export async function getBCVDollarRate(): Promise<ExchangeRate> {
  try {
    const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      name: 'Dólar BCV',
      code: 'USD',
      rate: data.promedio || data.precio || 0,
      lastUpdate: data.fechaActualizacion || new Date().toISOString(),
      symbol: '$'
    };
  } catch (error) {
    console.error('Error fetching BCV Dollar rate:', error);
    // Return fallback data
    return {
      name: 'Dólar BCV',
      code: 'USD',
      rate: 0,
      lastUpdate: new Date().toISOString(),
      symbol: '$'
    };
  }
}

/**
 * Fetch Euro rate (calculated from USD/EUR conversion + BCV dollar rate)
 */
export async function getBCVEuroRate(): Promise<ExchangeRate> {
  try {
    // Get BCV Dollar rate first
    const bcvDollar = await getBCVDollarRate();

    // Get USD/EUR exchange rate from a free API
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const usdToEur = data.rates.EUR || 0.92; // Fallback to approximate rate

    // Calculate Euro in Bs: (BCV Dollar rate) / (USD to EUR rate)
    const euroRate = bcvDollar.rate / usdToEur;

    return {
      name: 'Euro BCV',
      code: 'EUR',
      rate: euroRate,
      lastUpdate: new Date().toISOString(),
      symbol: '€'
    };
  } catch (error) {
    console.error('Error fetching Euro rate:', error);
    return {
      name: 'Euro BCV',
      code: 'EUR',
      rate: 0,
      lastUpdate: new Date().toISOString(),
      symbol: '€'
    };
  }
}

/**
 * Fetch USDT rate (using free alternative: crypto price API + BCV rate)
 */
export async function getUSDTRate(): Promise<ExchangeRate> {
  try {
    // Get BCV Dollar rate
    const bcvDollar = await getBCVDollarRate();

    // Get USDT price in USD from CoinGecko (free API)
    const response = await fetch('https://ve.dolarapi.com/v1/dolares/paralelo');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const usdtInUsd = data.tether?.usd || 1; // USDT is typically ~$1

    // Calculate USDT in Bs: USDT price in USD * BCV Dollar rate
    const usdtRate = usdtInUsd * bcvDollar.rate;

    return {
      name: 'USDT (Bybit)',
      code: 'USDT',
      rate: data.promedio || data.precio || 0,
      lastUpdate: data.fechaActualizacion || new Date().toISOString(),
      symbol: '₮'
    };
  } catch (error) {
    console.error('Error fetching USDT rate:', error);
    return {
      name: 'USDT (Bybit)',
      code: 'USDT',
      rate: 0,
      lastUpdate: new Date().toISOString(),
      symbol: '₮'
    };
  }
}

/**
 * Fetch all exchange rates
 */
export async function getAllRates(): Promise<ExchangeRate[]> {
  try {
    const [bcvDollar, bcvEuro, usdt] = await Promise.all([
      getBCVDollarRate(),
      getBCVEuroRate(),
      getUSDTRate()
    ]);

    return [bcvDollar, usdt, bcvEuro];
  } catch (error) {
    console.error('Error fetching all rates:', error);
    return [];
  }
}

/**
 * Format number as Venezuelan Bolívares
 */
export function formatBs(amount: number): string {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format number with currency symbol
 */
export function formatCurrency(amount: number, symbol: string): string {
  return `${symbol}${new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)}`;
}

/**
 * Format date to Spanish locale
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-VE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
