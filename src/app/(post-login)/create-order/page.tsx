"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateBuyOrder } from "@/components/orders/CreateBuyOrder";
import { CreateSellOrder } from "@/components/orders/CreateSellOrder";

export default function CreateOrderPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Create Order</h1>

      <Tabs defaultValue="buy" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="buy">Create Buy Order</TabsTrigger>
            <TabsTrigger value="sell">Create Sell Order</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="buy" className="space-y-4">
          <CreateBuyOrder />
        </TabsContent>

        <TabsContent value="sell" className="space-y-4">
          <CreateSellOrder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
