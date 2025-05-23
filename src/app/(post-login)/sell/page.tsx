"use client";
import React from "react";
import XmobTabs from "@/components/Tabs/xmobTabs";
import { BTCSell } from "../../../components/sell/BTCSell";
import { XMRSell } from "../../../components/sell/XMRSell";
import xmobColors from "@/app/styles/xmobcolors";

const SellPage = () => {
  const BTCSellTab = () => (
    <div className="p-4">
      <BTCSell />
    </div>
  );

  const XMRSellTab = () => (
    <div className="p-4">
      <XMRSell />
    </div>
  );

  const tabData = [
    { title: "Sell BTC", component: <BTCSellTab /> },
    { title: "Sell XMR", component: <XMRSellTab /> },
  ];

  return (
    <div className="pt-4" style={{ backgroundColor: xmobColors.grayLight }}>
      <XmobTabs tabs={tabData} />
    </div>
  );
};

export default SellPage;
