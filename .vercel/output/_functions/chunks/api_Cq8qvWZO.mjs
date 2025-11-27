async function getBCVDollarRate() {
  try {
    const response = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      name: "Dólar BCV",
      code: "USD",
      rate: data.promedio || data.precio || 0,
      lastUpdate: data.fechaActualizacion || (/* @__PURE__ */ new Date()).toISOString(),
      symbol: "$"
    };
  } catch (error) {
    console.error("Error fetching BCV Dollar rate:", error);
    return {
      name: "Dólar BCV",
      code: "USD",
      rate: 0,
      lastUpdate: (/* @__PURE__ */ new Date()).toISOString(),
      symbol: "$"
    };
  }
}
async function getBCVEuroRate() {
  try {
    const bcvDollar = await getBCVDollarRate();
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const usdToEur = data.rates.EUR || 0.92;
    const euroRate = bcvDollar.rate / usdToEur;
    return {
      name: "Euro BCV",
      code: "EUR",
      rate: euroRate,
      lastUpdate: (/* @__PURE__ */ new Date()).toISOString(),
      symbol: "€"
    };
  } catch (error) {
    console.error("Error fetching Euro rate:", error);
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
    const bcvDollar = await getBCVDollarRate();
    const response = await fetch("https://ve.dolarapi.com/v1/dolares/paralelo");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const usdtInUsd = data.tether?.usd || 1;
    const usdtRate = usdtInUsd * bcvDollar.rate;
    return {
      name: "USDT (Bybit)",
      code: "USDT",
      rate: data.promedio || data.precio || 0,
      lastUpdate: data.fechaActualizacion || (/* @__PURE__ */ new Date()).toISOString(),
      symbol: "₮"
    };
  } catch (error) {
    console.error("Error fetching USDT rate:", error);
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
    const [bcvDollar, bcvEuro, usdt] = await Promise.all([
      getBCVDollarRate(),
      getBCVEuroRate(),
      getUSDTRate()
    ]);
    return [bcvDollar, usdt, bcvEuro];
  } catch (error) {
    console.error("Error fetching all rates:", error);
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
