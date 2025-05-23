export const COIN_API_KEY = "1c892835-2c78-4076-821b-1d8490742273";
export const COIN_API_BASE_URL = "https://rest.coinapi.io/v1";

export const COIN_API_HEADERS = {
  "X-CoinAPI-Key": COIN_API_KEY,
};

// Supported cryptocurrencies mapping
export const currencyToAssetId: Record<string, string> = {
  bitcoin: "BTC",
  monero: "XMR",
  ethereum: "ETH",
  litecoin: "LTC",
  ripple: "XRP",
  cardano: "ADA",
  polkadot: "DOT",
  dogecoin: "DOGE",
};

// CoinAPI time period mappings
export const intervalToPeriod: Record<string, string> = {
  "1": "1HRS", // 1 day data in 1 hour periods
  "7": "1DAY", // 7 days data in 1 day periods
  "30": "1DAY", // 30 days data in 1 day periods
  "90": "3DAY", // 90 days data in 3 day periods
  "365": "7DAY", // 1 year data in 7 day periods
};

// Time period to lookback days mapping
export const intervalToDays: Record<string, number> = {
  "1": 1,
  "7": 7,
  "30": 30,
  "90": 90,
  "365": 365,
};

// Currency display information
export const currencyInfo: Record<
  string,
  { symbol: string; color: string; fullName: string }
> = {
  BTC: {
    symbol: "₿",
    color: "#F7931A",
    fullName: "Bitcoin",
  },
  XMR: {
    symbol: "ɱ",
    color: "#FF6600",
    fullName: "Monero",
  },
  ETH: {
    symbol: "Ξ",
    color: "#627EEA",
    fullName: "Ethereum",
  },
};
