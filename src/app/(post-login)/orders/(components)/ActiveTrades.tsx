"use client"

import { Card } from "@/components/ui/card";
import Image from 'next/image';
import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import { baseUrl } from "@/helpers/constants/baseUrls";
import TokenService from "@/helpers/Token/token.service";
import OrdersSkeleton from "./OrdersSkeleton";
import EmptyState from "./EmptyState";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const fetchActiveTrades = async () => {
    const token = await TokenService.getToken();
    const { data } = await AxiosInstance.get(`${baseUrl}/order/mytrades/all`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
};

const ActiveTrades = () => {
    const [userId, setUserId] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchUserId = async () => {
            const decodedToken = await TokenService.decodeToken();
            setUserId(decodedToken?.userId);
        };
        fetchUserId();
    }, []);

    const {
        data: trades,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["activeTrades"],
        queryFn: fetchActiveTrades,
        refetchOnWindowFocus: false
    });

    // Filter active trades
    const activeTrades = trades?.filter((trade: any) => !trade.is_canceled);

    if (isLoading) return <OrdersSkeleton />;
    if (isError || !activeTrades?.length) return <EmptyState message="No Active Trades Found" />;

    return (
        <div className="space-y-4">
            {activeTrades.map((trade: any) => (
                <Card key={trade.id} className="p-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-3">
                            {/* Trade Participants */}
                            <div className="flex gap-4">
                                {/* Buyer Info */}
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={trade.buyer.image}
                                        alt={trade.buyer.username}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <h4 className="font-medium">Buyer: {trade.buyer.username}</h4>
                                        <div className="text-sm text-muted-foreground">
                                            {trade.buyer.rating} ★
                                        </div>
                                    </div>
                                </div>
                                {/* Seller Info */}
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={trade.seller.image}
                                        alt={trade.seller.username}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <h4 className="font-medium">Seller: {trade.seller.username}</h4>
                                        <div className="text-sm text-muted-foreground">
                                            {trade.seller.rating} ★
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trade Details */}
                            <div className="space-y-2">
                                <div className="text-lg font-semibold">
                                    {/* {trade.amount} {trade.coin.toUpperCase()} */}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Total: {trade.amount.toLocaleString()} {trade.currency_symbol.toUpperCase()}
                                </div>
                                <div className="text-sm">
                                    Started: {new Date(trade.trade_joining_time).toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() =>
                                userId === trade.buyer_id
                                    ? router.push(`/trade/buy/${trade.order_id}/${trade.trade_id}`)
                                    : router.push(`/trade/sell/${trade.order_id}/${trade.trade_id}`)
                            }
                        >
                            View Trade
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default ActiveTrades;
