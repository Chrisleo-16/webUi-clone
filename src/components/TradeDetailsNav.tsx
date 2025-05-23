import { CandlestickChart, ClockIcon, UserIcon } from "lucide-react";

import CountDown from "@/components/CountDownTimer";
import HelperUtil from "@/helpers/Api/Helpers/All.helper.utils";

import { PartialTradesModel, responseType } from "@/types/trades.types";

interface Props {
  trade: PartialTradesModel | null;
  otherDetails: responseType | null;
  tradeType: string;
}

const TradeDetailsNav: React.FC<Props> = ({
  trade,
  otherDetails,
  tradeType,
}) => {
  return (
    <nav className="bg-gray-200 shadow-lg p-4 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center space-x-4">
          <ClockIcon className="h-6 w-6 text-blue-500" />
          <div>
            <p className="text-gray-600">Time Left</p>
            {trade && <CountDown trade={trade} />}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <CandlestickChart className="h-6 w-6 text-red-500" />
          <div>
            <p className="text-gray-600">Trade ID</p>
            <p className="text-xl font-semibold">{trade?.trade_id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ClockIcon className="h-6 w-6 text-yellow-500" />
          <div>
            <p className="text-gray-600">Trade Created</p>
            <p className="text-xl font-semibold">
              {HelperUtil.formatDateTime(trade?.trade_joining_time || "")}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <UserIcon className="h-6 w-6 text-red-500" />
          <div>
            <p className="text-gray-600">Trading With</p>
            <p className="text-xl font-semibold">{otherDetails?.sellerName}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 text-center font-bold">{`${tradeType} ${
        otherDetails?.currencySymbol
      }  ${tradeType == "Buy" ? "From" : "to"} ${
        otherDetails?.sellerName
      } `}</div>
      <div className="italic text-sm text-center">
        (
        {tradeType === "Buy"
          ? "Buy within the specified time"
          : "Receive payment within the specified time"}
        )
      </div>
    </nav>
  );
};

export default TradeDetailsNav;
