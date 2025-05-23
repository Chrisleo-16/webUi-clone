"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExchangeFees } from "@/helpers/interfaces/ExchangeFees";
import { TabsContent } from "@radix-ui/react-tabs";
import { useState } from "react";
interface SimSwapFeeProps {
    exchangeFees: ExchangeFees | null;
}

export default function SimSwapFee({ exchangeFees }: SimSwapFeeProps) {

    const formatAmount = (value: string | null | undefined, currency: string) => {
        if (!value) return "No limit";
        return `${Number(value).toFixed(8)} ${currency}`;
      };
      const formatFee = (fee: string | "Variable" | undefined) => {
        if (!fee || fee === "Variable") return "Variable rate";
        return `${fee}%`;
      };
    return <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* BTC to XMR Card */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">BTC → XMR</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Bitcoin to Monero Exchange Rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Minimum Amount
                  </p>
                  <p className="text-xl font-bold tracking-tight">
                    {formatAmount(exchangeFees?.btcToXmr.min, "BTC")}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Maximum Amount
                  </p>
                  <p className="text-xl font-bold tracking-tight">
                    {formatAmount(exchangeFees?.btcToXmr.max, "BTC")}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Exchange Fee
                </p>
                <div className="mt-2 flex items-baseline space-x-2">
                  <p className="text-xl font-bold tracking-tight">
                    {formatFee(exchangeFees?.btcToXmr.fee)}
                  </p>
                  <span className="text-sm text-gray-500">
                    (Set by SimpleSwap)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* XMR to BTC Card */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">XMR → BTC</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Monero to Bitcoin Exchange Rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Minimum Amount
                  </p>
                  <p className="text-xl font-bold tracking-tight">
                    {formatAmount(exchangeFees?.xmrToBtc.min, "XMR")}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Maximum Amount
                  </p>
                  <p className="text-xl font-bold tracking-tight">
                    {formatAmount(exchangeFees?.xmrToBtc.max, "XMR")}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Exchange Fee
                </p>
                <div className="mt-2 flex items-baseline space-x-2">
                  <p className="text-xl font-bold tracking-tight">
                    {formatFee(exchangeFees?.xmrToBtc.fee)}
                  </p>
                  <span className="text-sm text-gray-500">
                    (Set by SimpleSwap)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


    </div>;
}





