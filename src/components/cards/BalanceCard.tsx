import { useQuery } from "@tanstack/react-query";
import { Timeline, Upgrade, Wallet, Refresh } from "@mui/icons-material";
import { IconButton, CircularProgress } from "@mui/material";
import xmobcolors from "@/app/styles/xmobcolors";
import MobitCard from "./xmobcard";
import Xmoblayout from "../layouts/xmoblayout";
import XmobText from "../text/xmobText";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import { baseUrl } from "@/helpers/constants/baseUrls";
import TokenService from "@/helpers/Token/token.service";
import BitCoinService from "@/helpers/Api/bitcoin/bitcoin.service";
import MoneroService from "@/helpers/Api/monero/xmr.service";


const BalanceCard = ({ currency }: { currency: string }) => {
    // BitCoinService.getBTCbalance - LiveBalance
    // BitCoinService.getBTCSpotBalance - Spot Balance
    // MoneroService.get_my_balance - Spot Balance
    // MoneroService.get_live_bal - Live Balance
    const {
        data: balance,
        isLoading,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["balance", currency],
        queryFn: BitCoinService.getSpotWalletBalance,
        staleTime: 1000 * 60 * 5,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        enabled: true,
    });

    return (
        <MobitCard background={xmobcolors.secondary} width="50%" height="12rem">
            <Xmoblayout layoutType="flex-row" isFlexEndToEnd={true} >
                <Wallet />
                <XmobText variant="h6" fontWeight="bold">
                    Balance
                </XmobText>
                <Timeline />
            </Xmoblayout>
            <div className="flex items-center gap-3 my-3 ">
                {isLoading ? (
                    <div className="h-8 bg-gray-100 animate-pulse rounded-5"></div>
                ) : (
                    <XmobText variant="h4" fontWeight="bold">
                        ${balance ?? "Balance unavailable"}
                    </XmobText>
                )}
                <IconButton onClick={() => refetch()} disabled={isFetching}>
                    {isFetching ? <CircularProgress size={20} color="success" /> : <Refresh color="success" />}
                </IconButton>
            </div>
            {/* Refresh button */}
            <Xmoblayout className="p-0" layoutType="flex-row" gap="0">
                <Upgrade color="success" />
                <XmobText variant="h6" fontWeight="bold" color={xmobcolors.primary}>
                    +35,74%
                </XmobText>
            </Xmoblayout>
        </MobitCard>
    );
};

export default BalanceCard;
