import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OrderService, {
  newOrderDto,
  OrderDto,
} from "@/helpers/Api/orders/orders.service";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import ErrorAlert from "@/components/ui/ErrorAlert";
import SuccessAlert from "@/components/ui/SuccessAlert";
import { useCryptoPrice } from "@/hooks/useCryptoPrice";

interface SellOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export function SellOrderDialog({
  isOpen,
  onClose,
  order,
}: SellOrderDialogProps) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const { rate: usdToKesRate, loading: rateLoading } = useExchangeRate(
    "USD",
    "KES"
  );

  // Replace hardcoded prices with useCryptoPrice hook
  const { price: btcPrice, loading: btcLoading } = useCryptoPrice("bitcoin");
  const { price: xmrPrice, loading: xmrLoading } = useCryptoPrice("monero");

  // Calculate the actual rate based on market price and deviation
  const getMarketRate = () => {
    const baseMarketRate =
      order.coin.toLowerCase() === "btc" ? btcPrice : xmrPrice;
    const deviationPercentage = order.rate; // e.g., -0.9 means 0.9% below market
    const adjustmentFactor = 1 + deviationPercentage / 100;
    return baseMarketRate * adjustmentFactor;
  };

  // Calculate prices
  const marketRate = getMarketRate();
  const totalUsdPrice = Number(amount) * marketRate;
  const totalKesPrice = totalUsdPrice * (usdToKesRate || 0);

  const isLoadingPrices = btcLoading || xmrLoading || rateLoading;

  // Show loading state while fetching prices
  if (isLoadingPrices) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!order) {
    return null;
  }

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!usdToKesRate) {
      setError("Exchange rate not available");
      return;
    }

    if (Number(amount) > order.amount) {
      setError("Amount exceeds available quantity");
      return;
    }

    // Only check trade limits if they're not both 0
    if (order.minTrade !== 0 || order.maxTrade !== 0) {
      if (totalUsdPrice < order.minTrade || totalUsdPrice > order.maxTrade) {
        setError(
          `Total price must be between ${order.minTrade} and ${order.maxTrade} USD`
        );
        return;
      }
    }

    setIsLoading(true);
    try {
      const orderDto = {
        buy_order_id: order.id,
        order_type: "SELL",
        currency_symbol: order.coin.toUpperCase(),
        paymentmethod: order.paymentMethod,
        amount: amount,
        coin_sold_rate_to_usd: marketRate,
        usd_rate_to_kes: usdToKesRate,
        min_limit: parseFloat(order.minTrade),
        max_limit: parseFloat(order.maxTrade),
        marketAdjustment: order.rate,
        terms: order.terms,
        tradeSizeCurrency: order.currency.toUpperCase(),
      };
      const response = await OrderService.matchBuyOrder(orderDto);

      if (response.error) {
        setError(response.message || "Failed to match order");
        return;
      }
      setSuccess("Successfully matched with buyer!");
      setTimeout(() => {
        const { orderId, tradeId } = response.data;
        router.push(`/trade/sell/${orderId}/${tradeId}`);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sell {order.coin.toUpperCase()}</DialogTitle>
        </DialogHeader>

        <ErrorAlert error={error} onClose={() => setError("")} />
        <SuccessAlert message={success} onClose={() => setSuccess("")} />

        {/* Buyer info section */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
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
            <h4 className="font-medium">Selling to {order.buyer.username}</h4>
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

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Amount ({order.coin.toUpperCase()})</Label>
            <Input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              placeholder={`Enter amount (max: ${order.amount})`}
            />
          </div>

          <div className="grid gap-2 text-sm">
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground">Market Rate:</span>
              <div className="text-right">
                <div className="font-medium">
                  1 {order.coin.toUpperCase()} = ${marketRate.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  ({order.rate > 0 ? "+" : ""}
                  {order.rate}% from market price)
                </div>
                <div className="text-muted-foreground text-xs">
                  ≈ KES {(marketRate * (usdToKesRate || 0)).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-muted-foreground">Total:</span>
              <div className="text-right">
                <div className="font-medium">
                  ${totalUsdPrice.toLocaleString()}
                </div>
                <div className="text-muted-foreground text-xs">
                  ≈ KES {totalKesPrice.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Only show trade limits if they're not both 0 */}
            {(order.minTrade !== 0 || order.maxTrade !== 0) && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Trade Limits:</span>
                <span>
                  {order.minTrade.toLocaleString()} -{" "}
                  {order.maxTrade.toLocaleString()}{" "}
                  {/* {order.currency.toUpperCase()} */}USD
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm Sell"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
