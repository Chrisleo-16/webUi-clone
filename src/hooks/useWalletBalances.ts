import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import BitCoinService from "@/helpers/Api/bitcoin/bitcoin.service";
import MoneroService from "@/helpers/Api/monero/xmr.service";
import BackedWalletAccount, {
  WalletAccountModel,
} from "@/app/(post-login)/wallets-and-accounts/backed/backed_wallet_account";

const xmoneroService = new MoneroService();

const QUERY_KEYS = {
  ACCOUNT_INFO: "accountInfo",
  BTC_SPOT: "btcSpotBalance",
  BTC_FUNDING: "btcFundingBalance",
  XMR_FUNDING: "xmrFundingBalance",
  XMR_SPOT: "xmrSpotBalance",
};

// Create response type definitions based on the shape of your data
type BTCSpotResponse = {
  currentamount?: number | string;
};

type BTCFundingResponse = {
  balance?: number | string;
};

type XMRResponse = {
  data?: {
    live_balance?: number | string;
    unlocked_balance?: number | string;
    balance?: number | string;
  };
};

// Define individual query functions
const fetchAccountInfo = async (): Promise<WalletAccountModel> => {
  return await BackedWalletAccount.getAllMyAccountInfoWithWalletAddresses();
};

const fetchBTCSpotBalance = async (): Promise<number> => {
  const result = (await BitCoinService.getBTCSpotBalance()) as BTCSpotResponse;
  return Number(result?.currentamount || 0);
};

const fetchBTCFundingBalance = async (): Promise<number> => {
  const result = (await BitCoinService.getBTCbalance()) as BTCFundingResponse;
  return Number(result?.balance || 0);
};

const fetchXMRFundingBalance = async (): Promise<number> => {
  const result = (await xmoneroService.getMymoneroWallet()) as XMRResponse;
  return Number(result?.data?.unlocked_balance || 0);
};

const fetchXMRSpotBalance = async (): Promise<number> => {
  const result = (await xmoneroService.get_my_balance()) as any;
  return Number(result?.balance || 0);
};

type WalletBalancesHookProps = {
  currency: "BTC" | "XMR";
  selectedSource: string;
};

type WalletBalancesResult = {
  walletAccountModel: WalletAccountModel | null;
  spotWalletBTCBalance: number;
  fundingWalletBTCBalance: number;
  fundingWalletXMRBalance: number;
  spotWalletXMRBalance: number;
  activeBalance: number;
  isTransactionReady: boolean;
  errorMessage: string | null;
  isLoading: boolean;
  refreshBalances: () => void;
};

// Custom hook to fetch and manage wallet balances
export function useWalletBalances({
  currency,
  selectedSource,
}: WalletBalancesHookProps): WalletBalancesResult {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Account info query
  const accountQuery = useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT_INFO],
    queryFn: fetchAccountInfo,
    staleTime: 30000,
  });

  // Balance queries
  const btcSpotQuery = useQuery({
    queryKey: [QUERY_KEYS.BTC_SPOT],
    queryFn: fetchBTCSpotBalance,
    staleTime: 30000,
  });

  const btcFundingQuery = useQuery({
    queryKey: [QUERY_KEYS.BTC_FUNDING],
    queryFn: fetchBTCFundingBalance,
    staleTime: 30000,
  });

  const xmrFundingQuery = useQuery({
    queryKey: [QUERY_KEYS.XMR_FUNDING],
    queryFn: fetchXMRFundingBalance,
    staleTime: 30000,
  });

  const xmrSpotQuery = useQuery({
    queryKey: [QUERY_KEYS.XMR_SPOT],
    queryFn: fetchXMRSpotBalance,
    staleTime: 30000,
  });

  // Function to refresh all balances
  const refreshBalances = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BTC_SPOT] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BTC_FUNDING] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.XMR_FUNDING] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.XMR_SPOT] });
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  };

  // Calculate active balance based on currency and source
  const activeBalance =
    currency === "BTC"
      ? selectedSource === "fundingWallet"
        ? btcFundingQuery.data ?? 0
        : btcSpotQuery.data ?? 0
      : selectedSource === "fundingWallet"
      ? xmrFundingQuery.data ?? 0
      : xmrSpotQuery.data ?? 0;

  // Check if any query is in loading state
  const isLoading =
    accountQuery.isLoading ||
    btcSpotQuery.isLoading ||
    btcFundingQuery.isLoading ||
    xmrFundingQuery.isLoading ||
    xmrSpotQuery.isLoading;

  // Check if any query is in error state
  useEffect(() => {
    const queries = [
      accountQuery,
      btcSpotQuery,
      btcFundingQuery,
      xmrFundingQuery,
      xmrSpotQuery,
    ];
    const erroredQuery = queries.find((query) => query.isError);

    if (erroredQuery) {
      console.error("Error fetching wallet data:", erroredQuery.error);
      setErrorMessage("Failed to fetch wallet balances");
    } else {
      setErrorMessage(null);
    }
  }, [
    accountQuery.isError,
    btcSpotQuery.isError,
    btcFundingQuery.isError,
    xmrFundingQuery.isError,
    xmrSpotQuery.isError,
  ]);

  const isTransactionReady =
    accountQuery.isSuccess &&
    btcSpotQuery.isSuccess &&
    btcFundingQuery.isSuccess &&
    xmrFundingQuery.isSuccess &&
    xmrSpotQuery.isSuccess;

  return {
    walletAccountModel: accountQuery.data ?? null,
    spotWalletBTCBalance: btcSpotQuery.data ?? 0,
    fundingWalletBTCBalance: btcFundingQuery.data ?? 0,
    fundingWalletXMRBalance: xmrFundingQuery.data ?? 0,
    spotWalletXMRBalance: xmrSpotQuery.data ?? 0,
    activeBalance,
    isTransactionReady,
    errorMessage,
    isLoading,
    refreshBalances,
  };
}
