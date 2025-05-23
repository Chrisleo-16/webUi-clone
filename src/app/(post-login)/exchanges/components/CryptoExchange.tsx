import React, { useState, useEffect } from "react";
import xmobColors from "@/app/styles/xmobcolors";
import ExchangeService from "@/helpers/Api/exchange/exchange.service";
import SuccessAlert from "@/components/ui/SuccessAlert";
import ErrorAlert from "@/components/ui/ErrorAlert";

export const CryptoExchange = () => {
  const [fromCurrency, setFromCurrency] = useState("BTC");
  const [toCurrency, setToCurrency] = useState("XMR");
  const [amount, setAmount] = useState("");
  const [estimatedAmount, setEstimatedAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [exchangeResult, setExchangeResult] = useState<{
    estimatedAmount?: string;
    exchangeId?: string;
  } | null>(null);

  const clearAlerts = () => {
    setSuccessMessage("");
    setErrorMessage("");
    setExchangeResult(null);
  };

  useEffect(() => {
    const getEstimate = async () => {
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        setEstimatedAmount("");
        return;
      }

      clearAlerts();
      setIsEstimating(true);
      try {
        let result;
        if (fromCurrency === "BTC" && toCurrency === "XMR") {
          result = await ExchangeService.getBTCexchangeEstimate(amount);
        } else {
          result = await ExchangeService.getXMRexchangeEstimate(amount);
        }

        if (result.error) {
          setErrorMessage(`${result.message}`);
          setEstimatedAmount("");
        } else {
          setEstimatedAmount(result.estimatedAmount);
        }
      } catch (error) {
        console.error("Error getting estimate:", error);
        setErrorMessage("Exchange service is temporarily unavailable");
        setEstimatedAmount("");
      } finally {
        setIsEstimating(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (amount) {
        getEstimate();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [amount, fromCurrency, toCurrency]);

  const handleExchange = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setErrorMessage("Please enter a valid amount");
      return;
    }

    clearAlerts();
    setIsLoading(true);
    try {
      let result;
      if (fromCurrency === "BTC" && toCurrency === "XMR") {
        result = await ExchangeService.exchangeBTCtoXMR(amount);
      } else {
        result = await ExchangeService.exchangeXMRtoBTC(amount);
      }

      if (result.error) {
        setErrorMessage(`Exchange failed: ${result.message}`);
      } else {
        setSuccessMessage(result.message || "Exchange initiated successfully");

        setExchangeResult({
          estimatedAmount: result.estimatedAmount,
          exchangeId: result.exchangeId,
        });

        setAmount("");
        setEstimatedAmount("");
      }
    } catch (error: any) {
      console.error("Exchange error:", error);
      setErrorMessage(error.message || "Failed to initiate exchange");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFromCurrencyChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newFromCurrency = e.target.value;
    setFromCurrency(newFromCurrency);
    setToCurrency(newFromCurrency === "BTC" ? "XMR" : "BTC");
    setAmount("");
    setEstimatedAmount("");
    clearAlerts();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: xmobColors.dark }}
      >
        Crypto to Crypto Exchange
      </h2>

      {successMessage && (
        <div className="mb-4">
          <SuccessAlert
            message={successMessage}
            onClose={() => setSuccessMessage("")}
          />

          {exchangeResult?.exchangeId && (
            <div className="mt-4 p-4 bg-green-50 rounded-md border border-green-200">
              {exchangeResult.estimatedAmount && (
                <p className="text-sm text-green-800">
                  <strong>Estimated amount to receive:</strong>{" "}
                  {exchangeResult.estimatedAmount} {toCurrency}
                </p>
              )}
              <p className="text-sm text-green-800 mt-1">
                <strong>Exchange ID:</strong> {exchangeResult.exchangeId}
              </p>
              <p className="text-xs text-green-600 mt-2">
                Please note that the final amount may vary based on market
                conditions and fees. You can track your exchange in the history
                section.
              </p>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4">
          <ErrorAlert
            error={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        </div>
      )}

      <div
        className="rounded-lg shadow-lg p-6 space-y-6"
        style={{ backgroundColor: xmobColors.light }}
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              className="block text-sm font-medium"
              style={{ color: xmobColors.dark }}
            >
              From
            </label>
            <select
              value={fromCurrency}
              onChange={handleFromCurrencyChange}
              className="w-full p-2 rounded-md transition-colors duration-200"
              style={{
                borderColor: xmobColors.grayMedium,
                backgroundColor: xmobColors.grayLight,
                color: xmobColors.dark,
              }}
              disabled={isLoading}
            >
              <option value="BTC">BTC</option>
              <option value="XMR">XMR</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium"
              style={{ color: xmobColors.dark }}
            >
              To
            </label>
            <div className="flex items-center">
              <select
                value={toCurrency}
                disabled
                className="w-full p-2 rounded-md transition-colors duration-200"
                style={{
                  borderColor: xmobColors.grayMedium,
                  backgroundColor: xmobColors.grayLight,
                  color: xmobColors.dark,
                }}
              >
                <option value={toCurrency}>{toCurrency}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium"
            style={{ color: xmobColors.dark }}
          >
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 rounded-md transition-colors duration-200"
            style={{
              borderColor: xmobColors.grayMedium,
              backgroundColor: xmobColors.grayLight,
              color: xmobColors.dark,
            }}
            placeholder={`Enter amount in ${fromCurrency}`}
            disabled={isLoading}
          />
        </div>

        {isEstimating ? (
          <div
            className="text-center text-sm"
            style={{ color: xmobColors.primary }}
          >
            Calculating estimate...
          </div>
        ) : estimatedAmount ? (
          <div className="text-center">
            <p className="text-sm" style={{ color: xmobColors.dark }}>
              Estimated {toCurrency} to receive:
            </p>
            <p className="font-bold" style={{ color: xmobColors.primary }}>
              {estimatedAmount} {toCurrency}
            </p>
            <p className="text-xs mt-1" style={{ color: xmobColors.grayDark }}>
              Rate may vary at the time of execution
            </p>
          </div>
        ) : amount && !errorMessage ? (
          <div
            className="text-center text-sm"
            style={{ color: xmobColors.grayDark }}
          >
            Enter an amount to see estimate
          </div>
        ) : null}

        <div className="space-y-2">
          <div
            className="text-sm p-4 rounded-md"
            style={{
              backgroundColor: xmobColors.grayLight,
              color: xmobColors.grayDark,
            }}
          >
            <p className="mb-2">
              <strong>Note:</strong> Xmobit's Exchange Information:
            </p>
            <ul className="list-disc list-inside text-xs space-y-1">
              <li>Once initiated, exchanges cannot be reversed</li>
              <li>Exchange times typically take 10-30 minutes</li>
              <li>Minimum exchange amounts apply (0.0001 BTC / 0.01 XMR)</li>
              <li>A small network fee is applied to your transaction</li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleExchange}
          disabled={isLoading || !amount}
          className="w-full py-3 px-4 rounded-md transition-colors duration-200 font-medium"
          style={{
            backgroundColor:
              isLoading || !amount ? xmobColors.grayMedium : xmobColors.primary,
            color: xmobColors.light,
          }}
        >
          {isLoading
            ? "Processing..."
            : `Exchange ${fromCurrency} to ${toCurrency}`}
        </button>
      </div>
    </div>
  );
};
