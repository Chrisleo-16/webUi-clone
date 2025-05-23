"use client";
import { BuyTradeClient } from "@/components/trade/BuyTradeClient";
import { useParams } from "next/navigation";

export default function BuyTradePage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const tradeId = params.tradeId as string;

  return <BuyTradeClient orderId={orderId} tradeId={tradeId} />;
}
