/**
 * Format a numeric amount as a currency string.
 * @param {number} amount - The numeric amount to format.
 * @param {string} [symbol='₹'] - Currency symbol ('₹' or '$').
 * @param {number} [decimals=0] - Number of decimal places.
 * @returns {string} Formatted currency string, e.g. "₹240" or "$3.50"
 */
export function formatCurrency(amount, symbol = '₹', decimals = 0) {
  if (typeof amount !== 'number' || isNaN(amount)) return `${symbol}0`;
  return `${symbol}${amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/**
 * Format a price with unit, e.g. "₹60 / kg"
 * @param {number} price
 * @param {string} unit - e.g. 'kg', 'bunch', 'liter'
 * @param {string} [symbol='₹']
 * @returns {string}
 */
export function formatPriceWithUnit(price, unit, symbol = '₹') {
  return `${formatCurrency(price, symbol)} / ${unit}`;
}
