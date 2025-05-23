"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import Xmoblayout from "@/components/layouts/xmoblayout";
import MobitCard from "@/components/cards/xmobcard";
import XmobButton from "@/components/button/xmobitButton";
import xmobcolors from "@/app/styles/xmobcolors";
import { GraphicEqSharp, Timeline, Upgrade, Wallet } from "@mui/icons-material";
import XmobText from "@/components/text/xmobText";
import XmobitSpacer from "@/components/layouts/xmobitSpacer";
import XmobDropdown from "@/components/dropdown/xmobDropdown";
import XmobDivider from "@/components/divider/xmobDivider";
import BalanceCard from "@/components/cards/BalanceCard";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCryptoPrice } from "@/hooks/useCryptoPrice"; // Import useCryptoPrice hook
import BalCard from "@/components/cards/Balance";

const ChartComponent = dynamic(
  () => import("@/components/graphs/xmobCandlestickChart"),
  {
    ssr: false,
  }
);

const currenciesList = [
  { label: "bitcoin(BTC)", value: "bitcoin" },
  { label: "monero(XMR)", value: "monero" },
];
const DashboardPage: React.FC = () => {
  const [selectedInterval, setSelectedInterval] = useState<"1" | "7" | "30">(
    "7"
  );
  const [isbitcoin, setIsbitcoin] = useState(true);
  const [selecttedCurency, setSelecttedCurency] = useState("bitcoin");

  const { price: cryptoPrice, loading: priceLoading } =
    useCryptoPrice(selecttedCurency);

  const [candlestickData, setCandlestickData] = useState({
    series: [
      {
        data: [] as { x: number; y: [number, number, number, number] }[],
      },
    ],
    options: {
      chart: {
        type: "candlestick",
        height: 350,
      },
      title: {
        text: isbitcoin
          ? "Bitcoin Price - Candlestick"
          : "Monero Price - Candlestick",
        align: "left",
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
    } as ApexOptions,
  });

  const [lineData, setLineData] = useState({
    series: [
      {
        name: "Close Price",
        data: [] as { x: number; y: number }[],
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 350,
      },
      title: {
        text: isbitcoin
          ? "Bitcoin Price - Line Chart"
          : "Monero Price - Line Chart",
        align: "left",
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
    } as ApexOptions,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          isbitcoin
            ? `https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=${selectedInterval}`
            : `https://api.coingecko.com/api/v3/coins/monero/ohlc?vs_currency=usd&days=${selectedInterval}`
        );
        const data = await response.json();

        const candlestickTransformedData = data.map((item: number[]) => ({
          x: item[0],
          y: [item[1], item[2], item[3], item[4]], // [open, high, low, close]
        }));

        const lineTransformedData = data.map((item: number[]) => ({
          x: item[0],
          y: item[4],
        }));

        setCandlestickData((prevState) => ({
          ...prevState,
          series: [
            {
              data: candlestickTransformedData,
            },
          ],
          options: {
            ...prevState.options,
            title: {
              ...prevState.options.title,
              text: isbitcoin
                ? "Bitcoin Price - Candlestick"
                : "Monero Price - Candlestick",
            },
          },
        }));

        setLineData((prevState) => ({
          ...prevState,
          series: [
            {
              name: "Close Price",
              data: lineTransformedData,
            },
          ],
          options: {
            ...prevState.options,
            title: {
              ...prevState.options.title,
              text: isbitcoin
                ? "Bitcoin Price - Line Chart"
                : "Monero Price - Line Chart",
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedInterval, isbitcoin]);

  const router = useRouter();
  const changeInCurrency = (value: string) => {
    if (selecttedCurency == "bitcoin") {
      setIsbitcoin(false);
    } else {
      setIsbitcoin(true);
    }
    setSelecttedCurency(value);
  };
  const [activeAction, setActiveAction] = useState<"buy" | "sell">("buy");
  return (
    <div className="space-y-12">
      <Xmoblayout layoutType="flex-row" isResponsive={true}>
        {/* first card */}
        <BalCard />

        {/* second card */}
        <Card className="w-full sm:w-1/2 p-6">
          <div className="flex h-1/2">
            <p
              className="flex  items-center w-1/2 border-r "
              style={{
                fontWeight: "bold",
                color:
                  activeAction === "buy" ? xmobcolors.primary : xmobcolors.dark,
                cursor: "pointer",
              }}
              onClick={() => setActiveAction("buy")}
            >
              Buy
            </p>
            <p
              className="flex  items-center justify-end w-1/2"
              style={{
                fontWeight: "bold",
                color:
                  activeAction === "sell"
                    ? xmobcolors.primary
                    : xmobcolors.dark,
                cursor: "pointer",
              }}
              onClick={() => setActiveAction("sell")}
            >
              Sell
            </p>
          </div>
          <div className="flex items-end h-1/2">
            <Button className="bg-[#00BF63] hover:bg-[#00BF63] hover:opacity-90  w-full mx-auto">
              {activeAction === "buy"
                ? `Buy ${isbitcoin ? "BTC" : "XMR"}`
                : `Sell ${isbitcoin ? "BTC" : "XMR"}`}
            </Button>
          </div>
        </Card>
      </Xmoblayout>

      {/* Interval Selection */}
      <Card>
        <Xmoblayout
          layoutType="flex-row"
          isFlexEndToEnd={true}
          isResponsive={true}
        >
          <MobitCard width="20rem">
            <XmobDropdown
              label="select currency"
              options={currenciesList}
              selectedValue={selecttedCurency}
              onChange={changeInCurrency}
            />
          </MobitCard>
          {!priceLoading && cryptoPrice > 0 && (
            <Badge variant="price" className="text-sm px-3 py-1 font-bold">
              $
              {cryptoPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              USD
            </Badge>
          )}
          <div className="flex space-x-4">
            <XmobButton
              onClick={() => setSelectedInterval("1")}
              isButtonSmall={true}
              color={
                selectedInterval === "1"
                  ? `${xmobcolors.light}`
                  : `${xmobcolors.dark}`
              }
              className={`px-4 py-2 rounded ${selectedInterval === "1"
                  ? `bg-[${xmobcolors.primary}] text-white`
                  : "text-black bg-gray-200"
                }`}
            >
              1 Day
            </XmobButton>
            <XmobButton
              isButtonSmall={true}
              onClick={() => setSelectedInterval("7")}
              color={
                selectedInterval === "7"
                  ? `${xmobcolors.light}`
                  : `${xmobcolors.dark}`
              }
              className={`px-4 py-2 rounded ${selectedInterval === "7"
                  ? `bg-[${xmobcolors.primary}] text-white`
                  : "text-black bg-gray-200"
                }`}
            >
              7 Days
            </XmobButton>
            <XmobButton
              isButtonSmall={true}
              onClick={() => setSelectedInterval("30")}
              color={
                selectedInterval === "30"
                  ? `${xmobcolors.light}`
                  : `${xmobcolors.dark}`
              }
              className={`px-4 py-2 rounded ${selectedInterval === "30"
                  ? `bg-[${xmobcolors.primary}] text-white`
                  : "text-black bg-gray-200"
                }`}
            >
              30 Days
            </XmobButton>
          </div>
        </Xmoblayout>

        <Xmoblayout className="grid-2">
          <MobitCard>
            <div>
              <ChartComponent
                options={candlestickData.options}
                series={candlestickData.series}
                type="candlestick"
              />
            </div>
          </MobitCard>

          <MobitCard>
            <div>
              <ChartComponent
                options={lineData.options}
                series={lineData.series}
                type="line"
              />
            </div>
          </MobitCard>
        </Xmoblayout>
      </Card>
    </div>
  );
};

export default DashboardPage;
