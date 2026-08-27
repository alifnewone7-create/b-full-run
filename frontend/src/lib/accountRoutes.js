// Per-account trade terminal routes. The same terminal renders at each URL;
// only the active account (and therefore the isolated trades/balance) differs.
export const ACCOUNT_ROUTE = {
  demo: '/demo-trade',
  basic: '/basic-trade',
  standard: '/standard-trade',
  premium: '/premium-trade',
};

export const ROUTE_ACCOUNT = {
  '/demo-trade': 'demo',
  '/basic-trade': 'basic',
  '/standard-trade': 'standard',
  '/premium-trade': 'premium',
};

export const tradePath = (key) => ACCOUNT_ROUTE[key] || '/demo-trade';

// Best-effort current account (used by nav bars that don't fetch the wallet).
export const activeTradePath = () => {
  try { return tradePath(localStorage.getItem('bfg_active_account') || 'demo'); }
  catch { return '/demo-trade'; }
};
