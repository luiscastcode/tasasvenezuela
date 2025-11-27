// API utility functions for fetching exchange rates

export interface ExchangeRate {
  name: string;
  code: string;
  rate: number;
  lastUpdate: string;
  symbol: string;
}

/**
 * Fetch with timeout to prevent hanging requests
 */
async function fetchWithTimeout(url: string, timeout = 8000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Fetch BCV Dollar rate from DolarApi.com
 */
export async function getBCVDollarRate(): Promise<ExchangeRate> {
  try {
    console.log('[API] Fetching BCV Dollar rate...');
    const response = await fetchWithTimeout('https://ve.dolarapi.com/v1/dolares/oficial');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[API] BCV Dollar rate fetched successfully:', data.promedio || data.precio);

    return {
      name: 'Dólar BCV',
      code: 'USD',
      rate: data.promedio || data.precio || 0,
      lastUpdate: data.fechaActualizacion || new Date().toISOString(),
      symbol: '$'
    };
  } catch (error) {
    console.error('[API] Error fetching BCV Dollar rate:', error);
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
export async function getBCVEuroRate(bcvDollarRate?: number): Promise<ExchangeRate> {
  try {
    console.log('[API] Fetching Euro rate...');

    // Use provided BCV rate or fetch it
    let bcvRate = bcvDollarRate;
    if (!bcvRate) {
      const bcvDollar = await getBCVDollarRate();
      bcvRate = bcvDollar.rate;
    }

    // Get USD/EUR exchange rate from a free API
    const response = await fetchWithTimeout('https://api.exchangerate-api.com/v4/latest/USD');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const usdToEur = data.rates.EUR || 0.92; // Fallback to approximate rate

    // Calculate Euro in Bs: (BCV Dollar rate) / (USD to EUR rate)
    const euroRate = bcvRate / usdToEur;
    console.log('[API] Euro rate calculated successfully:', euroRate);

    return {
      name: 'Euro BCV',
      code: 'EUR',
      rate: euroRate,
      lastUpdate: new Date().toISOString(),
      symbol: '€'
    };
  } catch (error) {
    console.error('[API] Error fetching Euro rate:', error);
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
 * Fetch USDT rate from parallel market (DolarApi)
 */
export async function getUSDTRate(): Promise<ExchangeRate> {
  try {
    console.log('[API] Fetching USDT rate...');
    const response = await fetchWithTimeout('https://ve.dolarapi.com/v1/dolares/paralelo');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const rate = data.promedio || data.precio || 0;
    console.log('[API] USDT rate fetched successfully:', rate);

    return {
      name: 'USDT (Bybit)',
      code: 'USDT',
      rate: rate,
      lastUpdate: data.fechaActualizacion || new Date().toISOString(),
      symbol: '₮'
    };
  } catch (error) {
    console.error('[API] Error fetching USDT rate:', error);
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
    console.log('[API] Fetching all rates...');

    // Fetch BCV Dollar first, then use it for Euro calculation to avoid duplicate calls
    const bcvDollar = await getBCVDollarRate();
    const [bcvEuro, usdt] = await Promise.all([
      getBCVEuroRate(bcvDollar.rate),
      getUSDTRate()
    ]);

    const rates = [bcvDollar, usdt, bcvEuro];
    console.log('[API] All rates fetched successfully');

    return rates;
  } catch (error) {
    console.error('[API] Error fetching all rates:', error);
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
