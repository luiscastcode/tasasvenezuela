// src/components/DollarChart/types.ts

/**
 * Datos históricos crudos de la API DolarAPI
 */
export type DollarHistoricalRaw = {
  fuente: 'oficial' | 'paralelo';
  compra: number;
  venta: number;
  promedio: number;
  fecha: string; // ISO: "2024-01-15"
};

/**
 * Punto de datos unificado para el gráfico
 */
export type ChartDataPoint = {
  time: string; // Lightweight Charts requiere "YYYY-MM-DD"
  oficial: number;
  paralelo: number;
};

/**
 * Opciones de configuración del chart
 */
export type ChartOptions = {
  containerId: string;
  data: ChartDataPoint[];
  height?: string;
  colors?: {
    bg?: string;
    text?: string;
    grid?: string;
    oficial?: string;
    paralelo?: string;
    crosshair?: string;
    tooltip?: {
      bg?: string;
      text?: string;
    };
  };
  locale?: string; // Para formateo de moneda: 'es-VE', 'en-US', etc.
};

/**
 * Instancia del chart con métodos de control
 */
export type ChartInstance = {
  updateData: (data: ChartDataPoint[]) => void;
  resize: () => void;
  destroy: () => void;
  setTimeRange: (days: 7 | 15 | 30) => void;
};

/**
 * Tipo para la función de inicialización
 */
export type InitChartFn = (options: ChartOptions) => ChartInstance;