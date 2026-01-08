/**
 * Format a number as GBP currency (no decimal places)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number with thousands separators
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return value.toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a decimal as a percentage (e.g. 0.65 -> "65%")
 */
export function formatPercent(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a WTE (whole-time equivalent) value
 */
export function formatWTE(value: number): string {
  return value.toFixed(1);
}
