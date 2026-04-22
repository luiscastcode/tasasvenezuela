// src/components/DollarChart/dollar-chart.client.ts

// 📦 IMPORTS DE VALORES (Runtime)
import {
  createChart,
  ColorType,
  CrosshairMode,
  LineStyle,
  LineSeries,
} from 'lightweight-charts';

// 🔤 IMPORTS DE TIPOS (Compile-time only - verbatimModuleSyntax compatible)
import type {
  IChartApi,
  ISeriesApi,
  MouseEventParams,
  BusinessDay,
  Time,
  LineData,
} from 'lightweight-charts';

import type {
  ChartDataPoint,
  ChartOptions,
  ChartInstance,
  InitChartFn,
} from './types';

// ============================================================================
// 🎨 CONFIGURACIÓN DE COLORES (interfaz explícita evita errores de 'as const')
// ============================================================================

interface ChartColors {
  bg: string;
  text: string;
  grid: string;
  oficial: string;
  paralelo: string;
  crosshair: string;
  tooltip: { bg: string; text: string };
}

const DEFAULT_COLORS: ChartColors = {
  bg: '#ffffff',
  text: '#64748B',
  grid: '#E2E8F0',
  oficial: '#2563EB',
  paralelo: '#16A34A',
  crosshair: '#94A3B8',
  tooltip: { bg: '#1E293B', text: '#F8FAFC' },
};

// ============================================================================
// 🧰 UTILIDADES
// ============================================================================

export function formatCurrency(value: number, locale = 'es-VE'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace('VES', 'Bs.');
}

export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

function isDateString(time: Time): time is string {
  return typeof time === 'string';
}

// ============================================================================
// 💬 TOOLTIP
// ============================================================================

function createTooltip(container: HTMLElement, colors: ChartColors): HTMLElement {
  const tooltip = document.createElement('div');
  tooltip.style.cssText = `
    position: absolute; display: none; padding: 8px 12px; font-size: 12px;
    line-height: 1.4; font-weight: 500; color: ${colors.tooltip.text};
    background: ${colors.tooltip.bg}; border-radius: 6px; pointer-events: none;
    z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border: 1px solid ${colors.grid}; max-width: 240px;
  `;
  container.appendChild(tooltip);
  return tooltip;
}

function updateTooltip(
  tooltip: HTMLElement,
  container: HTMLElement,
  param: MouseEventParams,
  chartData: ChartDataPoint[],
  colors: ChartColors,
  locale: string
): void {
  if (!param.point || !param.time || !isDateString(param.time)) {
    tooltip.style.display = 'none';
    return;
  }

  const time = param.time;
  const dataPoint = chartData.find((d) => d.time === time);
  
  if (!dataPoint) {
    tooltip.style.display = 'none';
    return;
  }

  const { x, y } = param.point;
  tooltip.style.display = 'block';
  tooltip.style.left = `${Math.min(x + 15, container.clientWidth - 250)}px`;
  tooltip.style.top = `${Math.max(y - 110, 10)}px`;

  const diff = Math.abs(dataPoint.paralelo - dataPoint.oficial);
  const diffColor = dataPoint.paralelo > dataPoint.oficial ? colors.paralelo : colors.oficial;

  tooltip.innerHTML = `
    <div style="font-weight:600;margin-bottom:6px;color:#94A3B8;text-align:center;border-bottom:1px solid ${colors.grid};padding-bottom:6px">
      ${formatDate(time)}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px">
      <span style="color:${colors.oficial};font-size:11px">Oficial</span>
      <strong style="color:${colors.oficial}">${formatCurrency(dataPoint.oficial, locale)}</strong>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <span style="color:${colors.paralelo};font-size:11px">Paralelo</span>
      <strong style="color:${colors.paralelo}">${formatCurrency(dataPoint.paralelo, locale)}</strong>
    </div>
    <div style="margin-top:8px;padding-top:6px;border-top:1px solid ${colors.grid};font-size:11px;text-align:center">
      <span style="color:#94A3B8">Diferencia:</span>
      <strong style="color:${diffColor}">${formatCurrency(diff, locale)}</strong>
    </div>
  `;
}

// ============================================================================
// 🚀 INICIALIZACIÓN DEL CHART (100% v5.1.0 compatible)
// ============================================================================

export const initDollarChart: InitChartFn = ({
  containerId,
  data,
  height = '400px',
  colors = {},
  locale = 'es-VE',
}) => {
  // Merge seguro manteniendo tipos de interfaz
  const mergedColors: ChartColors = {
    ...DEFAULT_COLORS,
    ...colors,
    tooltip: { ...DEFAULT_COLORS.tooltip, ...colors.tooltip },
  };

  // ✅ Null-check explícito para strictNullChecks
  const el = document.getElementById(containerId);
  if (!el) throw new Error(`[DollarChart] Container "${containerId}" not found`);
  const container = el;

  container.style.height = height;
  container.style.position = 'relative';
  container.style.overflow = 'hidden';

 // ============================================================================
// 📊 CREACIÓN DEL CHART (lightweight-charts v5.x)
// ============================================================================

const chart: IChartApi = createChart(container, {
  layout: {
    background: { type: ColorType.Solid, color: mergedColors.bg },
    textColor: mergedColors.text,
    fontSize: 12,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  grid: {
    vertLines: { color: mergedColors.grid, visible: true, style: LineStyle.Dotted },
    horzLines: { color: mergedColors.grid, visible: true, style: LineStyle.Dotted },
  },
  crosshair: {
    mode: CrosshairMode.Normal,
    vertLine: { color: mergedColors.crosshair, style: LineStyle.Dotted, labelBackgroundColor: mergedColors.oficial, visible: true },
    horzLine: { color: mergedColors.crosshair, style: LineStyle.Dotted, labelBackgroundColor: mergedColors.paralelo, visible: true },
  },
  timeScale: {
    borderColor: mergedColors.grid,
    timeVisible: true,
    secondsVisible: false,
    fixLeftEdge: true,
    fixRightEdge: true,
    rightOffset: 2,
  },
  rightPriceScale: {
    borderColor: mergedColors.grid,
    autoScale: true,
    scaleMargins: { top: 0.1, bottom: 0.1 },
  },
  localization: {
    priceFormatter: (price: number) => formatCurrency(price, locale),
    timeFormatter: (time: BusinessDay | string) => 
      typeof time === 'string' ? formatDate(time) : `${time.day}/${time.month}/${time.year}`,
  },
  
  // ✅ CORREGIDO: handleScroll y handleScale con API v5
  handleScroll: { 
    mouseWheel: true, 
    pressedMouseMove: true, 
    horzTouchDrag: true, 
    vertTouchDrag: false 
  },
  handleScale: { 
    mouseWheel: true, 
    pinch: true, 
    axisPressedMouseMove: { 
      time: true, 
      price: false 
    }
  },
});

  // ✅ AHORA (correcto en v5)
const oficialSeries = chart.addSeries(LineSeries, {
  color: mergedColors.oficial,
  lineWidth: 2,
  crosshairMarkerVisible: true,
  crosshairMarkerRadius: 4,
  crosshairMarkerBorderColor: mergedColors.bg,
  lastValueVisible: true,
  priceLineVisible: true,
  priceLineWidth: 1,
  priceLineColor: mergedColors.oficial,
  priceLineStyle: LineStyle.Dotted,
});

const paraleloSeries = chart.addSeries(LineSeries, {
  color: mergedColors.paralelo,
  lineWidth: 2,
  crosshairMarkerVisible: true,
  crosshairMarkerRadius: 4,
  crosshairMarkerBorderColor: mergedColors.bg,
  lastValueVisible: true,
  priceLineVisible: true,
  priceLineWidth: 1,
  priceLineColor: mergedColors.paralelo,
  priceLineStyle: LineStyle.Dotted,
});

  const tooltip = createTooltip(container, mergedColors);

  // ✅ Suscripción al crosshair (llama a updateTooltip con los 6 argumentos exactos)
  chart.subscribeCrosshairMove((param: MouseEventParams) => {
    updateTooltip(tooltip, container, param, data, mergedColors, locale);
  });

  const hideTooltip = () => { tooltip.style.display = 'none'; };
  container.addEventListener('mouseleave', hideTooltip);

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) chart.applyOptions({ width, height });
    }
  });
  resizeObserver.observe(container);

  // ========================================================================
  // 🔄 MÉTODOS PÚBLICOS
  // ========================================================================

  function updateData(newData: ChartDataPoint[]): void {
    const oficialData = newData.map(d => ({ time: d.time as Time, value: d.oficial }));
    const paraleloData = newData.map(d => ({ time: d.time as Time, value: d.paralelo }));
    
    oficialSeries.setData(oficialData);
    paraleloSeries.setData(paraleloData);
    chart.timeScale().fitContent();
  }

  function resize(): void {
    const { width, height } = container.getBoundingClientRect();
    chart.applyOptions({ width, height });
  }

  function setTimeRange(days: 7 | 15 | 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const timePoints = data
      .map(d => d.time)
      .filter(t => new Date(t) >= cutoffDate);
    
    if (timePoints.length >= 2) {
      chart.timeScale().setVisibleRange({
        from: timePoints[0] as Time,
        to: timePoints[timePoints.length - 1] as Time,
      });
    }
  }

  function destroy(): void {
    resizeObserver.disconnect();
    container.removeEventListener('mouseleave', hideTooltip);
    tooltip.remove();
    chart.remove();
  }

  // Inicialización con datos iniciales
  updateData(data);

  return { updateData, resize, destroy, setTimeRange };
};

export type { ChartDataPoint, ChartOptions, ChartInstance, InitChartFn };