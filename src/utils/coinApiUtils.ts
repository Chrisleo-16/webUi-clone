import { COIN_API_HEADERS } from "./coinApiConfig";

// Simple in-memory cache
const apiCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_EXPIRY = 1000 * 60 * 5; // 5 minutes cache expiration

/**
 * Makes a cached API request to CoinAPI
 * @param url The API endpoint URL
 * @returns Response data
 */
export const cachedFetch = async (url: string): Promise<any> => {
  // Check if we have a fresh cached response
  if (apiCache[url] && Date.now() - apiCache[url].timestamp < CACHE_EXPIRY) {
    return apiCache[url].data;
  }

  try {
    const response = await fetch(url, { headers: COIN_API_HEADERS });

    if (response.status === 429) {
      console.error("CoinAPI rate limit exceeded. Please try again later.");
      throw new Error(
        "Rate limit exceeded. Please wait a moment and try again."
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`CoinAPI Error (${response.status}):`, errorText);
      throw new Error(
        `API error (${response.status}): ${errorText || "Unknown error"}`
      );
    }

    const data = await response.json();

    // Cache the response
    apiCache[url] = { data, timestamp: Date.now() };

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

/**
 * Clears all cached API responses
 */
export const clearCache = (): void => {
  Object.keys(apiCache).forEach((key) => {
    delete apiCache[key];
  });
};

/**
 * Gets the correct date string format for CoinAPI requests
 * @param daysAgo Number of days to subtract from current date
 * @returns ISO date string without milliseconds
 */
export const getFormattedDate = (daysAgo: number = 0): string => {
  const date = new Date();
  if (daysAgo > 0) {
    date.setDate(date.getDate() - daysAgo);
  }
  return date.toISOString().split(".")[0];
};

/**
 * Formats a price for display
 * @param price The price to format
 * @param currency The currency symbol
 * @returns Formatted price string
 */
export const formatPrice = (
  price: number,
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: price > 1000 ? 2 : price > 100 ? 4 : 6,
  }).format(price);
};
