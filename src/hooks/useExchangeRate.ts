import { useState, useEffect, useCallback } from "react";

interface ExchangeRateResponse {
  data: {
    [key: string]: number;
  };
  meta: {
    last_updated_at: string;
  };
}

interface UseExchangeRateResult {
  rate: number | null;
  loading: boolean;
  error: string | null;
  refreshRate: () => Promise<void>;
  lastUpdated: string | null;
}

const API_KEY = process.env.NEXT_PUBLIC_CURRENCY_API;
const API_BASE_URL = "https://api.currencyapi.com/v3";

export function useExchangeRate(
  baseCurrency: string = "USD",
  targetCurrency: string = "KES"
): UseExchangeRateResult {
  const [rate, setRate] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchExchangeRate = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/latest?apikey=${API_KEY}&base_currency=${baseCurrency}&currencies=${targetCurrency}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: any = await response.json();

      if (data && data.data && data.data[targetCurrency]) {
        setRate(data.data[targetCurrency].value);
        setLastUpdated(data.meta.last_updated_at);
      } else {
        throw new Error("Invalid response structure from currency API");
      }
    } catch (err) {
      console.error("Failed to fetch exchange rate:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch exchange rate"
      );

      setRate(129);
    } finally {
      setLoading(false);
    }
  }, [baseCurrency, targetCurrency]);

  useEffect(() => {
    fetchExchangeRate();
  }, [fetchExchangeRate]);

  const refreshRate = useCallback(async () => {
    await fetchExchangeRate();
  }, [fetchExchangeRate]);

  return { rate, loading, error, refreshRate, lastUpdated };
}
