const baseUrl =
  "https://api.currencyapi.com/v3/latest?apikey=cur_live_wIluI2rkajElnwG81mQmx3vFqLMJthphJQcR3pd8";

export default class Balance {
  static async getAllCurrencyConversion(): Promise<any> {
    try {
      const response = await fetch(`${baseUrl}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const currenciesJson = await response.json();

      const currenciesModel = currenciesJson.data;

      return currenciesModel;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
