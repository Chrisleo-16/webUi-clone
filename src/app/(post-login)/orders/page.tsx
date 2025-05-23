import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BuyOrders from './(components)/BuyOrders';
import SellOrders from './(components)/SellOrders';
import ActiveTrades from './(components)/ActiveTrades';
import InactiveTrades from './(components)/InactiveTrades';

const OrdersPage = () => {

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6">Trades and Orders</h1>
            <Tabs defaultValue="orders" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50">
                    <TabsTrigger
                        value="orders"
                        className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-colors"
                    >
                        Orders
                    </TabsTrigger>
                    <TabsTrigger
                        value="trades"
                        className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-colors"
                    >
                        Trades
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="space-y-4">
                    <Tabs defaultValue="buyOrders" className="space-y-4">
                        <TabsList className="grid w-1/2 grid-cols-2 p-1 bg-transparent">
                            <TabsTrigger
                                value="buyOrders"
                                className="bg-transparent text-gray-500 shadow-none border-b-2 rounded-none data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-500 transition-colors"
                            >
                                Buy Orders
                            </TabsTrigger>
                            <TabsTrigger
                                value="sellOrders"
                                className="bg-transparent text-gray-500 shadow-none border-b-2 rounded-none data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-500 transition-colors"
                            >
                                Sell Orders
                            </TabsTrigger>
                        </TabsList>


                        <TabsContent value="buyOrders" className="space-y-4">
                            <BuyOrders />
                        </TabsContent>

                        <TabsContent value="sellOrders" className="space-y-4">
                            <SellOrders />
                        </TabsContent>
                    </Tabs>
                </TabsContent>

                <TabsContent value="trades" className="space-y-4">
                    <Tabs defaultValue="activeTrades" className="space-y-4">
                        <TabsList className="grid w-1/2 grid-cols-2 p-1 bg-transparent">
                            <TabsTrigger
                                value="activeTrades"
                                className="bg-transparent text-gray-500 shadow-none border-b-2 rounded-none data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-500 transition-colors"
                            >
                                Active Trades
                            </TabsTrigger>
                            <TabsTrigger
                                value="inactiveTrades"
                                className="bg-transparent text-gray-500 shadow-none border-b-2 rounded-none data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-500 transition-colors"
                            >
                                Inactive Trades
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="activeTrades" className="space-y-4">
                            <ActiveTrades />
                        </TabsContent>

                        <TabsContent value="inactiveTrades" className="space-y-4">
                            <InactiveTrades />
                        </TabsContent>
                    </Tabs>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default OrdersPage;
