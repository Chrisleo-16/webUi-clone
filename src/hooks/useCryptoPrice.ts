import { useState, useEffect } from "react";
import { COIN_API_BASE_URL, currencyToAssetId } from "@/utils/coinApiConfig";
import { cachedFetch } from "@/utils/coinApiUtils";

export const useCryptoPrice = (symbol: string) => {
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const assetId = currencyToAssetId[symbol] || symbol.toUpperCase();
        const url = `${COIN_API_BASE_URL}/exchangerate/${assetId}/USD`;

        const data = await cachedFetch(url);
        setPrice(data.rate);
        setLastUpdated(new Date());
        setLoading(false);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch price:", err);
        setError(err.message || "Failed to fetch price");
        setLoading(false);
      }
    };

    fetchPrice();

    // Update price every 60 seconds (respecting API rate limits)
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, [symbol]);

  return {
    price,
    loading,
    error,
    lastUpdated,
  };
};
