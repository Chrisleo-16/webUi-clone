"use client";

import { useEffect, useState } from "react";
import AnalyticUserDashBoard from "@/components/ui/Analytics/AnalyticUserDashBoard";
import ProfileComponent from "@/components/ui/profle/profileComponent";
import XmobTabs from "@/components/Tabs/xmobTabs";
import WalletComponent from "@/components/wallets/walletComponent";
import BackedWalletAccount, {
  WalletAccountModel,
} from "./backed/backed_wallet_account";
import BackedFeedBack from "./backed/backed_analytic_feedback";
import { FeedbackMessage } from "@/helpers/interfaces/FeedbackMessageModel";
import Transactions from "./(components)/Transactions";
import ProfileSkeleton from "./(components)/ProfileSkeleton";

const WalletsAndAccounts: React.FC = () => {
  const [walletAccountModel, setWalletAccountModel] =
    useState<WalletAccountModel | null>(null);
  const [feedbackData, setFeedback] = useState<FeedbackMessage | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountData =
          await BackedWalletAccount.getAllMyAccountInfoWithWalletAddresses();
        setWalletAccountModel(accountData);

        const feedbackResponse = await BackedFeedBack.getFeedback();
        setFeedback(feedbackResponse);
      } catch (error) {
        console.error("Error fetching account and wallet info:", error);
      }
    };

    fetchData();
  }, []);

  const WalletTab = () => <WalletComponent />;
  const TransactionTab = () => <Transactions />;

  const AnalyticsTab = () =>
    feedbackData ? (
      <AnalyticUserDashBoard feedback={feedbackData} />
    ) : (
      <ProfileSkeleton />
    );

  const ProfileTab = () =>
    walletAccountModel ? (
      <ProfileComponent walletAccountDetails={walletAccountModel} />
    ) : (
      <ProfileSkeleton />
    );

  const tabData = [
    { title: "Wallets", component: <WalletTab /> },
    { title: "Transactions", component: <TransactionTab /> },
    { title: "Analytics", component: <AnalyticsTab /> },
    { title: "Profile", component: <ProfileTab /> },
  ];

  return (
    <div>
      <XmobTabs tabs={tabData} />
    </div>
  );
};

export default WalletsAndAccounts;
