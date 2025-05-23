/**
 * Currency API Service
 * This service provides methods to interact with the Currency API
 */

const API_KEY = 'cur_live_wIluI2rkajElnwG81mQmx3vFqLMJthphJQcR3pd8';
const BASE_URL = 'https://api.currencyapi.com/v3';

interface CurrencyResponse {
  data: {
    [key: string]: {
      code: string;
      value: number;
    }
  };
  meta: {
    last_updated_at: string;
  };
}

interface CurrencyOptions {
  base_currency?: string;
  currencies?: string[];
}

/**
 * Fetches latest currency exchange rates
 * 
 * @param options Configuration options for the API request
 * @returns Promise with currency data
 */
export async function getLatestRates(options: CurrencyOptions = {}): Promise<CurrencyResponse> {
  const { base_currency = 'USD', currencies = [] } = options;
  
  let url = `${BASE_URL}/latest?apikey=${API_KEY}&base_currency=${base_currency}`;
  
  if (currencies.length > 0) {
    url += `&currencies=${currencies.join(',')}`;
  }
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Currency API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching currency data:', error);
    throw error;
  }
}

/**
 * Fetches historical currency exchange rates
 * 
 * @param date Date in YYYY-MM-DD format
 * @param options Configuration options for the API request
 * @returns Promise with historical currency data
 */
export async function getHistoricalRates(date: string, options: CurrencyOptions = {}): Promise<CurrencyResponse> {
  const { base_currency = 'USD', currencies = [] } = options;
  
  let url = `${BASE_URL}/historical?apikey=${API_KEY}&date=${date}&base_currency=${base_currency}`;
  
  if (currencies.length > 0) {
    url += `&currencies=${currencies.join(',')}`;
  }
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Currency API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching historical currency data:', error);
    throw error;
  }
}

/**
 * Converts a value from one currency to another
 * 
 * @param amount Amount to convert
 * @param fromCurrency Source currency code
 * @param toCurrency Target currency code
 * @returns Promise with converted amount
 */
export async function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
  try {
    const rates = await getLatestRates({
      base_currency: fromCurrency,
      currencies: [toCurrency]
    });
    
    if (rates.data && rates.data[toCurrency]) {
      return amount * rates.data[toCurrency].value;
    } else {
      throw new Error('Target currency not found in response');
    }
  } catch (error) {
    console.error('Error converting currency:', error);
    throw error;
  }
}

/**
 * Fetches available currencies list
 * 
 * @returns Promise with available currencies
 */
export async function getCurrencyList(): Promise<any> {
  const url = `${BASE_URL}/currencies?apikey=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Currency API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching currency list:', error);
    throw error;
  }
}

export default {
  getLatestRates,
  getHistoricalRates,
  convertCurrency,
  getCurrencyList
};
