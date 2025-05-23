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
import OrderService from "@/helpers/Api/orders/orders.service";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ErrorAlert from "@/components/ui/ErrorAlert";
import SuccessAlert from "@/components/ui/SuccessAlert";
import { useExchangeRate } from "@/hooks/useExchangeRate";

interface BuyOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export function BuyOrderDialog({
  isOpen,
  onClose,
  order,
}: BuyOrderDialogProps) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Add exchange rate hook
  const { rate: usdToKesRate, loading: rateLoading } = useExchangeRate(
    "USD",
    "KES"
  );

  // Calculate total price with current exchange rate
  const totalPrice = order
    ? Number(amount) * order.rate * (usdToKesRate || 1)
    : 0;

  if (!order) return null;

  const handleSubmit = async () => {
    if (!amount) {
      setError("Amount cannot be empty!");
      return;
    }

    if (!usdToKesRate) {
      setError("Exchange rate not available");
      return;
    }

    const amountNum = Number(amount);
    const remainingAmountNum = Number(order.remaining_amount);

    if (amountNum > remainingAmountNum) {
      setError("Amount cannot be greater than order amount");
      return;
    }
    setIsLoading(true);
    try {
      const response = await OrderService.createTrade(
        order.id,
        order.seller.id,
        Number(amount)
      );
      if (response.error === false) {
        setAmount("");
        setSuccess("Trade initiated successfully!");
        setTimeout(() => {
          router.push(`/trade/buy/${order.id}/${response.data.trade_id}`);
        }, 1500);
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error("Error initiating trade:", error);
      setError("Failed to initiate trade");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy {order.coin.toUpperCase()}</DialogTitle>
        </DialogHeader>

        {/* Add Alert components */}
        <ErrorAlert error={error} onClose={() => setError("")} />
        <SuccessAlert message={success} onClose={() => setSuccess("")} />

        {/* Add seller info section */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
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
            <h4 className="font-medium">Buying from {order.seller.username}</h4>
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
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rate:</span>
              <span>
                1 {order.coin.toUpperCase()} = {order.rate.toLocaleString()} USD
                {" = "}
                {(order.rate * (usdToKesRate || 0)).toLocaleString()} KES
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total Price:</span>
              <div className="text-right">
                <div>
                  {(totalPrice / (usdToKesRate || 1)).toLocaleString()} USD
                </div>
                <div className="text-sm text-muted-foreground">
                  {totalPrice.toLocaleString()} KES
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Trade Limits:</span>
              <span>
                {order.minTrade.toLocaleString()} -{" "}
                {order.maxTrade.toLocaleString()} USD
              </span>
            </div>
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
            {isLoading ? "Processing..." : "Confirm Buy"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
