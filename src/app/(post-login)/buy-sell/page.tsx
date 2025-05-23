"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePaymentMethods } from "@/hooks/usePaymentMethod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderService from "@/helpers/Api/orders/orders.service";
import { BuyOrderDialog } from "@/components/buy-sell/BuyOrderDialog";
import { SellOrderDialog } from "@/components/buy-sell/SellOrderDialog";
import { useCryptoPrice } from "@/hooks/useCryptoPrice";
import TokenService from "@/helpers/Token/token.service";
import OrdersSkeleton from "../orders/(components)/OrdersSkeleton";
import { Pagination } from "@/components/ui/pagination";

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

const COUNTRIES = [
  { value: "all", label: "All Countries" },
  { value: "Kenya", label: "Kenya" },
  { value: "Nigeria", label: "Nigeria" },
  { value: "South Africa", label: "South Africa" },
  { value: "Ghana", label: "Ghana" },
  { value: "Uganda", label: "Uganda" },
  { value: "Tanzania", label: "Tanzania" },
  { value: "Rwanda", label: "Rwanda" },
  { value: "USA", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "Other", label: "Other Countries" },
] as const;

interface BuyFormData {
  currency: string;
  spendAmount: number;
  paymentMethod: string;
  coin: string;
  coinAmount: number;
  marketAdjustment: string;
  minTradeSize?: number;
  maxTradeSize?: number;
  terms?: string;
  tradeSizeCurrency: string;
}

function CreateBuyOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BuyFormData>({
    currency: "kes",
    spendAmount: 0,
    paymentMethod: "mpesa",
    coin: "btc",
    coinAmount: 0,
    marketAdjustment: "0",
    minTradeSize: undefined,
    maxTradeSize: undefined,
    terms: "",
    tradeSizeCurrency: "kes",
  });

  const MAX_SPEND_AMOUNT = 25000000;
  const MAX_COIN_AMOUNTS = {
    btc: 2.5,
    xmr: 100,
  };

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

  const handleMaxClick = (field: "spendAmount" | "coinAmount") => {
    if (field === "spendAmount") {
      handleInputChange("spendAmount", MAX_SPEND_AMOUNT);
    } else {
      handleInputChange(
        "coinAmount",
        MAX_COIN_AMOUNTS[formData.coin as keyof typeof MAX_COIN_AMOUNTS]
      );
    }
  };

  const validateForm = (): boolean => {
    if (formData.spendAmount < 20 || formData.spendAmount > 25000000) {
      setError("Amount must be between 20 and 25,000,000");
      return false;
    }
    if (formData.coinAmount <= 0) {
      setError("Coin amount must be greater than 0");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validateForm()) return;

    setIsLoading(true);
    try {
    } catch (err) {
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

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Buy Crypto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select
              value={formData.currency}
              onValueChange={handleCurrencyChange}
            >
              <SelectTrigger className="bg-[#f3faf6]">
                <SelectValue>
                  {CURRENCIES.map(
                    (curr) =>
                      curr.value === formData.currency && (
                        <div
                          key={curr.value}
                          className="flex items-center gap-2"
                        >
                          <Image
                            src={curr.flag}
                            alt={`${curr.label} Flag`}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          {curr.label}
                        </div>
                      )
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    <div className="flex items-center gap-2">
                      <Image
                        src={currency.flag}
                        alt={`${currency.label} Flag`}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      {currency.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Amount I wanna spend</Label>
            <div className="relative">
              <Input
                type="number"
                value={formData.spendAmount || ""}
                onChange={(e) =>
                  handleInputChange("spendAmount", Number(e.target.value))
                }
                placeholder="Enter amount from 20-25000000"
                className="bg-[#f3faf6] pr-16"
              />
              <button
                type="button"
                onClick={() => handleMaxClick("spendAmount")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-yellow-500 hover:text-yellow-600 cursor-pointer"
              >
                MAX
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Select a Payment Method</Label>
          <Select
            value={formData.paymentMethod}
            onValueChange={(value) => handleInputChange("paymentMethod", value)}
          >
            <SelectTrigger className="bg-[#f3faf6]">
              <SelectValue>MPESA</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mpesa">MPESA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Coin</Label>
            <Select
              value={formData.coin}
              onValueChange={(value) => handleInputChange("coin", value)}
            >
              <SelectTrigger className="bg-[#f3faf6]">
                <SelectValue>
                  {COINS.map(
                    (coin) =>
                      coin.value === formData.coin && (
                        <div
                          key={coin.value}
                          className="flex items-center gap-2"
                        >
                          <div
                            className={`w-6 h-6 ${coin.bgColor} rounded-full flex items-center justify-center`}
                          >
                            <Image
                              src={coin.icon}
                              alt={`${coin.label} Icon`}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          </div>
                          {coin.label}
                        </div>
                      )
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {COINS.map((coin) => (
                  <SelectItem key={coin.value} value={coin.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 ${coin.bgColor} rounded-full flex items-center justify-center`}
                      >
                        <Image
                          src={coin.icon}
                          alt={`${coin.label} Icon`}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      </div>
                      {coin.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Amount ({formData.coin.toUpperCase()})</Label>
            <div className="relative">
              <Input
                type="number"
                value={formData.coinAmount || ""}
                onChange={(e) =>
                  handleInputChange("coinAmount", Number(e.target.value))
                }
                placeholder={`Enter ${formData.coin.toUpperCase()} amount`}
                className="bg-[#f3faf6] pr-16"
              />
              <button
                type="button"
                onClick={() => handleMaxClick("coinAmount")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-yellow-500 hover:text-yellow-600 cursor-pointer"
              >
                MAX
              </button>
            </div>
          </div>
        </div>

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
            <div className="flex gap-2">
              <Input
                type="number"
                value={formData.minTradeSize || ""}
                onChange={(e) =>
                  handleInputChange("minTradeSize", Number(e.target.value))
                }
                placeholder="e.g 5000"
              />
              <Select
                value={formData.tradeSizeCurrency}
                onValueChange={(value) => {
                  handleInputChange("tradeSizeCurrency", value);
                  // Ensure both min and max trade size use same currency
                  setFormData((prev) => ({
                    ...prev,
                    tradeSizeCurrency: value,
                  }));
                }}
              >
                <SelectTrigger className="w-24">
                  <SelectValue>
                    {formData.tradeSizeCurrency.toUpperCase()}
                  </SelectValue>
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
          </div>

          <div className="space-y-2">
            <Label>
              Maximum Trade Size{" "}
              <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={formData.maxTradeSize || ""}
                onChange={(e) =>
                  handleInputChange("maxTradeSize", Number(e.target.value))
                }
                placeholder="e.g 5000"
              />
              <Select
                value={formData.tradeSizeCurrency}
                onValueChange={(value) => {
                  handleInputChange("tradeSizeCurrency", value);
                  // Ensure both min and max trade size use same currency
                  setFormData((prev) => ({
                    ...prev,
                    tradeSizeCurrency: value,
                  }));
                }}
              >
                <SelectTrigger className="w-24">
                  <SelectValue>
                    {formData.tradeSizeCurrency.toUpperCase()}
                  </SelectValue>
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
          </div>
        </div>

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

interface Seller {
  id: string;
  username: string;
  image: string;
  completedTrades: number;
  rating: number;
}

interface SellOrder {
  id: string;
  seller: Seller;
  coin: (typeof COINS)[number]["value"];
  amount: number;
  rate: number;
  currency: (typeof CURRENCIES)[number]["value"];
  country: string; // Add country field
  paymentMethod: string;
  minTrade: number;
  maxTrade: number;
}

interface Buyer {
  id: string;
  username: string;
  image: string;
  completedTrades: number;
  rating: number;
}

interface BuyOrder {
  id: string;
  buyer: Buyer;
  coin: (typeof COINS)[number]["value"];
  amount: number;
  rate: number;
  currency: (typeof CURRENCIES)[number]["value"];
  country: string; // Add country field
  paymentMethod: string;
  minTrade: number;
  maxTrade: number;
  terms?: string;
}

interface FilterBarProps {
  onFilterChange: (filters: {
    coin: string;
    paymentMethod: string;
    minAmount: string;
    maxAmount: string;
    currency: string;
    username: string;
    country: string; // Add country field
  }) => void;
}

function FilterBar({ onFilterChange }: FilterBarProps) {
  const { paymentMethods, isLoading: isLoadingPayments } = usePaymentMethods();
  const [filters, setFilters] = useState({
    coin: "all",
    paymentMethod: "all",
    minAmount: "",
    maxAmount: "",
    currency: "kes",
    username: "",
    country: "all", // Add country field with default value "all"
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      {/* Add search input */}
      <div className="flex gap-4 items-end"></div>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-2">
          <Label>Coin</Label>
          <Select
            value={filters.coin}
            onValueChange={(value) => handleFilterChange("coin", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Coin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Coins</SelectItem>
              {COINS.map((coin) => (
                <SelectItem key={coin.value} value={coin.value}>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 ${coin.bgColor} rounded-full`}>
                      <Image
                        src={coin.icon}
                        alt={coin.label}
                        width={16}
                        height={16}
                      />
                    </div>
                    {coin.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Select
            value={filters.paymentMethod}
            onValueChange={(value) =>
              handleFilterChange("paymentMethod", value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={
                  isLoadingPayments ? "Loading..." : "Payment Method"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              {paymentMethods.map((method) => (
                <SelectItem key={method.id} value={method.name}>
                  {method.name.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add country filter dropdown */}
        <div className="space-y-2">
          <Label>Country</Label>
          <Select
            value={filters.country}
            onValueChange={(value) => handleFilterChange("country", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Amount Range</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              className="w-[100px]"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange("minAmount", e.target.value)}
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="Max"
              className="w-[100px]"
              value={filters.maxAmount}
              onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
            />
            <Select
              value={filters.currency}
              onValueChange={(value) => handleFilterChange("currency", value)}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
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
        </div>
        <div className="space-y-2 flex-1">
          <Label>Search by Username</Label>
          <Input
            type="text"
            placeholder="Search trader username..."
            value={filters.username}
            onChange={(e) => handleFilterChange("username", e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>
    </div>
  );
}

function BuyOrders() {
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    coin: "all",
    paymentMethod: "all",
    minAmount: "",
    maxAmount: "",
    currency: "kes",
    username: "",
    country: "all",
  });
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; // Number of orders per page

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const { price: btcPrice, loading: btcLoading } = useCryptoPrice("bitcoin");
  const { price: xmrPrice, loading: xmrLoading } = useCryptoPrice("monero");

  const getCurrentPriceForCoin = (coin: string): number => {
    switch (coin) {
      case "btc":
        return btcPrice;
      case "xmr":
        return xmrPrice;
      default:
        return 0;
    }
  };

  const handleSellNow = (order: any) => {
    setSelectedOrder(order);
    setIsSellDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const fetchBuyOrders = async (
    currentFilters: typeof filters,
    page: number
  ) => {
    setIsLoading(true);
    try {
      // Add pagination parameters to API call
      const data = await OrderService.getAllBuyOrders(page, itemsPerPage);

      // Update total pages from API response
      setTotalPages(data.data.totalPages || 1);

      let filtered = data.data.data;

      if (currentFilters.username) {
        const searchTerm = currentFilters.username.toLowerCase();
        filtered = filtered.filter((order: any) =>
          order.buyer.username.toLowerCase().includes(searchTerm)
        );
      }

      if (currentFilters.coin !== "all") {
        filtered = filtered.filter(
          (order: any) => order.coin === currentFilters.coin
        );
      }

      if (currentFilters.paymentMethod !== "all") {
        filtered = filtered.filter(
          (order: any) =>
            order.paymentMethod.toLowerCase() ===
            currentFilters.paymentMethod.toLowerCase()
        );
      }

      if (currentFilters.country !== "all") {
        filtered = filtered.filter(
          (order: any) => order.country === currentFilters.country
        );
      }

      filtered = filtered.map((order: any) => ({
        ...order,
        currentMarketPrice: getCurrentPriceForCoin(order.coin),
      }));

      setFilteredOrders(filtered);
    } catch (error) {
      console.error("Error fetching buy orders:", error);
      setError("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!btcLoading && !xmrLoading) {
      fetchBuyOrders(filters, currentPage);
    }
  }, [filters, currentPage, btcLoading, xmrLoading]);

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    const getUserId = async () => {
      const decoded = await TokenService.decodeToken();
      if (decoded) {
        setUserId(decoded.userId);
      }
    };
    getUserId();
  }, []);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  if (isLoading || btcLoading || xmrLoading) {
    return <OrdersSkeleton />;
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <FilterBar onFilterChange={handleFilterChange} />

      {filteredOrders.length > 0 ? (
        <>
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      {/* Buyer Info */}
                      <div className="flex items-center gap-2 border-r pr-4">
                        <div className="relative">
                          <Image
                            src={order.buyer.image}
                            alt={order.buyer.username}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {order.buyer.username}
                          </h4>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span>{order.buyer.completedTrades} trades</span>
                            <span>•</span>
                            <div className="flex items-center">
                              <span>{order.buyer.rating}</span>
                              <svg
                                className="w-4 h-4 text-yellow-400 ml-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Coin Info with updated price display */}
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-10 h-10 ${
                            COINS.find((c) => c.value === order.coin)?.bgColor
                          } rounded-full flex items-center justify-center`}
                        >
                          <Image
                            src={
                              COINS.find((c) => c.value === order.coin)?.icon ||
                              ""
                            }
                            alt={order.coin.toUpperCase()}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            Buying {order.amount} {order.coin.toUpperCase()}
                          </h3>
                          <div className="text-sm text-muted-foreground">
                            <div className="text-xs">
                              Trading price:{" "}
                              {(
                                (order.rate / 100) * order.currentMarketPrice +
                                order.currentMarketPrice
                              ).toLocaleString()}{" "}
                              USD
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">
                          Payment Method:
                        </span>
                        <span className="font-medium">
                          {order.paymentMethod.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">
                          Trade Limits:
                        </span>
                        <span className="font-medium">
                          {order.minTrade.toLocaleString()}{" "}
                          {order.currency.toUpperCase()} -{" "}
                          {order.maxTrade.toLocaleString()}{" "}
                          {/* {order.currency.toUpperCase()} */} USD
                        </span>
                      </div>
                      {/* Add country display */}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Country:</span>
                        <span className="font-medium">{order.country}</span>
                      </div>
                      {order.terms && (
                        <div className="text-sm text-muted-foreground mt-2">
                          <p>Terms: {order.terms}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {userId !== order.buyer.id && (
                    <Button
                      variant="default"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={() => handleSellNow(order)}
                    >
                      Sell Now
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Add pagination component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-gray-100 p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className="text-xl font-semibold">No Buy Orders Found</h3>
            <p className="text-muted-foreground max-w-md">
              We couldn't find any buy orders matching your current filters. Try
              adjusting your filter criteria or check back later.
            </p>
            <Button
              className="mt-4 bg-emerald-500 hover:bg-emerald-600"
              onClick={() =>
                setFilters({
                  coin: "all",
                  paymentMethod: "all",
                  minAmount: "",
                  maxAmount: "",
                  currency: "kes",
                  username: "",
                  country: "all",
                })
              }
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      )}

      {selectedOrder && (
        <SellOrderDialog
          isOpen={isSellDialogOpen}
          onClose={() => {
            setIsSellDialogOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
        />
      )}
    </div>
  );
}

function SellOrders() {
  const [filteredOrders, setFilteredOrders] = useState<SellOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    coin: "all",
    paymentMethod: "all",
    minAmount: "",
    maxAmount: "",
    currency: "kes",
    username: "",
    country: "all",
  });
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; // Number of orders per page

  const [buyingOrderId, setBuyingOrderId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);

  const handleBuyNow = (order: any) => {
    setSelectedOrder(order);
    setIsBuyDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const fetchSellOrders = async (
    currentFilters: typeof filters,
    page: number
  ) => {
    setIsLoading(true);
    try {
      // Add pagination parameters to API call
      const response = await OrderService.getAllSellOrders(page, itemsPerPage);

      // Update total pages from API response
      setTotalPages(response.data.totalPages || 1);

      let filtered = response.data.data;

      if (currentFilters.username) {
        const searchTerm = currentFilters.username.toLowerCase();
        filtered = filtered.filter((order: any) =>
          order.seller.username.toLowerCase().includes(searchTerm)
        );
      }

      if (currentFilters.coin !== "all") {
        filtered = filtered.filter(
          (order: any) => order.coin === currentFilters.coin
        );
      }
      if (currentFilters.paymentMethod !== "all") {
        filtered = filtered.filter(
          (order: any) =>
            order.paymentMethod.toLowerCase() ===
            currentFilters.paymentMethod.toLowerCase()
        );
      }
      if (currentFilters.minAmount) {
        filtered = filtered.filter(
          (order: any) =>
            order.rate * order.amount >= Number(currentFilters.minAmount)
        );
      }
      if (currentFilters.maxAmount) {
        filtered = filtered.filter(
          (order: any) =>
            order.rate * order.amount <= Number(currentFilters.maxAmount)
        );
      }
      if (currentFilters.country !== "all") {
        filtered = filtered.filter(
          (order: any) => order.country === currentFilters.country
        );
      }

      setFilteredOrders(filtered);
    } catch (err) {
      setError("Failed to fetch sell orders");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellOrders(filters, currentPage);
  }, [filters, currentPage]);

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    const getUserId = async () => {
      const decoded = await TokenService.decodeToken();
      if (decoded) {
        setUserId(decoded.userId);
      }
    };
    getUserId();
  }, []);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return <OrdersSkeleton />;
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <FilterBar onFilterChange={handleFilterChange} />

      {filteredOrders.length > 0 ? (
        <>
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      {/* Seller Info */}
                      <div className="flex items-center gap-2 border-r pr-4">
                        <div className="relative">
                          <Image
                            src={order.seller.image}
                            alt={order.seller.username}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {order.seller.username}
                          </h4>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span>{order.seller.completedTrades} trades</span>
                            <span>•</span>
                            <div className="flex items-center">
                              <span>{order.seller.rating}</span>
                              <svg
                                className="w-4 h-4 text-yellow-400 ml-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Coin Info */}
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-10 h-10 ${
                            COINS.find((c) => c.value === order.coin)
                              ?.bgColor || ""
                          } rounded-full flex items-center justify-center`}
                        >
                          <Image
                            src={
                              COINS.find((c) => c.value === order.coin)?.icon ||
                              ""
                            }
                            alt={order.coin.toUpperCase()}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            Selling {order.amount} {order.coin.toUpperCase()}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Rate: 1 {order.coin.toUpperCase()} ={" "}
                            {order.rate.toLocaleString()} {"USD"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">
                          Payment Method:
                        </span>
                        <span className="font-medium">
                          {order.paymentMethod.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">
                          Trade Limits:
                        </span>
                        <span className="font-medium">
                          {order.minTrade.toLocaleString()}{" "}
                          {order.currency.toUpperCase()} -{" "}
                          {order.maxTrade.toLocaleString()}{" "}
                          {order.currency.toUpperCase() || "KES"}
                        </span>
                      </div>
                      {/* Add country display */}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Country:</span>
                        <span className="font-medium">{order.country}</span>
                      </div>
                    </div>
                  </div>
                  {userId !== order.seller.id && (
                    <Button
                      variant="default"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={() => handleBuyNow(order)}
                      disabled={buyingOrderId === order.id}
                    >
                      {buyingOrderId === order.id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        "Buy Now"
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Add pagination component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-gray-100 p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className="text-xl font-semibold">No Sell Orders Found</h3>
            <p className="text-muted-foreground max-w-md">
              We couldn't find any sell orders matching your current filters.
              Try adjusting your filter criteria or check back later.
            </p>
            <Button
              className="mt-4 bg-emerald-500 hover:bg-emerald-600"
              onClick={() =>
                setFilters({
                  coin: "all",
                  paymentMethod: "all",
                  minAmount: "",
                  maxAmount: "",
                  currency: "kes",
                  username: "",
                  country: "all",
                })
              }
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      )}

      {selectedOrder && (
        <BuyOrderDialog
          isOpen={isBuyDialogOpen}
          onClose={() => {
            setIsBuyDialogOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
        />
      )}
    </div>
  );
}

export default function BuyPage() {
  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="buy" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="buy">Sell Crypto</TabsTrigger>
            <TabsTrigger value="market">Buy Crypto</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="buy" className="space-y-4">
          <h2 className="text-3xl font-bold mb-6">Available Buy Orders</h2>
          <BuyOrders />
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <h2 className="text-3xl font-bold mb-6">Available Sell Orders</h2>
          <SellOrders />
        </TabsContent>
      </Tabs>
    </div>
  );
}
