"use client";
import React from "react";
import XmobTabs from "@/components/Tabs/xmobTabs";
import { CryptoExchange } from "./components/CryptoExchange";
import { AddressExchange } from "./components/AddressExchange";
import { ExchangeHistory } from "./components/ExchangeHistory";
import xmobColors from "@/app/styles/xmobcolors";

const ExchangePage = () => {
  const CryptoExchangeTab = () => (
    <div className="p-4">
      <CryptoExchange />
    </div>
  );

  const AddressExchangeTab = () => (
    <div className="p-4">
      <AddressExchange />
    </div>
  );

  const ExchangeHistoryTab = () => (
    <div className="p-4">
      <ExchangeHistory />
    </div>
  );

  const tabData = [
    { title: "Crypto Exchange", component: <CryptoExchangeTab /> },
    { title: "Address Exchange", component: <AddressExchangeTab /> },
    { title: "Exchange History", component: <ExchangeHistoryTab /> },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ backgroundColor: xmobColors.grayLight }}
    >
      <div className="w-full max-w-4xl px-4">
        <XmobTabs tabs={tabData} />
      </div>
    </div>
  );
};

export default ExchangePage;
