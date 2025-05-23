"use client";

import XmobTabs from "@/components/Tabs/xmobTabs";
import { JSX, useEffect, useState } from "react";
import BackedAdminManageFee from "./backed/backed_fee_managemt";
import { FeeModel } from "@/helpers/interfaces/FeeModel";
import FeeManagementView from "./subui/FeesmanagementUi";
import XmobLoadingComponent from "@/components/loading/xmobLoading";
import SimSwapFee from "./subui/SimSwapFee";
import { ExchangeFees } from "@/helpers/interfaces/ExchangeFees";

export default function TradesManageFee() {
  const [fees, setFees] = useState<FeeModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [exchangeFees, setExchangeFees] = useState<ExchangeFees | null>(null);

  const fetchExchangeFees = async () => {
    try {
      const { data, success, error } =
        await BackedAdminManageFee.getSimpleSwapFees();
      setExchangeFees(data); // Use 'fees' instead of 'data'
    } catch (error) {
      console.error("Failed to fetch SimpleSwap fees:", error);
    }
  };
  const fetchData = async () =>  {
    try {
      const response = await BackedAdminManageFee.getAllFee();
      if (response.success && Array.isArray(response.data)) {
        setFees(response.data);
      } else {
        console.error("Invalid fees data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching fees:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();

    fetchExchangeFees();
  }, []);

  const tabsContent: { title: string; component: JSX.Element }[] = [
    {
      title: "Platform fee",
      component: loading ? (
        <XmobLoadingComponent message="Getting fees..." />
      ) : (
        <FeeManagementView fees={fees} fetchData={fetchData}/>
      ),
    },
    {
      title: "Sim swap fee",
      component: (
        <div>
          <SimSwapFee exchangeFees={exchangeFees} />
        </div>
      ),
    },
  ];

  return <XmobTabs tabs={tabsContent} />;
}
