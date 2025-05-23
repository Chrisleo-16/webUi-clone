"use client";
import { useQuery } from "@tanstack/react-query";
import BitCoinService from "@/helpers/Api/bitcoin/bitcoin.service";
import MoneroService from "@/helpers/Api/monero/xmr.service";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Card } from "../ui/card";
import XmobText from "../text/xmobText";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const BalCard: React.FC = () => {
    const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(false);
    const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "KES">("USD");

    // Fetch exchange rates
    const { rate: usdToKesRate, loading: rateLoading, error: rateError } = useExchangeRate("USD", "KES");
    const { rate: xmrToUsdRate } = useExchangeRate("XMR", "USD");
    const { rate: btcToUsdRate } = useExchangeRate("BTC", "USD");

    // Query for BTC balances
    const btcBalanceQuery = useQuery({
        queryKey: ["btcBalances"],
        queryFn: async () => {
            const fundingBalance = await BitCoinService.getBTCbalance();
            const spotBalance = await BitCoinService.getBTCSpotBalance();

            return {
                funding: Number(fundingBalance.balance || 0),
                spot: Number(spotBalance.currentamount || 0),
                total: Number(fundingBalance.balance || 0) + Number(spotBalance.currentamount || 0)
            };
        },
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false
    });

    // Query for XMR balances
    const xmrBalanceQuery = useQuery({
        queryKey: ["xmrBalances"],
        queryFn: async () => {
            const fundingWallet = await MoneroService.getMymoneroWallet();
            const spotWallet = await MoneroService.get_my_balance();

            const fundingBalance = Number(fundingWallet.data?.live_balance || 0);
            const spotBalance = Number(spotWallet?.balance || 0);
            return {
                funding: fundingBalance,
                spot: spotBalance,
                total: fundingBalance + spotBalance
            };
        },
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false
    });

    const toggleBalanceVisibility = () => setIsBalanceVisible((prev) => !prev);
    const handleCurrencyChange = (value: string) => {
        setSelectedCurrency(value as "USD" | "KES");
    };

    const formatWithCommas = (value: number) => value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Calculate total balance
    const calculateTotalBalance = () => {
        if (btcBalanceQuery.data && xmrBalanceQuery.data && btcToUsdRate && xmrToUsdRate) {
            const btcInUsd = btcBalanceQuery.data.total * btcToUsdRate;
            const xmrInUsd = xmrBalanceQuery.data.total * xmrToUsdRate;
            const totalUsd = btcInUsd + xmrInUsd;

            if (selectedCurrency === "USD") return `$ ${formatWithCommas(totalUsd)}`;
            if (selectedCurrency === "KES" && usdToKesRate) return `KES ${formatWithCommas(totalUsd * usdToKesRate)}`;
        }
        return "0";
    };

    const isLoading = rateLoading || btcBalanceQuery.isLoading || xmrBalanceQuery.isLoading;
    const hasError = rateError || btcBalanceQuery.isError || xmrBalanceQuery.isError;

    return (
        <Card className="flex flex-col justify-center items-center py-0 px-6 text-black w-full sm:w-1/2 min-h-[10rem] bg-[#FFD300] m-0">
            <div className="w-full">
                <div className="mb-4">
                    <p className="font-bold text-2xl">
                        Balance
                    </p>
                </div>
                <div className="w-full h-[36px] flex justify-between items-center">
                    {isLoading ? (
                        <p className="h-6 bg-gray-300 animate-pulse rounded w-[8rem]"></p>
                    ) : hasError ? (
                        <p className="text-2xl text-red-500 font-bold ">Error !</p>
                    ) : (
                        <div className="flex items-center gap-4 text-black font-bold h-full">
                            <p className={isBalanceVisible ? "blur-sm " : "" + "h-fit"}>{calculateTotalBalance()}</p>
                            <div className="flex items-center space-x-2">
                                <span
                                    onClick={toggleBalanceVisibility}
                                    className="cursor-pointer"
                                >
                                    {isBalanceVisible ? <FaEye color="black" /> : <FaEyeSlash color="black" />}
                                </span>

                            </div>
                            <Select
                                value={selectedCurrency}
                                onValueChange={handleCurrencyChange}
                                defaultValue="USD"

                            >
                                <SelectTrigger className="w-20 h-8 bg-white text-black border-none focus:ring-2 focus:ring-yellow-400">
                                    <SelectValue placeholder="USD" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="KES">KES</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default BalCard;