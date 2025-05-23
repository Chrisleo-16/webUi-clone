import React, { useEffect, useState } from "react";
import { PartialTradesModel } from "@/types/trades.types";
import TokenService from "@/helpers/Token/token.service";
import FeedBackService from "@/helpers/Api/feedback/feedback.service";
import toast, { Toaster } from "react-hot-toast";

interface FeedbackFormProps {
  onSubmit: (showPop: boolean) => void;
  partialTradePram: PartialTradesModel;
}

interface Feedback {
  id: number;
  feedback_from: string;
  feedback_to: string;
  trade_id: string;
  rating: number;
  feedback_msg: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onSubmit,
  partialTradePram,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [feedbackVisible, setFeedbackVisible] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");
  const [userId, setUserId] = useState<string | undefined>();
  const [trader_id, settraderId] = useState<string | undefined>();

  useEffect(() => {
    const tokenfunc = async () => {
      const decodedToken = await TokenService.decodeToken();
      setUserId(decodedToken?.userId);
    };
    tokenfunc();
    settraderId(getTradeId());
  }, []);

  const handleRating = (rate: number) => {
    setRating(rate);
    setFeedbackVisible(true);
  };

  const handleSubmit = async () => {
    if (onSubmit) {
      onSubmit(false);
      const feedbackData: Feedback = {
        id: 0,
        feedback_from: userId || "",
        feedback_to:
          partialTradePram.seller_id === userId
            ? partialTradePram.buyer_id
            : partialTradePram.seller_id,
        trade_id: partialTradePram.trade_id,
        rating,
        feedback_msg: feedback,
      };

      const response = await FeedBackService.SendFeedBack(feedbackData);
      toast.success("Thank for the Feedback");
    }
  };

  const getTradeId = () => {
    if (partialTradePram.buyer_id === userId) {
      return partialTradePram.seller_id;
    } else if (partialTradePram.seller_id === userId) {
      console.log(partialTradePram.seller_id);
      return partialTradePram.buyer_id;
    }
  };

  return (
    <div className="fixed rounded-[5px] z-100 flex flex-col items-center justify-center h-[20rem] w-[30rem] bg-gray-200 p-4">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4 ">Rate Trader</h2>
      <div className="flex space-x-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            className={`text-4xl ${
              star <= rating ? "text-yellow-500" : "text-gray-500"
            }`}
          >
            ★
          </button>
        ))}
      </div>
      {feedbackVisible && (
        <div className="transition-transform transform duration-500 ease-out">
          <textarea
            className="w-full p-2 border focus:outline-none border-green-500 rounded-md resize-none text-black"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Please provide your feedback"
          ></textarea>
          <button
            className="mt-2 px-4 rounded-[3px] py-2 bg-[#00BF63] text-white  hover:bg-green-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;
