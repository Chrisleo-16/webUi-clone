"use client";
import { SellTradeClient } from "@/components/trade/SellTradeClient";
import { useParams } from "next/navigation";

export default function SellTradePage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const tradeId = params.tradeId as string;

  return <SellTradeClient orderId={orderId} tradeId={tradeId} />;
}
