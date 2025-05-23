"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import { baseUrl } from "@/helpers/constants/baseUrls";
import TokenService from "@/helpers/Token/token.service";
import Link from "next/link";
import OrdersSkeleton from "./OrdersSkeleton";
import EmptyState from "./EmptyState";

// Fetch function for sell orders
const fetchSellOrders = async () => {
    const token = await TokenService.getToken();
    const { data } = await AxiosInstance.get(`${baseUrl}/order/sell-orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
};

const SellOrders = () => {
    const {
        data: orders,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["sellOrders"],
        queryFn: fetchSellOrders,
        refetchOnWindowFocus: false
    });
   
    if (isLoading) return <OrdersSkeleton />

    if (isError || !orders?.length) return <EmptyState message="No Orders Found"/>

    return (
        <div className="space-y-4">
            {orders.map((order: any) => (
                <Card key={order.id} className="p-6">
                    <div className="flex justify-between items-start">
                        {/* User Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Image
                                    src={order.seller.image}
                                    alt={order.seller.username}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <div>
                                    <h4 className="font-medium">{order.seller.username}</h4>
                                    <div className="text-sm text-muted-foreground">
                                        {order.seller.completedTrades} trades • {order.seller.rating} ★
                                    </div>
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="space-y-2">
                                <div className="text-lg font-semibold">
                                    Selling {order.amount} {order.coin.toUpperCase()}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Rate: {order.rate.toLocaleString()} {order.currency.toUpperCase()}
                                </div>
                                <div className="text-sm">
                                    {order.minTrade.toLocaleString()} - {order.maxTrade.toLocaleString()} {order.currency.toUpperCase()}
                                </div>
                            </div>
                        </div>
                        <Link href={`/orders/${order.id}?type=sell`}>
                            <Button variant="outline">View Details</Button>
                        </Link>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default SellOrders;
