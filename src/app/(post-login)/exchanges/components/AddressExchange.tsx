import React, { useState } from "react";
import xmobColors from "@/app/styles/xmobcolors";
import ExchangeService from "@/helpers/Api/exchange/exchange.service";
import BitCoinService from "@/helpers/Api/bitcoin/bitcoin.service";
import SuccessAlert from "@/components/ui/SuccessAlert";
import ErrorAlert from "@/components/ui/ErrorAlert";

export const AddressExchange = () => {
  const [currency, setCurrency] = useState("BTC");
  const [fromAddressType, setFromAddressType] = useState("spot");
  const [toAddressType, setToAddressType] = useState("funding");
  const [amount, setAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExchange = async () => {
    setLoading(true);
    try {
      if (!amount) {
        setErrorMessage("Please enter an amount");
        return;
      }

      if (currency === "XMR") {
        try {
          const resp = await ExchangeService.xmrInternalTransfer(
            String(amount),
            toAddressType === "funding" ? "XSTF" : "XFTS"
          );

          if (resp.statusCode !== 200 && resp.statusCode) {
            setErrorMessage("Error: Insufficient funds in your wallet");
            return;
          }

          setSuccessMessage(
            `Transfer successful! from ${fromAddressType} to ${toAddressType}`
          );
          setAmount("");
        } catch (e: any) {
          console.log(e);
          setErrorMessage(
            e.response?.data?.error ||
              e.response?.data?.message ||
              "Failed to transfer XMR"
          );
        }
      } else if (currency === "BTC") {
        try {
          if (toAddressType === "funding") {
            await BitCoinService.fundMyFundingWallet(Number(amount));
            setSuccessMessage(
              `Successfully transferred ${amount} BTC to funding wallet`
            );
          } else {
            await BitCoinService.fundMySpotWallet(Number(amount));
            setSuccessMessage(
              `Successfully transferred ${amount} BTC to spot wallet`
            );
          }
          setAmount("");
        } catch (e: any) {
          console.error("BTC transfer error:", e);
          setErrorMessage(e.response?.data?.error || "Failed to transfer BTC");
        }
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.error || "Error processing transaction"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {successMessage && (
        <SuccessAlert
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}
      {errorMessage && (
        <ErrorAlert error={errorMessage} onClose={() => setErrorMessage("")} />
      )}

      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: xmobColors.dark }}
      >
        Address Exchange
      </h2>

      <div
        className="rounded-lg shadow-lg p-6 space-y-6"
        style={{ backgroundColor: xmobColors.light }}
      >
        <div className="space-y-2">
          <label
            className="block text-sm font-medium"
            style={{ color: xmobColors.dark }}
          >
            Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-2 rounded-md transition-colors duration-200"
            style={{
              borderColor: xmobColors.grayMedium,
              backgroundColor: xmobColors.grayLight,
              color: xmobColors.dark,
            }}
          >
            <option value="BTC">BTC</option>
            <option value="XMR">XMR</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              className="block text-sm font-medium"
              style={{ color: xmobColors.dark }}
            >
              From
            </label>
            <select
              value={fromAddressType}
              onChange={(e) => setFromAddressType(e.target.value)}
              className="w-full p-2 rounded-md transition-colors duration-200"
              style={{
                borderColor: xmobColors.grayMedium,
                backgroundColor: xmobColors.grayLight,
                color: xmobColors.dark,
              }}
            >
              <option value="spot">Spot</option>
              <option value="funding">Funding</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium"
              style={{ color: xmobColors.dark }}
            >
              To
            </label>
            <select
              value={toAddressType}
              onChange={(e) => setToAddressType(e.target.value)}
              className="w-full p-2 rounded-md transition-colors duration-200"
              style={{
                borderColor: xmobColors.grayMedium,
                backgroundColor: xmobColors.grayLight,
                color: xmobColors.dark,
              }}
            >
              <option value="funding">Funding</option>
              <option value="spot">Spot</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium"
            style={{ color: xmobColors.dark }}
          >
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 rounded-md transition-colors duration-200"
            style={{
              borderColor: xmobColors.grayMedium,
              backgroundColor: xmobColors.grayLight,
              color: xmobColors.dark,
            }}
            placeholder="Enter amount to transfer"
          />
        </div>

        <button
          onClick={handleExchange}
          disabled={loading}
          className="w-full py-3 px-4 rounded-md transition-colors duration-200 font-medium"
          style={{
            backgroundColor: xmobColors.primary,
            color: xmobColors.light,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Processing..." : "Transfer Funds"}
        </button>
      </div>
    </div>
  );
};
