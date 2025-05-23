import React, { useState, useEffect } from "react";
import xmobColors from "@/app/styles/xmobcolors";
import { useCryptoPrice } from "@/hooks/useCryptoPrice";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { PriceDisplay } from "@/components/ui/PriceDisplay/PriceDisplay";
import MoneroService from "@/helpers/Api/monero/xmr.service";
import ErrorAlert from "@/components/ui/ErrorAlert";
import SuccessAlert from "@/components/ui/SuccessAlert";
import { usePaymentMethods } from "@/hooks/usePaymentMethod";
import FeeManagementService, { FeeType } from "@/helpers/Api/fees/fee.service";
import OrderService, { OrderDto } from "@/helpers/Api/orders/orders.service";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const MARKET_ADJUSTMENTS = [
  { value: "-1", label: "-1% (Below Market)" },
  { value: "-0.5", label: "-0.5% (Below Market)" },
  { value: "0", label: "Market Price" },
  { value: "0.5", label: "+0.5% (Above Market)" },
  { value: "1", label: "+1% (Above Market)" },
] as const;

export const XMRSell = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentMethodName, setPaymentMethodName] = useState("");
  const [minTrade, setMinTrade] = useState("1");
  const [maxTrade, setMaxTrade] = useState("300000");
  const { price: currentPrice, loading: priceLoading } =
    useCryptoPrice("monero");

  const {
    rate: usdRate,
    loading: loadingRate,
    error: rateError,
    lastUpdated: rateLastUpdated,
  } = useExchangeRate();

  const [spotWalletXMRBalance, setSpotWalletXMRBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fee, setFee] = useState<any | null>(null);
  const [loadingFee, setLoadingFee] = useState(false);
  const [feeAmount, setFeeAmount] = useState<number>(0);
  const [amountAfterFee, setAmountAfterFee] = useState<number>(0);
  const [marketAdjustment, setMarketAdjustment] = useState("0");
  const [terms, setTerms] = useState("");
  const [tradeSizeCurrency, setTradeSizeCurrency] = useState("kes");

  const router = useRouter();
  const feeService = new FeeManagementService();

  const {
    paymentMethods,
    isLoading: isLoadingPaymentMethods,
    error: paymentMethodsError,
  } = usePaymentMethods();

  const xmoneroService = new MoneroService();

  useEffect(() => {
    fetchMoneroBalances();
    fetchTradingFee();
  }, []);

  useEffect(() => {
    if (paymentMethods.length > 0 && !paymentMethod) {
      setPaymentMethod(paymentMethods[0].name);
      setPaymentMethodName(paymentMethods[0].name);
    }
  }, [paymentMethods]);

  useEffect(() => {
    calculateFee();
  }, [amount, fee]);

  const fetchTradingFee = async () => {
    setLoadingFee(true);
    try {
      const tradingFee = await feeService.getFee(FeeType.TRADE_SELL, "XMR");
      setFee(tradingFee.data);
    } catch (error) {
      console.error("Failed to fetch trading fee:", error);
    } finally {
      setLoadingFee(false);
    }
  };

  const calculateFee = () => {
    if (!amount || !fee) {
      setFeeAmount(0);
      setAmountAfterFee(0);
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFeeAmount(0);
      setAmountAfterFee(0);
      return;
    }

    // Calculate fee amount
    const calculatedFeeAmount = parsedAmount * (Number(fee.percentage) / 100);
    // Ensure fee is within min/max constraints
    const finalFeeAmount = Math.min(
      Math.max(calculatedFeeAmount, fee.min_amount),
      Number(fee.max_amount)
    );

    setFeeAmount(finalFeeAmount);
    setAmountAfterFee(parsedAmount - calculatedFeeAmount);
  };

  async function fetchMoneroBalances() {
    setIsLoading(true);
    setError(null);
    try {
      const spotXMRBalance = await xmoneroService.get_my_balance();
      setSpotWalletXMRBalance(Number(spotXMRBalance?.balance || 0));
    } catch (error) {
      console.error("Failed to fetch Monero balances:", error);
      setError("Failed to load wallet balances");
    } finally {
      setIsLoading(false);
    }
  }

  const validateAmount = (): boolean => {
    if (!amount) {
      setError("Please enter an amount");
      return false;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return false;
    }

    if (parsedAmount > spotWalletXMRBalance) {
      setError(
        `Insufficient balance. You have ${spotWalletXMRBalance.toFixed(
          6
        )} XMR available in your spot wallet`
      );
      return false;
    }

    if (!paymentMethod) {
      setError("Please select a payment method");
      return false;
    }

    if (parseFloat(minTrade) <= 0) {
      setError("Minimum trade amount must be greater than 0");
      return false;
    }

    if (parseFloat(maxTrade) <= parseFloat(minTrade)) {
      setError(
        "Maximum trade amount must be greater than minimum trade amount"
      );
      return false;
    }

    return true;
  };

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = e.target.value;
    setPaymentMethod(selectedId);

    const selected = paymentMethods.find((m) => m.id.toString() === selectedId);
    if (selected) {
      setPaymentMethodName(selected.name);
    }
  };

  const handleSell = async () => {
    if (!validateAmount()) return;

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const selectedMethod = paymentMethods.find(
        (m) => m.name.toString() === paymentMethod
      );

      if (!selectedMethod) {
        setError("Invalid payment method selected");
        return;
      }

      const orderData: OrderDto = {
        order_type: "SELL",
        currency_symbol: "XMR",
        paymentmethod: selectedMethod.name,
        amount: amount,
        coin_sold_rate_to_usd: currentPrice,
        usd_rate_to_kes: usdRate || 129,
        min_limit: parseFloat(minTrade),
        max_limit: parseFloat(maxTrade),
        marketAdjustment,
        terms,
        tradeSizeCurrency,
      };

      const result = await OrderService.createSellOrder(orderData);

      if (result.error) {
        setError(result.message || "Failed to create sell order");
        return;
      }

      setSuccessMessage(
        `Sell order for ${amount} XMR via ${selectedMethod.name} placed successfully!`
      );

      // After successful order creation, redirect to orders page after a delay
      setTimeout(() => {
        router.push("/orders");
      }, 2000);
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred");
      console.error("Error creating sell order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccessMessage(null);

  const usdValue =
    amount && !isNaN(parseFloat(amount))
      ? parseFloat(amount) * (currentPrice || 0)
      : 0;

  const feeUsdValue = feeAmount * (currentPrice || 0);
  const amountAfterFeeUsd = amountAfterFee * (currentPrice || 0);
  // Update the loading check to include loadingRate
  if (isLoading || isLoadingPaymentMethods || loadingFee || loadingRate) {
    return (
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-lg shadow-lg p-6 flex justify-center items-center"
          style={{ backgroundColor: xmobColors.light, minHeight: "300px" }}
        >
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: xmobColors.primary }}
            ></div>
            <p style={{ color: xmobColors.dark }}>
              Loading wallet information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Update the combined error to include rate error
  const combinedError = error || paymentMethodsError || rateError;

  if (combinedError) {
    return (
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-lg shadow-lg p-6"
          style={{ backgroundColor: xmobColors.light }}
        >
          <div
            className="text-center p-4 rounded-md"
            style={{
              backgroundColor: xmobColors.danger,
              color: xmobColors.light,
            }}
          >
            <p>{combinedError}</p>
            <button
              onClick={fetchMoneroBalances}
              className="mt-4 px-4 py-2 rounded-md"
              style={{
                backgroundColor: xmobColors.light,
                color: xmobColors.dark,
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-lg shadow-lg p-6"
          style={{ backgroundColor: xmobColors.light }}
        >
          <div
            className="text-center p-4 rounded-md"
            style={{
              backgroundColor: xmobColors.danger,
              color: xmobColors.dark,
            }}
          >
            <h3 className="font-bold text-lg mb-2">
              No Payment Methods Available
            </h3>
            <p>
              Please add a payment method in your account settings to sell XMR.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ErrorAlert error={combinedError} onClose={clearError} />
      <SuccessAlert message={successMessage} onClose={clearSuccess} />

      <div
        className="rounded-lg shadow-lg p-6"
        style={{ backgroundColor: xmobColors.light }}
      >
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: xmobColors.dark }}
        >
          Sell Monero (XMR)
        </h2>

        <PriceDisplay
          price={currentPrice}
          loading={priceLoading}
          currency="XMR"
        />

        {/* Add Exchange Rate Display */}
        {usdRate && (
          <div className="mt-2 text-sm" style={{ color: xmobColors.grayDark }}>
            <p>1 USD = {usdRate.toLocaleString()} KES</p>
            {rateLastUpdated && (
              <p className="text-xs">
                Rate last updated: {new Date(rateLastUpdated).toLocaleString()}
              </p>
            )}
          </div>
        )}

        <div className="space-y-6 mt-4">
          {/* Wallet Info - Spot wallet only */}
          <div
            className="p-3 rounded-md border"
            style={{
              borderColor: xmobColors.grayMedium,
              backgroundColor: xmobColors.grayLight,
            }}
          >
            <div className="flex justify-between items-center">
              <span style={{ color: xmobColors.dark }}>
                XMR Spot Wallet Balance:
              </span>
              <span
                className="font-semibold"
                style={{ color: xmobColors.primary }}
              >
                {spotWalletXMRBalance.toFixed(6)} XMR
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium"
              style={{ color: xmobColors.dark }}
            >
              Amount (XMR)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 rounded-md transition-colors duration-200"
                style={{
                  borderColor: xmobColors.grayMedium,
                  backgroundColor: xmobColors.grayLight,
                  color: xmobColors.dark,
                }}
                placeholder="0.00"
                max={spotWalletXMRBalance}
              />
              <div
                className="absolute right-3 top-3 text-sm font-medium"
                style={{ color: xmobColors.grayDark }}
              >
                XMR
              </div>
            </div>
            <p className="text-sm mt-1" style={{ color: xmobColors.grayDark }}>
              ≈ $
              {amount && !isNaN(parseFloat(amount))
                ? (parseFloat(amount) * currentPrice).toLocaleString()
                : "0.00"}{" "}
              USD
            </p>

            {/* Quick amount selection */}
            <div className="grid grid-cols-4 gap-2 mt-2">
              <button
                onClick={() =>
                  setAmount((spotWalletXMRBalance * 0.25).toFixed(6))
                }
                className="p-2 text-sm rounded-md transition-colors"
                style={{
                  backgroundColor: xmobColors.grayLight,
                  borderColor: xmobColors.grayMedium,
                  border: "1px solid",
                }}
              >
                25%
              </button>
              <button
                onClick={() =>
                  setAmount((spotWalletXMRBalance * 0.5).toFixed(6))
                }
                className="p-2 text-sm rounded-md transition-colors"
                style={{
                  backgroundColor: xmobColors.grayLight,
                  borderColor: xmobColors.grayMedium,
                  border: "1px solid",
                }}
              >
                50%
              </button>
              <button
                onClick={() =>
                  setAmount((spotWalletXMRBalance * 0.75).toFixed(6))
                }
                className="p-2 text-sm rounded-md transition-colors"
                style={{
                  backgroundColor: xmobColors.grayLight,
                  borderColor: xmobColors.grayMedium,
                  border: "1px solid",
                }}
              >
                75%
              </button>
              <button
                onClick={() => setAmount(spotWalletXMRBalance.toFixed(6))}
                className="p-2 text-sm rounded-md transition-colors"
                style={{
                  backgroundColor: xmobColors.grayLight,
                  borderColor: xmobColors.grayMedium,
                  border: "1px solid",
                }}
              >
                100%
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium"
              style={{ color: xmobColors.dark }}
            >
              Receive Payment Via
            </label>
            <select
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              className="w-full p-3 rounded-md transition-colors duration-200"
              style={{
                borderColor: xmobColors.grayMedium,
                backgroundColor: xmobColors.grayLight,
                color: xmobColors.dark,
              }}
            >
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id.toString()}>
                  {method.name} ({method.country})
                </option>
              ))}
            </select>
          </div>

          {/* Add before the Trade Limits section */}
          <div className="space-y-2">
            <Label>Market Price Adjustment</Label>
            <Select
              value={marketAdjustment}
              onValueChange={setMarketAdjustment}
            >
              <SelectTrigger className="bg-[#f3faf6]">
                <SelectValue>
                  {MARKET_ADJUSTMENTS.find(
                    (adj) => adj.value === marketAdjustment
                  )?.label || "Market Price"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {MARKET_ADJUSTMENTS.map((adjustment) => (
                  <SelectItem key={adjustment.value} value={adjustment.value}>
                    {adjustment.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fee Information */}
          {fee && parseFloat(amount) > 0 && (
            <div
              className="p-3 rounded-md border"
              style={{
                borderColor: xmobColors.grayMedium,
                backgroundColor: xmobColors.grayLight,
              }}
            >
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span style={{ color: xmobColors.dark }}>
                    Trading Fee ({fee.percentage}%):
                  </span>
                  <span
                    className="font-medium"
                    style={{ color: xmobColors.grayDark }}
                  >
                    {feeAmount.toFixed(6)} XMR (${feeUsdValue.toLocaleString()})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: xmobColors.dark }}>You Receive:</span>
                  <span
                    className="font-semibold"
                    style={{ color: xmobColors.primary }}
                  >
                    {amountAfterFee.toFixed(6)} XMR ($
                    {amountAfterFeeUsd.toLocaleString()})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Trade Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                className="block text-sm font-medium"
                style={{ color: xmobColors.dark }}
              >
                Minimum Trade
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minTrade}
                  onChange={(e) => setMinTrade(e.target.value)}
                  className="w-full p-3 rounded-md"
                  style={{
                    borderColor: xmobColors.grayMedium,
                    backgroundColor: xmobColors.grayLight,
                    color: xmobColors.dark,
                  }}
                />
                <Select
                  value={tradeSizeCurrency}
                  onValueChange={setTradeSizeCurrency}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue>{tradeSizeCurrency.toUpperCase()}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kes">KES</SelectItem>
                    <SelectItem value="usd">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Similar update for maxTrade input */}
            <div className="space-y-2">
              <label
                className="block text-sm font-medium"
                style={{ color: xmobColors.dark }}
              >
                Maximum Trade
              </label>
              <input
                type="number"
                value={maxTrade}
                onChange={(e) => setMaxTrade(e.target.value)}
                className="w-full p-3 rounded-md"
                style={{
                  borderColor: xmobColors.grayMedium,
                  backgroundColor: xmobColors.grayLight,
                  color: xmobColors.dark,
                }}
              />
            </div>
          </div>

          {/* Add before the Submit button */}
          <div className="space-y-2">
            <Label>
              Terms and Instructions{" "}
              <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Optional: Specify any additional requirements like:
1. Payment timeframe expectations
2. Required payment references
3. Verification requirements
4. Other specific instructions"
              className="min-h-[120px]"
              style={{
                borderColor: xmobColors.grayMedium,
                backgroundColor: xmobColors.grayLight,
                color: xmobColors.dark,
              }}
            />
          </div>

          <button
            onClick={handleSell}
            className="w-full py-4 px-4 rounded-md transition-colors duration-200 font-medium"
            style={{
              backgroundColor: xmobColors.primary,
              color: xmobColors.light,
              opacity:
                !amount ||
                parseFloat(amount) <= 0 ||
                parseFloat(amount) > spotWalletXMRBalance ||
                !paymentMethod ||
                isSubmitting
                  ? 0.7
                  : 1,
            }}
            disabled={
              !amount ||
              parseFloat(amount) <= 0 ||
              parseFloat(amount) > spotWalletXMRBalance ||
              !paymentMethod ||
              isSubmitting
            }
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Create Sell Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
