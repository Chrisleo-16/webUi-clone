"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BTCSell } from "@/components/sell/BTCSell";
import { XMRSell } from "../sell/XMRSell";

export function CreateSellOrder() {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sell Crypto</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="btc" className="space-y-4">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="btc">Sell BTC</TabsTrigger>
            <TabsTrigger value="xmr">Sell XMR</TabsTrigger>
          </TabsList>

          <TabsContent value="btc">
            <BTCSell />
          </TabsContent>

          <TabsContent value="xmr">
            <XMRSell />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
