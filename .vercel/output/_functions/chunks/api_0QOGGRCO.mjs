async function fetchWithTimeout(url, timeout = 8e3) {
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
async function getBCVDollarRate() {
  try {
    console.log("[API] Fetching BCV Dollar rate...");
    const response = await fetchWithTimeout("https://ve.dolarapi.com/v1/dolares/oficial");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("[API] BCV Dollar rate fetched successfully:", data.promedio || data.precio);
    return {
      name: "Dólar BCV",
      code: "USD",
      rate: data.promedio || data.precio || 0,
      lastUpdate: data.fechaActualizacion || (/* @__PURE__ */ new Date()).toISOString(),
      symbol: "$"
    };
  } catch (error) {
    console.error("[API] Error fetching BCV Dollar rate:", error);
    return {
      name: "Dólar BCV",
      code: "USD",
      rate: 0,
      lastUpdate: (/* @__PURE__ */ new Date()).toISOString(),
      symbol: "$"
    };
  }
}
async function getBCVEuroRate(bcvDollarRate) {
  try {
    console.log("[API] Fetching Euro rate...");
    let bcvRate = bcvDollarRate;
    if (!bcvRate) {
      const bcvDollar = await getBCVDollarRate();
      bcvRate = bcvDollar.rate;
    }
    const response = await fetchWithTimeout("https://api.exchangerate-api.com/v4/latest/USD");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const usdToEur = data.rates.EUR || 0.92;
    const euroRate = bcvRate / usdToEur;
    console.log("[API] Euro rate calculated successfully:", euroRate);
    return {
      name: "Euro BCV",
      code: "EUR",
      rate: euroRate,
      lastUpdate: (/* @__PURE__ */ new Date()).toISOString(),
      symbol: "€"
    };
  } catch (error) {
    console.error("[API] Error fetching Euro rate:", error);
    return {
      name: "Euro BCV",
      code: "EUR",
      rate: 0,
      lastUpdate: (/* @__PURE__ */ new Date()).toISOString(),
      symbol: "€"
    };
  }
}
async function getUSDTRate() {
  try {
    console.log("[API] Fetching USDT rate...");
    const response = await fetchWithTimeout("https://ve.dolarapi.com/v1/dolares/paralelo");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const rate = data.promedio || data.precio || 0;
    console.log("[API] USDT rate fetched successfully:", rate);
    return {
      name: "USDT (Bybit)",
      code: "USDT",
      rate,
      lastUpdate: data.fechaActualizacion || (/* @__PURE__ */ new Date()).toISOString(),
      symbol: "₮"
    };
  } catch (error) {
    console.error("[API] Error fetching USDT rate:", error);
    return {
      name: "USDT (Bybit)",
      code: "USDT",
      rate: 0,
      lastUpdate: (/* @__PURE__ */ new Date()).toISOString(),
      symbol: "₮"
    };
  }
}
async function getAllRates() {
  try {
    console.log("[API] Fetching all rates...");
    const bcvDollar = await getBCVDollarRate();
    const [bcvEuro, usdt] = await Promise.all([
      getBCVEuroRate(bcvDollar.rate),
      getUSDTRate()
    ]);
    const rates = [bcvDollar, usdt, bcvEuro];
    console.log("[API] All rates fetched successfully");
    return rates;
  } catch (error) {
    console.error("[API] Error fetching all rates:", error);
    return [];
  }
}
function formatBs(amount) {
  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "VES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-VE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export { formatBs as a, formatDate as f, getAllRates as g };
