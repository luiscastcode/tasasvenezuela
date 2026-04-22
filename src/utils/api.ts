// API utility functions for fetching exchange rates

// ============================================================================
// 📦 TIPOS COMPARTIDOS (definidos localmente para evitar dependencias circulares)
// ============================================================================

export interface ExchangeRate {
  name: string;
  code: string;
  rate: number;
  lastUpdate: string;
  symbol: string;
}

export interface DollarHistoricalRaw {
  fuente: 'oficial' | 'paralelo';
  compra: number;
  venta: number;
  promedio: number;
  fecha: string; // formato ISO: "YYYY-MM-DD"
}

export interface ChartDataPoint {
  time: string; // Lightweight Charts: "YYYY-MM-DD"
  oficial: number;
  paralelo: number;
}

// ============================================================================
// 🌐 UTILIDADES DE FETCH
// ============================================================================

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

// ============================================================================
// 💱 FUNCIONES EXISTENTES (BCV, Euro, USDT)
// ============================================================================

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
 * Fetch BCV Euro rate from DolarApi.com
 */
export async function getBCVEuroRate(bcvDollarRate?: number): Promise<ExchangeRate> {
  try {
    console.log('[API] Fetching BCV Euro rate...');
    const response = await fetchWithTimeout('https://ve.dolarapi.com/v1/euros/oficial');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const rate = data.promedio || data.precio || 0;
    
    // Si no viene rate directo, calcular desde dólar BCV si se proporcionó
    const finalRate = rate > 0 ? rate : (bcvDollarRate ? bcvDollarRate * 1.08 : 0);
    
    console.log('[API] BCV Euro rate fetched successfully:', finalRate);

    return {
      name: 'Euro BCV',
      code: 'EUR',
      rate: finalRate,
      lastUpdate: data.fechaActualizacion || new Date().toISOString(),
      symbol: '€'
    };
  } catch (error) {
    console.error('[API] Error fetching BCV Euro rate:', error);
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

// ============================================================================
// 📊 NUEVAS FUNCIONES PARA GRÁFICO HISTÓRICO (integradas aquí)
// ============================================================================

const HISTORICAL_BASE_URL = 'https://ve.dolarapi.com/v1/historicos/dolares';

/**
 * ✅ Fetch histórico de dólares (oficial + paralelo) para gráficos
 * Retorna array plano que luego se agrupa por fecha
 */
export async function fetchDollarHistorical(): Promise<DollarHistoricalRaw[]> {
  try {
    console.log('[API] Fetching historical dollar data...');
    const response = await fetchWithTimeout(HISTORICAL_BASE_URL, 10000); // 10s timeout para histórico

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[API] Historical data fetched: ${Array.isArray(data) ? data.length : 0} records`);
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('[API] Error fetching historical dollar data:', error);
    return []; // Retorna array vacío para evitar crash en SSR
  }
}

/**
 * ✅ Filtra y agrupa datos históricos por rango de días para el chart
 * Convierte datos crudos en puntos unificados (oficial + paralelo por fecha)
 */
// api.ts

// 1. Función para procesar datos crudos a ChartDataPoint[]
export function processHistoricalData(rawData: DollarHistoricalRaw[]): ChartDataPoint[] {
  if (!Array.isArray(rawData) || rawData.length === 0) return [];

  const grouped = new Map<string, { oficial?: number; paralelo?: number }>();

  rawData.forEach((item) => {
    try {
      const itemDate = new Date(item.fecha);
      if (!isNaN(itemDate.getTime())) {
        const existing = grouped.get(item.fecha) || {};
        if (item.fuente === 'oficial') {
          existing.oficial = typeof item.promedio === 'number' ? item.promedio : 0;
        } else if (item.fuente === 'paralelo') {
          existing.paralelo = typeof item.promedio === 'number' ? item.promedio : 0;
        }
        grouped.set(item.fecha, existing);
      }
    } catch (e) {
      console.warn(`[API] Skipping invalid date entry:`, item, e);
    }
  });

  // Convertir a ChartDataPoint[] ordenado por fecha
  return Array.from(grouped.entries())
    .map(([fecha, values]) => ({
      time: fecha,
      oficial: values.oficial ?? 0,
      paralelo: values.paralelo ?? 0,
    }))
    .filter(point => point.oficial > 0 || point.paralelo > 0)
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
}

// 2. Función para filtrar ChartDataPoint[] por días
export function filterDataByDays(
  data: ChartDataPoint[],
  days: 7 | 15 | 30
): ChartDataPoint[] {
  if (!Array.isArray(data) || data.length === 0) return [];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  cutoffDate.setHours(0, 0, 0, 0);

  return data.filter((point) => {
    const pointDate = new Date(point.time);
    return pointDate >= cutoffDate;
  });
}

// 3. Función combinada para conveniencia
export async function fetchAndProcessDollarData(days?: 7 | 15 | 30): Promise<ChartDataPoint[]> {
  const rawData = await fetchDollarHistorical();
  const processed = processHistoricalData(rawData);
  return days ? filterDataByDays(processed, days) : processed;
}

// ============================================================================
// 🎨 FORMATEADORES (existentes)
// ============================================================================

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
  if (isNaN(date.getTime())) return dateString;
  
  return new Intl.DateTimeFormat('es-VE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Format date as dd/mm/yyyy (para tooltips del chart)
 */
export function formatDateShort(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  if (!day || !month || !year) return dateString;
  return `${day}/${month}/${year}`;
}