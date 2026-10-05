/**
 * Demo-only prices (AZN) used by the concept demo. These are illustrative and
 * not tied to any real restaurant. Keyed by question option id.
 */
export const demoPrices = {
  currency: 'AZN',
  /** Base price of the wrap by hunger level. */
  hunger: { light: 4.0, regular: 5.5, full: 7.0 } as Record<string, number>,
  /** Side and drink combinations. */
  side: { 'fries-ayran': 2.5, 'salad-water': 2.0, 'none-tea': 1.0 } as Record<string, number>,
};
