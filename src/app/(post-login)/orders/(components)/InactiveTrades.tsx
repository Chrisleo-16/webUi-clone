"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import { baseUrl } from "@/helpers/constants/baseUrls";
import TokenService from "@/helpers/Token/token.service";
import EmptyState from "./EmptyState";
import OrdersSkeleton from "./OrdersSkeleton";

const fetchInactiveTrades = async () => {
  const token = await TokenService.getToken();
  const { data } = await AxiosInstance.get(`${baseUrl}/order/mytrades/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
};

const InactiveTrades = () => {
  const {
    data: trades,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["inactiveTrades"],
    queryFn: fetchInactiveTrades,
    refetchOnWindowFocus: false,
  });

  // Filter inactive trades - either completed successfully or canceled
  const inactiveTrades = trades
    ?.filter((trade: any) => trade.is_canceled || trade.is_success)
    // Sort trades from latest to earliest
    .sort((a: any, b: any) => {
      return (
        new Date(b.trade_joining_time).getTime() -
        new Date(a.trade_joining_time).getTime()
      );
    });

  if (isLoading) return <OrdersSkeleton />;

  if (isError || !inactiveTrades?.length)
    return <EmptyState message="No Inactive Trades Found" />;

  return (
    <div className="space-y-4">
      {inactiveTrades.map((trade: any) => (
        <Card key={trade.id} className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-3 w-full">
              {/* Status Badge */}
              <div className="flex justify-between items-center w-full">
                <h3 className="text-lg font-semibold">
                  Trade #{trade.trade_id.substring(0, 8)}
                </h3>
                {trade.is_success && (
                  <Badge className="bg-green-500">Completed Successfully</Badge>
                )}
                {trade.is_canceled && (
                  <Badge className="bg-red-500">Canceled</Badge>
                )}
              </div>

              {/* Trade Participants */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Image
                    src={trade.buyer.image}
                    alt={trade.buyer.username}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-medium">
                      Buyer: {trade.buyer.username}
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      {trade.buyer.rating} ★
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={trade.seller.image}
                    alt={trade.seller.username}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-medium">
                      Seller: {trade.seller.username}
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      {trade.seller.rating} ★
                    </div>
                  </div>
                </div>
              </div>

              {/* Trade Details */}
              <div className="space-y-2">
                <div className="text-lg font-semibold">
                  {trade.amount} {trade.currency_symbol.toUpperCase()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total: {parseFloat(trade.amount).toLocaleString()}{" "}
                  {trade.currency_symbol.toUpperCase()}
                </div>
                <div className="text-sm">
                  Started: {new Date(trade.trade_joining_time).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default InactiveTrades;
