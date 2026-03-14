

export function getImperialDist(meters) {
  const miles = (meters * 0.000621371).toFixed(1);
  const formatted = miles.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return `${formatted}mi`;
}