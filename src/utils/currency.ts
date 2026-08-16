const formatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formats a peso amount, e.g. 10580 -> "₱10,580.00". */
export function formatPeso(amount: number): string {
  return formatter.format(amount);
}
