export interface ExchangeFees {
    btcToXmr: {
      min: string;
      max: string | null;
      fee: string | "Variable";
    };
    xmrToBtc: {
      min: string;
      max: string | null;
      fee: string | "Variable";
    };

}