import React, { useEffect, useState } from "react";
import { PartialTradesModel } from "@/types/trades.types";
import FeedbackForm from "./FeedbackForm";
import FeedBackService from "@/helpers/Api/feedback/feedback.service";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/lib/GlobalState";

interface Props {
  trade: PartialTradesModel | null;
}

const TimeButton: React.FC<{ value: string }> = ({ value }) => {
  return (
    <button className="bg-red-500 px-3 py-1 border rounded-xl">{value}</button>
  );
};

const CountDown: React.FC<Props> = ({ trade }) => {
  const data = useGlobalStore((state) => state.data);
  const [timeRemaining, setTimeRemaining] = useState<number>(
    trade?.remaining_time || 0 // Remaining time in minutes
  );
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
  const [minuteRem, setMinuteRem] = useState<string>("00");
  const [secondRem, setSecondRem] = useState<string>("00");
  const [isPaid, setIsPaid] = useState<boolean>(trade?.is_buyer_paid || false);
  const [isFeedback, setIsFeedback] = useState<boolean>(false);
  const [showBtn, setShowBtn] = useState<boolean>(false);
  const [showTradeClosedPopup, setShowTradeClosedPopup] =
    useState<boolean>(false);
  const [showTradeCompletedPopup, setShowTradeCompletedPopup] =
    useState<boolean>(false);
  const [closingMessage, setClosingMessage] = useState<String>("");
  const router = useRouter();

  useEffect(() => {
    async function getFeedBack() {
      const response = await FeedBackService.GetFeedbackTradeId(
        trade?.trade_id || ""
      );
      const feedback = response.data;
      if (feedback) {
        setShowBtn(false);
      } else {
        setShowBtn(true);
      }
    }
    getFeedBack();
  }, [trade]);

  useEffect(() => {
    if (trade?.is_flagged && trade.has_seller_received) {
      setShowTradeCompletedPopup(true);
      setClosingMessage(
        "Trade completed,The trade was flagged but was resolved and closed successfully"
      );
    } else if (trade?.has_seller_received) {
      setClosingMessage("TradeClosed The seller has received the payment");
      setShowTradeCompletedPopup(true);
    } else if (trade?.remaining_time && trade?.remaining_time <= 0) {
      setClosingMessage("TradeClosed The time has expired");
      setShowTradeClosedPopup(true);
    }
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (trade) {
      intervalId = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(intervalId);
            setShowTradeClosedPopup(true);
            setClosingMessage(
              trade?.is_flagged ? "" : "Trade closed time has expired"
            );
            return 0;
          }
          return prevTime - 1 / 60; // Decrement by 1 second
        });
      }, 1000); // Update every second
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [trade]);

  useEffect(() => {
    const formatTime = (minutes: number): void => {
      const mins = Math.floor(minutes);
      const secs = Math.floor((minutes - mins) * 60);

      setMinuteRem(mins.toString().padStart(2, "0"));
      setSecondRem(secs.toString().padStart(2, "0"));
    };

    formatTime(timeRemaining);
  }, [timeRemaining]);

  const handleTradeClosedPopupClose = () => {
    router.push("/orders");
    setShowTradeClosedPopup(false);
  };

  const handleTradeCompletedPopupClose = () => {
    setShowTradeCompletedPopup(false);
    router.push("/orders");
  };

  if (!trade) {
    return null;
  }

  const showFeedbackForm = () => {
    setIsFeedback(true);
    setIsPaid(false);
    setIsTimeUp(false);
  };

  const handleFeedbackSubmit = (showPop: boolean) => {
    setIsPaid(!showPop);
    setIsFeedback(showPop);
    setShowBtn(false);
  };

  return (
    <div>
      {isFeedback && trade && (
        <div className="fixed inset-0 flex items-center justify-center z-80 bg-black bg-opacity-50">
          <FeedbackForm
            onSubmit={handleFeedbackSubmit}
            partialTradePram={trade}
          />
        </div>
      )}

      <div className="flex">
        <TimeButton value={minuteRem} />:
        <TimeButton value={secondRem} />
      </div>
      {closingMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-50">
          <div className="bg-gray-100 p-5 rounded shadow-lg">
            <h2 className="text-xl mb-4">{closingMessage}</h2>
            <div>
              <button
                className="bg-red-500 text-black px-4 py-2 rounded"
                onClick={handleTradeClosedPopupClose}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {data.code && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-50">
          <div className="bg-gray-100 p-5 rounded shadow-lg">
            <h2 className="text-xl mb-4">{data.description}</h2>
            <div>
              <button
                className="bg-red-500 text-black px-4 py-2 rounded"
                onClick={handleTradeCompletedPopupClose}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountDown;
