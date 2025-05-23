"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePaymentMethods } from "@/hooks/usePaymentMethod";
import OrderService, { buyOrderDto } from "@/helpers/Api/orders/orders.service";
import ErrorAlert from "@/components/ui/ErrorAlert";
import SuccessAlert from "@/components/ui/SuccessAlert";
import { useRouter } from "next/navigation";
const CURRENCIES = [
  { value: "kes", label: "KES", flag: "/flag.svg" },
  { value: "usd", label: "USD", flag: "/usa-flag.svg" },
] as const;

const COINS = [
  {
    value: "btc",
    label: "BTC",
    icon: "/btc.svg",
    bgColor: "bg-[#f7931a]",
  },
  {
    value: "xmr",
    label: "XMR",
    icon: "/monero.png",
    bgColor: "bg-[#ff6600]",
  },
] as const;

const MARKET_ADJUSTMENTS = [
  { value: "-1", label: "-1% (Below Market)" },
  { value: "-0.5", label: "-0.5% (Below Market)" },
  { value: "0", label: "Market Price" },
  { value: "0.5", label: "+0.5% (Above Market)" },
  { value: "1", label: "+1% (Above Market)" },
] as const;

const MAX_COIN_AMOUNTS = {
  btc: 2.5,
  xmr: 100,
};

interface BuyFormData {
  currency: string;
  coinAmount: number;
  paymentMethod: string;
  coin: string;
  marketAdjustment: string;
  minTradeSize?: number;
  maxTradeSize?: number;
  terms?: string;
  tradeSizeCurrency: string;
}

export function CreateBuyOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    paymentMethods,
    isLoading: isLoadingPaymentMethods,
    error: paymentMethodsError,
  } = usePaymentMethods();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BuyFormData>({
    currency: "kes",
    coinAmount: 0,
    paymentMethod: "",
    coin: "btc",
    marketAdjustment: "0",
    minTradeSize: undefined,
    maxTradeSize: undefined,
    terms: "",
    tradeSizeCurrency: "kes",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (paymentMethods.length > 0 && !formData.paymentMethod) {
      setFormData((prev) => ({
        ...prev,
        paymentMethod: paymentMethods[0].name, // Use name instead of ID
      }));
    }
  }, [paymentMethods]);

  const handleInputChange = (
    field: keyof BuyFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleMaxClick = () => {
    handleInputChange(
      "coinAmount",
      MAX_COIN_AMOUNTS[formData.coin as keyof typeof MAX_COIN_AMOUNTS]
    );
  };

  const validateForm = (): boolean => {
    if (!formData.paymentMethod) {
      setError("Please select a payment method");
      return false;
    }

    const maxAmount =
      MAX_COIN_AMOUNTS[formData.coin as keyof typeof MAX_COIN_AMOUNTS];
    if (formData.coinAmount <= 0 || formData.coinAmount > maxAmount) {
      setError(
        `${formData.coin.toUpperCase()} amount must be between 0 and ${maxAmount}`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validateForm()) return;

    const payload: buyOrderDto = {
      amount: formData.coinAmount.toString(),
      marketPriceAdjustment: formData.marketAdjustment,
      paymentMethod: formData.paymentMethod,
      currency: formData.currency.toUpperCase(),
      terms: formData.terms || "",
      minLimit: formData.minTradeSize?.toString() || "1",
      maxLimit: formData.maxTradeSize?.toString() || "500,000",
      cryptoType: formData.coin.toUpperCase(),
      minLimitType: formData.tradeSizeCurrency.toUpperCase(),
      maxLimitType: formData.tradeSizeCurrency.toUpperCase(),
    };
    setIsLoading(true);
    try {
      const response = await OrderService.createBuyOrder(payload);
      if (response.error) {
        setError("Failed to create order");
        return;
      } else {
        setSuccessMessage("Buy order created successfully");
        setTimeout(() => {
          router.push("/orders");
        }, 3000);
      }
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrencyChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      currency: value,
      tradeSizeCurrency: value,
    }));
  };
  const clearError = () => setError(null);
  const clearSuccess = () => setSuccessMessage(null);

  return (
    <Card className="max-w-4xl mx-auto">
      <ErrorAlert error={error} onClose={clearError} />
      <SuccessAlert message={successMessage} onClose={clearSuccess} />
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Buy Crypto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Currency and Coin Selection */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select
              value={formData.currency}
              onValueChange={handleCurrencyChange}
            >
              <SelectTrigger className="bg-[#f3faf6]">
                <SelectValue>
                  <CurrencyDisplay currency={formData.currency} />
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    <CurrencyDisplay currency={currency.value} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Coin</Label>
            <Select
              value={formData.coin}
              onValueChange={(value) => handleInputChange("coin", value)}
            >
              <SelectTrigger className="bg-[#f3faf6]">
                <SelectValue>
                  <CoinDisplay coin={formData.coin} />
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {COINS.map((coin) => (
                  <SelectItem key={coin.value} value={coin.value}>
                    <CoinDisplay coin={coin.value} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Coin Amount */}
        <div className="space-y-2">
          <Label>Amount to Buy ({formData.coin.toUpperCase()})</Label>
          <div className="relative">
            <Input
              type="number"
              value={formData.coinAmount || ""}
              onChange={(e) =>
                handleInputChange("coinAmount", Number(e.target.value))
              }
              placeholder={`Enter ${formData.coin.toUpperCase()} amount (max: ${
                MAX_COIN_AMOUNTS[formData.coin as keyof typeof MAX_COIN_AMOUNTS]
              })`}
              className="bg-[#f3faf6] pr-16"
            />
            <button
              type="button"
              onClick={handleMaxClick}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-yellow-500 hover:text-yellow-600"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Select
            value={formData.paymentMethod}
            onValueChange={(value) => handleInputChange("paymentMethod", value)}
          >
            <SelectTrigger className="bg-[#f3faf6]">
              <SelectValue>
                {formData.paymentMethod || "Select Payment Method"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.id} value={method.name}>
                  {method.name} ({method.country})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Market Adjustment and Trade Size */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Market Price Adjustment</Label>
            <Select
              value={formData.marketAdjustment}
              onValueChange={(value) =>
                handleInputChange("marketAdjustment", value)
              }
            >
              <SelectTrigger>
                <SelectValue>
                  {
                    MARKET_ADJUSTMENTS.find(
                      (adj) => adj.value === formData.marketAdjustment
                    )?.label
                  }
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

          <div className="space-y-2">
            <Label>
              Minimum Trade Size{" "}
              <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <TradeSizeInput
              value={formData.minTradeSize}
              currency={formData.tradeSizeCurrency}
              onChange={(value) => handleInputChange("minTradeSize", value)}
              onCurrencyChange={(value) =>
                handleInputChange("tradeSizeCurrency", value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>
              Maximum Trade Size{" "}
              <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <TradeSizeInput
              value={formData.maxTradeSize}
              currency={formData.tradeSizeCurrency}
              onChange={(value) => handleInputChange("maxTradeSize", value)}
              onCurrencyChange={(value) =>
                handleInputChange("tradeSizeCurrency", value)
              }
            />
          </div>
        </div>

        {/* Terms and Submit */}
        <div className="space-y-2">
          <Label>
            Terms and Instructions{" "}
            <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <Textarea
            value={formData.terms}
            onChange={(e) => handleInputChange("terms", e.target.value)}
            placeholder="Optional: Specify any additional requirements like:
1. Payment timeframe expectations
2. Required payment references
3. Verification requirements
4. Other specific instructions"
            className="min-h-[120px]"
          />
        </div>

        <Button
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          size="lg"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Create Buy Order"}
        </Button>
      </CardContent>
    </Card>
  );
}

// Helper Components
function CurrencyDisplay({ currency }: { currency: string }) {
  const curr = CURRENCIES.find((c) => c.value === currency);
  if (!curr) return null;
  return (
    <div className="flex items-center gap-2">
      <Image
        src={curr.flag}
        alt={`${curr.label} Flag`}
        width={24}
        height={24}
        className="rounded-full"
      />
      {curr.label}
    </div>
  );
}

function CoinDisplay({ coin }: { coin: string }) {
  const coinData = COINS.find((c) => c.value === coin);
  if (!coinData) return null;
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-6 h-6 ${coinData.bgColor} rounded-full flex items-center justify-center`}
      >
        <Image
          src={coinData.icon}
          alt={`${coinData.label} Icon`}
          width={24}
          height={24}
          className="rounded-full"
        />
      </div>
      {coinData.label}
    </div>
  );
}

function TradeSizeInput({
  value,
  currency,
  onChange,
  onCurrencyChange,
}: {
  value?: number;
  currency: string;
  onChange: (value: number) => void;
  onCurrencyChange: (value: string) => void;
}) {
  return (
    <div className="flex gap-2">
      <Input
        type="number"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder="e.g 5000"
      />
      <Select value={currency} onValueChange={onCurrencyChange}>
        <SelectTrigger className="w-24">
          <SelectValue>{currency.toUpperCase()}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {CURRENCIES.map((curr) => (
            <SelectItem key={curr.value} value={curr.value}>
              {curr.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
