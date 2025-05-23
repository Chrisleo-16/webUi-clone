"use client";
import React, { useEffect, useState, Suspense, useCallback } from "react";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useTimer } from "react-timer-hook";
import webSocketService from "@/helpers/Api/ws/ws.service";
import orderService from "@/helpers/Api/orders/orders.service";
import {
  PartialTradesModel,
  OrderModel,
  PaymentDetails,
} from "@/types/trades.types";
import { useGlobalStore } from "@/lib/GlobalState";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  MessageSquare,
  CreditCard,
  Info,
  DollarSign,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { format, addMinutes } from "date-fns";

import TradeChat from "../Chat";
import FAQAccordion from "../FAQ";
import TradeStatusTimeline from "../TradeStatusTimeline";

const CardSkeleton = () => (
  <div className="space-y-2 animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
    <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
);

const useThrottledFetch = (fetchFn: Function, delay: number) => {
  const [lastFetchTime, setLastFetchTime] = useState(0);

  return useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchTime > delay) {
      setLastFetchTime(now);
      return fetchFn();
    }
  }, [fetchFn, lastFetchTime, delay]);
};

interface TradeCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

const TradeCard = ({
  title,
  value,
  subtitle,
  icon,
  className,
}: TradeCardProps) => (
  <Card className={cn("transition-all hover:shadow-md", className)}>
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </CardContent>
  </Card>
);

export function BuyTradeClient({
  orderId,
  tradeId,
}: {
  orderId: string;
  tradeId: string;
}) {
  const [orderDetails, setOrderDetails] = useState<OrderModel | null>(null);
  const [partialTrade, setPartialTrade] = useState<PartialTradesModel | null>(
    null
  );
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [isPaid, setIsPaid] = useState(false);
  const [isTransferred, setIsTransferred] = useState(false);
  const [error, setError] = useState(false);
  const [customError, setCustomError] = useState("");
  const [appealLoading, setAppealLoading] = useState(false);
  const [appealReason, setAppealReason] = useState("");
  const [appealDialogOpen, setAppealDialogOpen] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const [appealTimeElapsed, setAppealTimeElapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [admincloseTrade, setAdmincloseTrade] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const updateData = useGlobalStore((state: any) => state.updateData);
  const [tradeData, setTradeData] = useState({
    cryptoAmount: 0,
    cryptoSymbol: "",
    pricePerUnitUSD: 0,
    totalUSD: 0,
    totalKES: 0,
    kesRate: 0,
  });
  const [autoCancelTime, setAutoCancelTime] = useState<Date | null>(null);
  const [showAutoCancelTimer, setShowAutoCancelTimer] = useState(false);
  const [appealerId, setAppealerId] = useState<string | null>(null);
  const [tradeAppealReason, setTradeAppealReason] = useState("");
  const [isUserAppealer, setIsUserAppealer] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const [dataFetchedAt, setDataFetchedAt] = useState(Date.now());

  const [pollingEnabled, setPollingEnabled] = useState(true);
  const [pollingInterval, setPollingInterval] = useState(15000);
  const [pollCount, setPollCount] = useState(0);
  const [lastPolledAt, setLastPolledAt] = useState<Date | null>(null);
  const [pollingErrors, setPollingErrors] = useState(0);

  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp: new Date(),
    onExpire: () => setAppealTimeElapsed(true),
  });

  const {
    seconds: cancelSeconds,
    minutes: cancelMinutes,
    hours: cancelHours,
    restart: restartCancelTimer,
  } = useTimer({
    expiryTimestamp: new Date(Date.now() + 900000),
    onExpire: () => {
      setShowAutoCancelTimer(false);
      if (Date.now() - dataFetchedAt > 10000) {
        fetchTradeDetails();
      }
    },
    autoStart: false,
  });

  const fetchTradeDetailsBase = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getOrderTradeDetails(
        orderId,
        tradeId
      );

      if (pollingErrors > 0) {
        setPollingErrors(0);
      }

      if (!response || response.error || !response.data) {
        setError(true);
        setCustomError(response?.message || "Failed to fetch trade details");
        return;
      }

      const { order, partialTrade, paymentDetailsToShow } = response.data.data;

      if (!order || !partialTrade) {
        setError(true);
        setCustomError("Incomplete trade data");
        return;
      }

      setOrderDetails(order);
      setPartialTrade(partialTrade);
      setPaymentDetails(paymentDetailsToShow);
      setIsPaid(partialTrade.is_buyer_paid);
      setIsTransferred(partialTrade.has_seller_received);
      setIsFlagged(partialTrade.is_flagged);
      setIsCancelled(partialTrade.is_canceled);
      if (partialTrade.cancellation_reason) {
        setCancellationReason(partialTrade.cancellation_reason);
      }

      const cryptoAmount = Number(partialTrade.amount);
      const pricePerUnitUSD = Number(order.coin_sold_rate);
      const kesRate = Number(order.usd_rate);
      const totalUSD = cryptoAmount * pricePerUnitUSD;
      const totalKES = totalUSD * kesRate;

      setTradeData({
        cryptoAmount,
        cryptoSymbol: order.currency_symbol,
        pricePerUnitUSD,
        totalUSD,
        totalKES,
        kesRate,
      });

      if (partialTrade.pay_time) {
        initializeAppealCountdown(partialTrade.pay_time);
      }

      if (partialTrade) {
        let creationTime;
        try {
          const joiningTimeStr = partialTrade.trade_joining_time;
          const createTimeStr = partialTrade.create_time;

          if (joiningTimeStr) {
            creationTime = new Date(joiningTimeStr);

            if (
              isNaN(creationTime.getTime()) &&
              typeof joiningTimeStr === "string"
            ) {
              creationTime = new Date(joiningTimeStr.replace(" ", "T"));
            }
          }

          if (!creationTime || isNaN(creationTime.getTime())) {
            if (createTimeStr) {
              creationTime = new Date(createTimeStr);

              if (
                isNaN(creationTime.getTime()) &&
                typeof createTimeStr === "string"
              ) {
                creationTime = new Date(createTimeStr.replace(" ", "T"));
              }
            }
          }

          if (!creationTime || isNaN(creationTime.getTime())) {
            console.log("⚠️ Using fallback time calculation");
            creationTime = new Date();
            creationTime.setMinutes(creationTime.getMinutes() - 14);
          }
        } catch (error) {
          console.error("Error parsing date:", error);
          creationTime = new Date();
          creationTime.setMinutes(creationTime.getMinutes() - 14);
        }

        console.log("Trade created at (parsed):", creationTime);

        const cancelTime = addMinutes(creationTime, 15);
        console.log("Should auto-cancel at:", cancelTime);

        const now = new Date();
        console.log("Current time:", now);

        const diffMs = cancelTime.getTime() - now.getTime();
        console.log("Time difference in ms:", diffMs);

        const GRACE_PERIOD_MS = 30 * 60 * 1000; // 30 minute grace period for testing/dev

        if (
          !partialTrade.is_buyer_paid &&
          !partialTrade.is_canceled &&
          !partialTrade.has_seller_received
        ) {
          if (diffMs > 0) {
            console.log("✅ SHOWING TIMER for", diffMs, "ms");
            setShowAutoCancelTimer(true);
            setTimerExpired(false);

            const expiryTime = new Date();
            expiryTime.setMilliseconds(expiryTime.getMilliseconds() + diffMs);
            restartCancelTimer(expiryTime);
          } else if (diffMs > -GRACE_PERIOD_MS) {
            console.log("⚠️ SHOWING EXPIRED TIMER WARNING");
            setShowAutoCancelTimer(true);
            setTimerExpired(true);

            const expiryTime = new Date();
            restartCancelTimer(expiryTime);
          } else {
            console.log("❌ NOT showing timer - well past expiration");
            setShowAutoCancelTimer(false);
          }
        } else {
          console.log(
            "❌ NOT showing timer. Paid:",
            partialTrade.is_buyer_paid,
            "Canceled:",
            partialTrade.is_canceled,
            "Released:",
            partialTrade.has_seller_received,
            "Diff:",
            diffMs
          );
          setShowAutoCancelTimer(false);
        }
      }
      setDataFetchedAt(Date.now());

      setLastPolledAt(new Date());
      setPollCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Trade details fetch error:", error);

      setPollingErrors((prev) => prev + 1);

      setError(true);
      setCustomError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      toast.error("Failed to fetch trade details");
    } finally {
      setIsLoading(false);
    }
  }, [orderId, tradeId, restartCancelTimer, pollingErrors]);

  const fetchTradeDetails = useThrottledFetch(fetchTradeDetailsBase, 10000);

  useEffect(() => {
    fetchTradeDetailsBase();

    const handleOrderUpdate = (details: any) => {
      if (!details) return;
      setOrderDetails(details);
    };

    const handleTradeUpdate = (details: any) => {
      if (!details) return;
      setIsPaid(details.is_buyer_paid);
      setIsTransferred(details.has_seller_received);
      setIsFlagged(details.is_flagged);
      setIsCancelled(details.is_canceled);

      if (
        details.is_buyer_paid ||
        details.is_canceled ||
        details.has_seller_received
      ) {
        setShowAutoCancelTimer(false);
      }

      if (details.pay_time) {
        initializeAppealCountdown(details.pay_time);
      }
    };

    const handlePaymentUpdate = (details: any) => {
      if (!details) return;
      setPaymentDetails(details);
    };

    webSocketService.addEventListener("orderUpdate", handleOrderUpdate);
    webSocketService.addEventListener("tradeUpdate", handleTradeUpdate);
    webSocketService.addEventListener("paymentUpdate", handlePaymentUpdate);

    return () => {
      webSocketService.removeEventListener("orderUpdate", handleOrderUpdate);
      webSocketService.removeEventListener("tradeUpdate", handleTradeUpdate);
      webSocketService.removeEventListener(
        "paymentUpdate",
        handlePaymentUpdate
      );
    };
  }, [fetchTradeDetailsBase]);

  useEffect(() => {
    if (!pollingEnabled) return;

    const currentInterval =
      pollingErrors > 0
        ? Math.min(pollingInterval * Math.pow(1.5, pollingErrors), 60000) // Max 1 minute
        : pollingInterval;

    const pollingTimer = setInterval(() => {
      if (!isLoading) {
        fetchTradeDetailsBase();
      }
    }, currentInterval);

    return () => {
      clearInterval(pollingTimer);
    };
  }, [
    fetchTradeDetailsBase,
    pollingEnabled,
    pollingInterval,
    pollingErrors,
    isLoading,
  ]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const initializeAppealCountdown = (payTime: any) => {
    const payTimestamp = new Date(payTime).getTime();
    const currentTimestamp = new Date().getTime();
    const timeElapsed = (currentTimestamp - payTimestamp) / 1000;
    const remainingTime = 300 - timeElapsed;

    if (remainingTime > 0) {
      const time = new Date();
      time.setSeconds(time.getSeconds() + remainingTime);
      restart(time);
    } else {
      setAppealTimeElapsed(true);
    }
  };

  const confirmPayment = async () => {
    try {
      const response = await orderService.iHaveTransfered(tradeId);
      if (response.error) {
        toast.error(response.message);
        return;
      }
      setIsPaid(true);
      toast.success("Payment confirmed successfully");
    } catch (error) {
      toast.error("Failed to confirm payment");
    }
  };

  const appealTrade = async () => {
    try {
      setAppealLoading(true);
      if (!appealReason || appealReason.length < 10) {
        toast.error(
          "Please enter a detailed reason for appeal (at least 10 characters)"
        );
        setAppealLoading(false);
        return;
      }

      const response = await orderService.appealTrade(tradeId, appealReason);
      setIsFlagged(true);
      toast.success(response.message);
      setAppealLoading(false);
      setAppealReason("");
      setAppealDialogOpen(false);
    } catch (error) {
      setAppealLoading(false);
      toast.error("Failed to initiate appeal");
    }
  };

  const cancelAppeal = async () => {
    try {
      setAppealLoading(true);
      const response = await orderService.cancelAppeal(tradeId);
      toast.success(response.message);
      setIsFlagged(false);
      setAppealDialogOpen(false);
      setAppealLoading(false);
    } catch (error) {
      setAppealLoading(false);
      toast.error("Failed to cancel appeal");
    }
  };

  const handleAdminAction = (data: any) => {
    updateData(data);
    setAdmincloseTrade(true);
  };

  const getTradeStatus = () => {
    if (isCancelled) return { label: "Cancelled", color: "bg-red-500" };
    if (isTransferred) return { label: "Complete", color: "bg-green-500" };
    if (isFlagged) return { label: "Flagged", color: "bg-yellow-500" };
    if (isPaid) return { label: "Paid", color: "bg-blue-500" };
    return { label: "Pending", color: "bg-gray-500" };
  };

  const tradeStatus = getTradeStatus();

  const formatCancelTimer = () => {
    const formattedHours = cancelHours > 0 ? `${cancelHours}:` : "";
    const formattedMinutes = String(cancelMinutes).padStart(2, "0");
    const formattedSeconds = String(cancelSeconds).padStart(2, "0");
    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
  };

  const renderPollingControls = () => (
    <div className="flex items-center text-xs text-muted-foreground mt-2 gap-2">
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={pollingEnabled}
          onChange={(e) => setPollingEnabled(e.target.checked)}
          className="h-3 w-3"
        />
        Auto-refresh
      </label>
      {lastPolledAt && (
        <span>
          Last updated: {lastPolledAt.toLocaleTimeString()} (
          {pollCount > 0 ? `${pollCount} updates` : "initial load"})
        </span>
      )}
    </div>
  );

  if (error) {
    return (
      <div className="container mx-auto p-4 my-8 max-w-6xl">
        <Card className="border-red-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle size={24} />
              Error Loading Trade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {customError || "Failed to load trade details. Please try again."}
            </p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Buy Trade #{tradeId.substring(0, 6)}
          </h1>
          <p className="text-muted-foreground">
            With {partialTrade?.seller_username || "Seller"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("py-1.5", tradeStatus.color)}>
            {tradeStatus.label}
          </Badge>
        </div>
      </header>

      {/* TIMER SECTION - Modified to show expired warning */}
      {showAutoCancelTimer && (
        <div
          className={`border-2 p-4 rounded-md shadow-lg ${
            timerExpired
              ? "bg-red-50 border-red-500"
              : "bg-orange-50 border-orange-500"
          }`}
        >
          <div className="flex items-center gap-4">
            <Clock
              className={`h-10 w-10 ${
                timerExpired ? "text-red-500" : "text-orange-500"
              } animate-pulse`}
            />
            <div>
              {timerExpired ? (
                <>
                  <p className="text-red-700 font-medium text-lg">
                    Payment deadline expired!
                  </p>
                  <p className="text-red-700 text-3xl font-bold tracking-wider">
                    00:00:00
                  </p>
                  <p className="text-red-600 mt-1">
                    The payment time has expired. This trade may be
                    automatically cancelled soon. Please contact the seller or
                    support if you need assistance.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-orange-700 font-medium text-lg">
                    Complete payment within:
                  </p>
                  <p className="text-orange-700 text-3xl font-bold tracking-wider">
                    {formatCancelTimer()}
                  </p>
                  <p className="text-orange-600 mt-1">
                    Your trade will be automatically cancelled if payment is not
                    made before this timer expires
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status banners */}
      <AnimatePresence>
        {/* Remove the timer from here since we moved it above */}

        {isPaid && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-blue-500" />
              <p className="text-blue-700">Payment has been marked as sent</p>
            </div>
          </motion.div>
        )}

        {isTransferred && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <p className="text-green-700">
                Seller has released the coins. Trade complete!
              </p>
            </div>
          </motion.div>
        )}

        {isFlagged && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-amber-500" />
              <div>
                <p className="text-amber-700">
                  This trade is flagged and awaits admin intervention
                </p>
                {tradeAppealReason && (
                  <p className="text-amber-600 text-sm mt-1">
                    Appeal reason: {tradeAppealReason}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {admincloseTrade && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-md"
          >
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-purple-500" />
              <p className="text-purple-700">
                This trade has been closed by an admin
              </p>
            </div>
          </motion.div>
        )}

        {isCancelled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <div>
                <p className="text-red-700 font-medium">
                  This trade has been cancelled
                </p>
                {cancellationReason && (
                  <p className="text-red-600 text-sm mt-1">
                    Reason: {cancellationReason}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Trade details */}
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<CardSkeleton />}>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Trade Details</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <TradeCard
                    title={`Amount (${tradeData.cryptoSymbol})`}
                    value={tradeData.cryptoAmount.toFixed(8)}
                    icon={<Info className="h-4 w-4 text-muted-foreground" />}
                  />
                  <TradeCard
                    title="Price per unit"
                    value={`$${tradeData.pricePerUnitUSD.toFixed(2)}`}
                    icon={
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    }
                  />
                  <TradeCard
                    title="Total (USD)"
                    value={`$${tradeData.totalUSD.toFixed(2)}`}
                    icon={
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    }
                  />
                  <TradeCard
                    title="Total (KES)"
                    value={`KES ${tradeData.totalKES.toFixed(2)}`}
                    icon={
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    }
                  />
                  <TradeCard
                    title="USD/KES Rate"
                    value={tradeData.kesRate.toFixed(2)}
                    icon={
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    }
                  />
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Seller Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Username
                        </p>
                        <p>{partialTrade?.seller_username || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Preferred Payment
                        </p>
                        <p>{orderDetails?.paymentmethod || "Not specified"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payment Tab */}
              <TabsContent value="payment" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {isCancelled ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <CreditCard className="h-5 w-5" />
                      )}
                      {isCancelled ? "Trade Cancelled" : "Payment Instructions"}
                    </CardTitle>
                    <CardDescription>
                      {isCancelled
                        ? "This trade has been cancelled and no further actions can be taken."
                        : "Follow these steps to complete your payment:"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isCancelled ? (
                      <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
                        <div className="flex items-center gap-3 mb-3">
                          <AlertCircle className="h-6 w-6 text-red-500" />
                          <div className="font-medium">Trade Cancelled</div>
                        </div>
                        <p className="mb-2">
                          This trade has been cancelled and is now closed. No
                          further actions can be taken.
                        </p>
                        {cancellationReason && (
                          <p className="text-sm border-t border-red-200 pt-2 mt-2">
                            <strong>Reason:</strong> {cancellationReason}
                          </p>
                        )}
                      </div>
                    ) : (
                      <>
                        <ol className="list-decimal list-inside space-y-2 pl-2">
                          <li>
                            Ask the seller for their payment details in the chat
                          </li>
                          <li>
                            Make a payment of{" "}
                            <strong>KES {tradeData.totalKES.toFixed(2)}</strong>{" "}
                            using {orderDetails?.paymentmethod}
                          </li>
                          <li>
                            Click "I Have Made Payment" to notify the seller
                          </li>
                          <li>
                            Wait for the seller to verify and release the coins
                          </li>
                        </ol>

                        <div className="mt-6 space-y-4">
                          <Button
                            onClick={confirmPayment}
                            disabled={isPaid || isLoading}
                            className="w-full"
                            size="lg"
                          >
                            {isLoading ? (
                              <ClipLoader color="#ffffff" size={16} />
                            ) : isPaid ? (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Payment Confirmed
                              </>
                            ) : (
                              "I Have Made Payment"
                            )}
                          </Button>

                          {isPaid && !isTransferred && (
                            <Dialog
                              open={appealDialogOpen}
                              onOpenChange={setAppealDialogOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  className="w-full"
                                  disabled={
                                    !appealTimeElapsed ||
                                    partialTrade?.is_flagged
                                  }
                                >
                                  {appealTimeElapsed ? (
                                    partialTrade?.is_flagged ? (
                                      "Trade is Flagged"
                                    ) : (
                                      "Appeal Trade"
                                    )
                                  ) : (
                                    <span className="flex items-center gap-2">
                                      <Clock className="h-4 w-4" />
                                      Appeal in{" "}
                                      {formatTime(seconds + minutes * 60)}
                                    </span>
                                  )}
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Appeal Trade</DialogTitle>
                                  <DialogDescription>
                                    Please provide a detailed reason for your
                                    appeal. This will be reviewed by our team.
                                  </DialogDescription>
                                </DialogHeader>
                                <Textarea
                                  placeholder="Enter your appeal reason (min 10 characters)"
                                  className="min-h-[100px]"
                                  onChange={(e) =>
                                    setAppealReason(e.target.value)
                                  }
                                />
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={appealTrade}
                                    disabled={appealLoading}
                                  >
                                    {appealLoading ? (
                                      <ClipLoader color="#000000" size={16} />
                                    ) : (
                                      "Submit Appeal"
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}

                          {isFlagged && isUserAppealer && (
                            <Button
                              variant="destructive"
                              onClick={cancelAppeal}
                              disabled={appealLoading}
                              className="w-full"
                            >
                              {appealLoading ? (
                                <ClipLoader color="#000000" size={16} />
                              ) : (
                                "Cancel Appeal"
                              )}
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline">
                <TradeStatusTimeline
                  isPaid={isPaid}
                  isReleased={isTransferred}
                  isFlagged={isFlagged}
                  isAdminClosed={admincloseTrade}
                />
              </TabsContent>
            </Tabs>
          </Suspense>

          {/* FAQ Section */}
          <Suspense fallback={<CardSkeleton />}>
            <FAQAccordion />
          </Suspense>
        </div>

        {/* Right column - Chat */}
        <div className="lg:w-full overflow-hidden">
          <Card className="h-full">
            <CardHeader className="p-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4" />
                Chat with Seller
              </CardTitle>
              <CardDescription className="text-xs">
                Communicate securely with{" "}
                {partialTrade?.seller_username || "the seller"}
              </CardDescription>
            </CardHeader>

            {!isPaid && (
              <div className="mx-3 mb-2 p-3 bg-blue-50 border-l-4 border-blue-400 rounded text-sm">
                <p className="font-medium text-blue-700">Action Required:</p>
                <p className="text-blue-600">
                  Ask the seller for their payment details (e.g., phone number,
                  account info) to complete your payment of{" "}
                  <strong>KES {tradeData.totalKES.toFixed(2)}</strong>.
                </p>
              </div>
            )}

            <CardContent className="p-0 overflow-hidden">
              <Suspense
                fallback={
                  <div className="h-96 bg-gray-100 animate-pulse rounded-md" />
                }
              >
                <TradeChat
                  partnerName={partialTrade?.seller_username || "Seller"}
                  tradeId={tradeId}
                  userId={orderDetails?.user_id?.toString() || ""}
                  chatPartnerId={
                    orderDetails?.potential_buyer_id?.toString() || ""
                  }
                  onChatEvent={() => {}}
                />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Add polling controls at the bottom of the page */}
      <div className="text-right text-xs text-gray-500">
        {renderPollingControls()}
      </div>
    </div>
  );
}
