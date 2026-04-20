import type { ExchangeRate } from "./api";

export interface RateHistoryPoint {
  date: string;
  rate: number;
  differentialPercent?: number;
}

export interface RateHistorySeries {
  code: string;
  name: string;
  symbol: string;
  points: RateHistoryPoint[];
  isDifferential?: boolean;
}

export interface RateStat {
  code: string;
  name: string;
  symbol: string;
  currentRate: number;
  previousRate: number;
  variation: number;
  formattedVariation: string;
  average30: number;
  min30: number;
  max30: number;
  volatility30: number;
}

export interface RateStats {
  variations: RateStat[];
  spreadAmount: number;
  spreadPercent: number;
  euroUsdtRatio: number;
  euroUsdtDiffAmount: number;
  euroUsdtDiffPercent: number;
  trendLabel: string;
  trendScore: number;
  histories: Record<number, RateHistorySeries[]>;
}

function formatShortDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}

/**
 * Fetch historical exchange rates from the API
 */
async function fetchHistoricalRates(): Promise<{ fecha: string; promedio: number }[]> {
  try {
    const response = await fetch('https://ve.dolarapi.com/v1/historicos/dolares/oficial');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching historical rates:', error);
    return [];
  }
}

function normalizeHistory(values: number[], target: number): number[] {
  const scale = values.length ? target / values[values.length - 1] : 1;
  return values.map((value) => Number((value * scale).toFixed(2)));
}

async function buildHistoryPoints(rate: ExchangeRate, days: number, seed = 0, usdRate?: ExchangeRate): Promise<RateHistorySeries> {
  // Try to fetch real historical data
  const historicalData = await fetchHistoricalRates();

  if (historicalData.length > 0 && rate.code === "USD") {
    // Use real data from API for USD
    const today = new Date();
    const cutoffDate = new Date(today);
    cutoffDate.setDate(today.getDate() - days);

    // Filter and sort data by date (most recent first)
    const filteredData = historicalData
      .filter(item => new Date(item.fecha) >= cutoffDate)
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      .slice(-days); // Take the last 'days' entries

    const points = filteredData.map((item) => ({
      date: formatShortDate(new Date(item.fecha)),
      rate: item.promedio,
    }));

    // If we don't have enough data, fill with current rate
    while (points.length < days) {
      const date = new Date(today);
      date.setDate(today.getDate() - (days - points.length));
      points.unshift({
        date: formatShortDate(date),
        rate: rate.rate || 0,
      });
    }

    return {
      code: rate.code,
      name: rate.name,
      symbol: rate.symbol,
      points,
    };
  } else if (historicalData.length > 0 && rate.code === "EUR" && usdRate) {
    // Calculate EUR history based on USD history and current EUR/USD ratio
    const today = new Date();
    const cutoffDate = new Date(today);
    cutoffDate.setDate(today.getDate() - days);

    const filteredData = historicalData
      .filter(item => new Date(item.fecha) >= cutoffDate)
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      .slice(-days);

    const eurUsdRatio = usdRate.rate ? rate.rate / usdRate.rate : 1;
    const points = filteredData.map((item) => ({
      date: formatShortDate(new Date(item.fecha)),
      rate: Number((item.promedio * eurUsdRatio).toFixed(2)),
    }));

    // If we don't have enough data, fill with current rate
    while (points.length < days) {
      const date = new Date(today);
      date.setDate(today.getDate() - (days - points.length));
      points.unshift({
        date: formatShortDate(date),
        rate: rate.rate || 0,
      });
    }

    return {
      code: rate.code,
      name: rate.name,
      symbol: rate.symbol,
      points,
    };
  } else {
    // Fallback to simulated data for USDT or when API fails
    console.warn(`Using simulated data for ${rate.code}`);
    const today = new Date();
    const rawValues = Array.from({ length: days }, (_, idx) => {
      const trend = (idx - days / 2) * 0.00012;
      const oscillation =
        Math.sin((idx + seed) * 0.82) * 0.008 + Math.cos((idx + seed) * 1.47) * 0.004;
      return 1 + trend + oscillation;
    });

    const values = normalizeHistory(rawValues, rate.rate || 1);

    const points = values.map((value, idx) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (days - 1 - idx));
      return {
        date: formatShortDate(date),
        rate: value,
      };
    });

    return {
      code: rate.code,
      name: rate.name,
      symbol: rate.symbol,
      points,
    };
  }
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return Number(
    (values.reduce((sum, current) => sum + current, 0) / values.length).toFixed(2),
  );
}

function minValue(values: number[]): number {
  return values.length ? Math.min(...values) : 0;
}

function maxValue(values: number[]): number {
  return values.length ? Math.max(...values) : 0;
}

function volatility(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = values.reduce((sum, current) => sum + current, 0) / values.length;
  const variance =
    values.reduce((sum, current) => sum + (current - avg) ** 2, 0) / values.length;
  return Number(Math.sqrt(variance).toFixed(2));
}

function computeVariation(current: number, previous: number): number {
  if (!previous) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(2));
}

function trendLabelForScore(score: number): string {
  if (score >= 0.5) return "Alcista";
  if (score <= -0.5) return "Bajista";
  return "Estable";
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function calculateSpread(official: number, usdt: number): number {
  return Number((usdt - official).toFixed(2));
}

export function calculateSpreadPercent(official: number, usdt: number): number {
  if (!official) return 0;
  return Number((((usdt - official) / official) * 100).toFixed(2));
}

export async function getRateStats(rates: ExchangeRate[]): Promise<RateStats> {
  // Filter to only USD, USDT and EUR rates
  const usdRate = rates.find((rate) => rate.code === "USD" && rate.name.toLowerCase().includes("bcv"));
  const usdtRate = rates.find((rate) => rate.code === "USDT");
  const euroRate = rates.find((rate) => rate.code === "EUR");

  if (!usdRate || !usdtRate || !euroRate) {
    // Fallback if rates not found
    return {
      variations: [],
      spreadAmount: 0,
      spreadPercent: 0,
      euroUsdtRatio: 0,
      euroUsdtDiffAmount: 0,
      euroUsdtDiffPercent: 0,
      trendLabel: "Estable",
      trendScore: 0,
      histories: { 7: [], 15: [], 30: [] },
    };
  }

  // Build histories for USD, USDT and EUR
  const usdHistory30 = await buildHistoryPoints(usdRate, 30, 0);
  const usdtHistory30 = await buildHistoryPoints(usdtRate, 30, 7);
  const euroHistory30 = await buildHistoryPoints(euroRate, 30, 14, usdRate);

  // Calculate differential percentage history
  const differentialHistory30: RateHistorySeries = {
    code: "DIFF",
    name: "Diferencial USD/USDT",
    symbol: "%",
    isDifferential: true,
    points: usdHistory30.points.map((usdPoint, index) => {
      const usdtPoint = usdtHistory30.points[index];
      const differential = usdtPoint.rate && usdPoint.rate
        ? Number((((usdtPoint.rate - usdPoint.rate) / usdPoint.rate) * 100).toFixed(2))
        : 0;
      return {
        date: usdPoint.date,
        rate: differential,
        differentialPercent: differential,
      };
    }),
  };

  const histories30 = [usdHistory30, usdtHistory30, euroHistory30, differentialHistory30];

  // Calculate variations for USD, USDT and EUR
  const variations: RateStat[] = [usdHistory30, usdtHistory30, euroHistory30].map((series) => {
    const last = series.points[series.points.length - 1]?.rate || 0;
    const previous = series.points[series.points.length - 2]?.rate || last;
    const variation = computeVariation(last, previous);
    const values = series.points.map((point) => point.rate);

    return {
      code: series.code,
      name: series.name,
      symbol: series.symbol,
      currentRate: last,
      previousRate: previous,
      variation,
      formattedVariation: formatPercent(variation),
      average30: average(values),
      min30: minValue(values),
      max30: maxValue(values),
      volatility30: volatility(values),
    };
  });

  const officialRate = usdRate.rate;
  const euroRateValue = euroRate.rate;

  const cumulative30 = [usdHistory30, usdtHistory30, euroHistory30].map((series) => {
    const first = series.points[0]?.rate || 0;
    const last = series.points[series.points.length - 1]?.rate || first;
    return computeVariation(last, first);
  });

  const trendScore = average(cumulative30);

  return {
    variations,
    spreadAmount: calculateSpread(officialRate, usdtRate.rate),
    spreadPercent: calculateSpreadPercent(officialRate, usdtRate.rate),
    euroUsdtRatio: euroRateValue ? Number((usdtRate.rate / euroRateValue).toFixed(2)) : 0,
    euroUsdtDiffAmount: Number((usdtRate.rate - euroRateValue).toFixed(2)),
    euroUsdtDiffPercent: euroRateValue ? Number((((usdtRate.rate - euroRateValue) / euroRateValue) * 100).toFixed(2)) : 0,
    trendLabel: trendLabelForScore(trendScore),
    trendScore,
    histories: {
      7: histories30.map((series) => ({ ...series, points: series.points.slice(-7) })),
      15: histories30.map((series) => ({ ...series, points: series.points.slice(-15) })),
      30: histories30,
    },
  };
}


