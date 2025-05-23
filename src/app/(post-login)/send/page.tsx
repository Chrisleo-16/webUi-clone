"use client";

import React, { useState, useEffect } from "react";
import { FaBitcoin, FaMonero, FaInfoCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import xmobcolors from "@/app/styles/xmobcolors";
import { Tooltip } from "react-tooltip";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import {
  transactionService,
  SourceType,
} from "@/helpers/Api/transactions/tx.service";
import { toast } from "react-hot-toast";
import ErrorAlert from "@/components/ui/ErrorAlert";
import SuccessAlert from "@/components/ui/SuccessAlert";
import BitCoinService from "@/helpers/Api/bitcoin/bitcoin.service";
import MoneroService from "@/helpers/Api/monero/xmr.service";
import TokenService from "@/helpers/Token/token.service";
import AuthApiService from "@/helpers/Api/authentication/Auth.service";
import { useRouter } from "next/navigation";
import { WalletAccountModel } from "../wallets-and-accounts/backed/backed_wallet_account";
import { useWalletBalances } from "@/hooks/useWalletBalances";
import { FeeType } from "@/helpers/Api/fees/fee.service";

const SendPage: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<"BTC" | "XMR">(
    "BTC"
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center p-3 sm:p-6"
    >
      <div className="container w-full sm:mx-auto sm:px-4">
        <motion.div
          className="w-full sm:max-w-3xl sm:mx-auto bg-white rounded-3xl shadow-xl overflow-hidden"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div
            className="py-4 px-6 text-white text-center"
            style={{ backgroundColor: xmobcolors.primary }}
          >
            <h1 className="text-3xl font-semibold">Send Cryptocurrency</h1>
            <p className="mt-2 text-lg">
              Choose between Bitcoin (BTC) and Monero (XMR)
            </p>
          </div>

          <div
            className="flex justify-center"
            style={{ backgroundColor: xmobcolors.grayLight }}
          >
            <button
              onClick={() => setSelectedCurrency("BTC")}
              className={`w-1/2 px-8 py-4 text-xl font-semibold focus:outline-none ${
                selectedCurrency === "BTC"
                  ? "text-gray-800 shadow-inner"
                  : "text-gray-600 hover:bg-yellow-200"
              } `}
              style={{
                backgroundColor:
                  selectedCurrency === "BTC"
                    ? xmobcolors.secondary
                    : xmobcolors.grayLight,
              }}
            >
              <FaBitcoin className="inline mr-2" /> Bitcoin
            </button>
            <button
              onClick={() => setSelectedCurrency("XMR")}
              className={`w-1/2 px-8 py-4 text-xl font-semibold focus:outline-none ${
                selectedCurrency === "XMR"
                  ? "text-gray-800 shadow-inner"
                  : "text-gray-600 hover:bg-orange-200"
              } `}
              style={{
                backgroundColor:
                  selectedCurrency === "XMR"
                    ? xmobcolors.secondary
                    : xmobcolors.grayLight, // Using a hex color since secondary is yellow
              }}
            >
              <FaMonero className="inline mr-2" /> Monero
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCurrency}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8"
            >
              {selectedCurrency === "BTC" ? (
                <BitcoinForm currency="BTC" />
              ) : (
                <MoneroForm currency="XMR" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

interface CryptoFormProps {
  currency: "BTC" | "XMR";
}

const BitcoinForm: React.FC<CryptoFormProps> = ({ currency }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [fees, setFees] = useState("");
  const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isAddressValidating, setIsAddressValidating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [recipientUsername, setRecipientUsername] = useState<string | null>(
    null
  );
  const [validatedAddress, setValidatedAddress] = useState<string | null>(null);

  const [isInternalTransaction, setIsInternalTransaction] =
    useState<boolean>(true);

  const [selectedSource, setSelectedSource] = useState<string>("fundingWallet");
  const [hasSecurityQuestions, setHasSecurityQuestions] =
    useState<boolean>(false);
  const [has2fa, setHas2fa] = useState<boolean>(false);

  // async function fetchWalletBalances() {
  //   try {
  //     const accountData =
  //       await BackedWalletAccount.getAllMyAccountInfoWithWalletAddresses();
  //     setWalletAccountModel(accountData);

  //     const spotBtcBalance = await BitCoinService.getBTCSpotBalance();
  //     setSpotWalletBTCBalance(Number(spotBtcBalance?.currentamount || 0));

  //     const fundingBalance = await BitCoinService.getBTCbalance();
  //     setFundingWalletBTCBalance(Number(fundingBalance?.balance || 0));

  //     const liveXMRBalance = await xmoneroService.getMymoneroWallet();
  //     console.log("XMR wallet data:", liveXMRBalance);
  //     setFundingWalletXMRBalance(
  //       Number(liveXMRBalance?.data?.live_balance || 0)
  //     );

  //     const spotXMRBalance = await xmoneroService.get_my_balance();
  //     setSpotWalletXMRBalance(Number(spotXMRBalance?.data?.balance || 0));

  //     // Set active balance based on selected currency and source
  //     if (currency === "BTC") {
  //       setActiveBalance(
  //         selectedSource === "fundingWallet"
  //           ? Number(fundingBalance?.balance || 0)
  //           : Number(spotBtcBalance?.currentamount || 0)
  //       );
  //     } else {
  //       setActiveBalance(
  //         selectedSource === "fundingWallet"
  //           ? Number(liveXMRBalance?.data?.live_balance || 0)
  //           : Number(spotXMRBalance?.data?.balance || 0)
  //       );
  //     }

  //     setIsTransactionReady(true);
  //   } catch (error) {
  //     console.error("Error fetching wallet balances:", error);
  //     setErrorMessage("Failed to fetch wallet balances");
  //     setIsTransactionReady(false);
  //   }
  // }

  // useEffect(() => {
  //   fetchWalletBalances();
  // }, [currency]);

  // Balances hook
  const {
    spotWalletBTCBalance,
    fundingWalletBTCBalance,
    fundingWalletXMRBalance,
    spotWalletXMRBalance,
    activeBalance,
    isTransactionReady,
    errorMessage: walletErrorMessage,
    isLoading: isLoadingBalances,
    refreshBalances,
  } = useWalletBalances({
    currency,
    selectedSource,
  });
  useEffect(() => {
    if (walletErrorMessage) {
      setErrorMessage(walletErrorMessage);
    }
  }, [walletErrorMessage]);

  const router = useRouter();

  const handleSourceChange = (source: string) => {
    setSelectedSource(source);
  };

  const handleSendBitcoin = async () => {
    setIsLoading(true);
    try {
      if (!has2fa && !hasSecurityQuestions) {
        setErrorMessage(
          "You need either 2FA or Security Questions enabled to make transfers"
        );
        return;
      }
      if (Number(amount) <= 0) {
        setErrorMessage("Amount must be greater than 0");
        return;
      }

      if (Number(amount) > activeBalance) {
        setErrorMessage("Insufficient balance in selected wallet");
        return;
      }

      if (currency === "BTC") {
        if (isInternalTransaction) {
          if (selectedSource === "spotWallet") {
            await BitCoinService.sendBitcoinToSpotFromSpot(
              recipient,
              parseFloat(amount)
            );
          } else {
            await BitCoinService.sendBitcoinToFunding(
              recipient,
              parseFloat(amount),
              false
            );
          }
        } else {
          if (selectedSource === "spotWallet") {
            await BitCoinService.sendBitcoinToFunding(
              recipient,
              parseFloat(amount),
              true
            );
          } else {
            await BitCoinService.sendBitcoin(recipient, parseFloat(amount));
          }
        }
      } else if (currency === "XMR") {
        const response = await transactionService.sendTransaction({
          identifier: recipient,
          amount: parseFloat(amount),
          currency,
          source:
            selectedSource === "spotWallet"
              ? SourceType.SPOT
              : SourceType.FUNDING,
        });
        if (response.status === 200) {
          setSuccessMessage(response.data.message);
          refreshBalances();
        } else {
          setErrorMessage(response.data.message || "Transaction failed");
        }
      }

      setSuccessMessage("Transaction completed successfully!");

      // Refresh balances after transaction
      refreshBalances();
    } catch (error: any) {
      setErrorMessage(error.message || "Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setErrorMessage(null);
  const clearSuccess = () => setSuccessMessage(null);

  const formatBalance = (balance: number): string => {
    if (balance > 0 && balance < 0.001) {
      return balance.toFixed(8);
    } else if (balance > 0 && balance < 0.01) {
      return balance.toFixed(5);
    } else {
      return balance.toFixed(3);
    }
  };

  const sourceOptions = [
    {
      value: "fundingWallet",
      label: `${currency} Funding Wallet`,
      balance:
        currency === "BTC" ? fundingWalletBTCBalance : fundingWalletXMRBalance,
    },
    {
      value: "spotWallet",
      label: `${currency} Spot Wallet`,
      balance: currency === "BTC" ? spotWalletBTCBalance : spotWalletXMRBalance,
    },
  ];

  const validateForm = async () => {
    console.log(selectedSource);
    const newErrors: { recipient?: string; amount?: string } = {};

    if (!recipient) newErrors.recipient = "Recipient address is required";
    if (!amount) newErrors.amount = "Amount is required";
    else {
      const amountFloat = parseFloat(amount);
      const currentBalance =
        selectedSource === "spotWallet"
          ? currency === "BTC"
            ? spotWalletBTCBalance
            : spotWalletXMRBalance
          : currency === "BTC"
          ? fundingWalletBTCBalance
          : fundingWalletXMRBalance;

      if (Number(amountFloat) <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      } else if (amountFloat > currentBalance) {
        newErrors.amount = `Insufficient balance in ${
          selectedSource === "spotWallet" ? "Spot" : "Funding"
        } wallet`;
      }
    }

    if (!newErrors.recipient && !newErrors.amount) {
      setIsAddressValidating(true);
      console.log(selectedSource);
      try {
        const isValid = await transactionService.validateTransaction({
          recipient,
          amount,
          currency,
          source:
            selectedSource === "spotWallet"
              ? SourceType.SPOT
              : SourceType.FUNDING,
        });

        if (!isValid.success) {
          newErrors.recipient =
            isValid || "Invalid address for this cryptocurrency";
        } else {
          setFees(isValid.fees);
          setIsInternalTransaction(isValid.isInternal);
          setHasSecurityQuestions(isValid.hasSecurityQuestions);
          setHas2fa(isValid.has2FA);
          setRecipientUsername(isValid.recipientUsername || null);
          setValidatedAddress(isValid.recipientAddress || recipient);
        }
      } catch (error) {
        setErrorMessage("Failed to validate address. Please try again.");
        console.error("Validation error:", error);
        newErrors.recipient = "Failed to validate address";
      } finally {
        setIsAddressValidating(false);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const isValid = await validateForm();
      if (isValid) {
        setShowPreview(true);
      }
    } catch (error) {
      setErrorMessage("An error occurred while processing your request");
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isTransactionReady) {
    return (
      <div className="space-y-6">
        {/* Source Wallet Skeleton */}
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
        </div>

        {/* Recipient Address Skeleton */}
        <div className="animate-pulse">
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
        </div>

        {/* Amount Skeleton */}
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mt-2"></div>
        </div>

        {/* Button Skeleton */}
        <div className="animate-pulse">
          <div className="h-14 w-full bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ErrorAlert error={errorMessage} onClose={clearError} />
      <SuccessAlert message={successMessage} onClose={clearSuccess} />

      {!showPreview ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Source Selection */}
          <div className="relative">
            <label className="flex items-center text-gray-700 text-sm font-bold mb-2">
              Source Wallet
              <FaInfoCircle
                className="ml-2 text-gray-500 cursor-help"
                data-tooltip-id="source-tooltip"
                data-tooltip-content="Select the wallet to send from"
              />
            </label>
            <select
              value={selectedSource}
              onChange={(e) => handleSourceChange(e.target.value)}
              className="transition-all duration-200 shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2"
              style={{ borderColor: xmobcolors.grayMedium }}
            >
              {sourceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {`${option.label} (${formatBalance(
                    option.balance
                  )} ${currency})`}
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Address */}
          <div className="relative">
            <label className="flex items-center text-gray-700 text-sm font-bold mb-2">
              Recipient Address
              <FaInfoCircle
                className="ml-2 text-gray-500 cursor-help"
                data-tooltip-id="recipient-tooltip"
                data-tooltip-content="Enter the Bitcoin address of the recipient"
              />
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className={`transition-all duration-200 shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-${
                xmobcolors.primary
              } ${errors.recipient ? "border-red-500" : ""}`}
              style={{
                borderColor: errors.recipient
                  ? xmobcolors.danger
                  : xmobcolors.grayMedium,
              }}
              disabled={isAddressValidating}
            />
            {isAddressValidating && (
              <div className="absolute right-3 top-9">
                <svg
                  className="animate-spin h-5 w-5 text-gray-500"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}
            {errors.recipient && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xs mt-1"
              >
                {errors.recipient}
              </motion.p>
            )}
          </div>

          {/* Amount Input with Balance Display */}
          <div className="relative">
            <label className="flex items-center text-gray-700 text-sm font-bold mb-2">
              Amount ({currency})
              <FaInfoCircle
                className="ml-2 text-gray-500 cursor-help"
                data-tooltip-id="amount-tooltip"
                data-tooltip-content={`Enter the amount of ${currency} to send`}
              />
            </label>
            <div className="flex flex-col space-y-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`transition-all duration-200 shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-${
                  xmobcolors.primary
                } ${errors.amount ? "border-red-500" : ""}`}
                style={{
                  borderColor: errors.amount
                    ? xmobcolors.danger
                    : xmobcolors.grayMedium,
                }}
                max={activeBalance}
              />
              <div className="text-sm text-gray-600">
                Available Balance: {activeBalance} {currency}
              </div>
            </div>
            {errors.amount && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xs mt-1"
              >
                {errors.amount}
              </motion.p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full text-dark font-bold py-4 px-6 rounded-lg focus:outline-none focus:shadow-outline ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
            style={{
              backgroundColor: xmobcolors.secondary,
              color: xmobcolors.dark,
            }}
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              `Send ${currency}`
            )}
          </motion.button>
        </form>
      ) : (
        <PreviewStep
          recipient={validatedAddress || recipient}
          recipientUsername={recipientUsername}
          amount={amount}
          fees={fees}
          currency={currency}
          sourceWallet={
            selectedSource === "spotWallet" ? "Spot Wallet" : "Funding Wallet"
          }
          onBack={() => setShowPreview(false)}
          handleSendBitcoin={handleSendBitcoin}
          has2fa={has2fa}
          hasSecurityQuestions={hasSecurityQuestions}
          isLoading={isLoading}
        />
      )}

      <Tooltip id="source-tooltip" />
      <Tooltip id="recipient-tooltip" />
      <Tooltip id="amount-tooltip" />
    </div>
  );
};

const SecurityVerificationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onVerify: (value: string) => void;
  isProcessing: boolean;
  error?: string;
  has2fa: boolean;
  hasSecurityQuestions: boolean;
  verificationType: "2FA" | "SECURITY_QUESTION" | null;
  securityQuestion: string;
}> = ({
  isOpen,
  onClose,
  onVerify,
  isProcessing,
  error,
  has2fa,
  hasSecurityQuestions,
  verificationType,
  securityQuestion,
}) => {
  const [value, setValue] = useState("");

  if (!isOpen || !verificationType) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-md m-4"
      >
        <h3 className="text-xl font-semibold mb-4 text-center">
          {verificationType === "2FA" ? "Enter 2FA Code" : "Security Question"}
        </h3>

        {verificationType === "2FA" ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center mb-4">
              Please enter the 6-digit code from your authenticator app
            </p>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={value}
                onChange={(value) => setValue(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-2">{securityQuestion}</p>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter your answer"
            />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
        )}

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={() => onVerify(value)}
            className="flex-1 py-2 px-4 rounded-lg text-white flex items-center justify-center"
            style={{ backgroundColor: xmobcolors.primary }}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

interface PreviewStepProps {
  recipient: string;
  recipientUsername: string | null;
  amount: string;
  fees: string;
  currency: "BTC" | "XMR";
  sourceWallet: string;
  onBack: () => void;
  handleSendBitcoin: () => void;
  has2fa: boolean;
  hasSecurityQuestions: boolean;
  isLoading: boolean;
}

const PreviewStep: React.FC<PreviewStepProps> = ({
  recipient,
  recipientUsername,
  amount,
  fees,
  currency,
  sourceWallet,
  onBack,
  handleSendBitcoin,
  has2fa,
  hasSecurityQuestions,
  isLoading,
}) => {
  const [showVerification, setShowVerification] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationError, setVerificationError] = useState<
    string | undefined
  >();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [securityQuestion, setSecurityQuestion] = useState<string>("");
  const [verificationType, setVerificationType] = useState<
    "2FA" | "SECURITY_QUESTION" | null
  >(null);
  const router = useRouter();

  useEffect(() => {
    const initializeVerification = async () => {
      try {
        const decodedToken = await TokenService.decodeToken();
        const userId = decodedToken?.userId;

        if (has2fa) {
          setVerificationType("2FA");
        } else if (hasSecurityQuestions) {
          const questionData =
            await AuthApiService.getSecurityQuestionUsingID();
          const question = questionData.data.map((question: any) => {
            return question.question;
          });
          setSecurityQuestion(question);
          setVerificationType("SECURITY_QUESTION");
        }
      } catch (error) {
        console.error("Error initializing verification:", error);
        setErrorMessage("Failed to initialize security verification");
      }
    };

    initializeVerification();
  }, [has2fa, hasSecurityQuestions]);

  const clearError = () => setErrorMessage(null);
  const clearSuccess = () => setSuccessMessage(null);

  const handleConfirm = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (!has2fa && !hasSecurityQuestions) {
        setErrorMessage(
          "You need either 2FA or Security Questions enabled to make transfers"
        );
        return;
      }

      setShowVerification(true);
    } catch (error: any) {
      console.error("Error:", error);
      setErrorMessage(error.message || "Failed to process request");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerification = async (code: string) => {
    setIsProcessing(true);
    setVerificationError(undefined);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      let verificationResponse;

      if (verificationType === "2FA") {
        verificationResponse = await AuthApiService.verify2FAtoken(code);
      } else if (verificationType === "SECURITY_QUESTION") {
        const decodedToken = await TokenService.decodeToken();
        verificationResponse = await AuthApiService.verifySecurityAnswer(
          decodedToken.userEmail,
          code
        );
      }

      if (verificationResponse?.isValid) {
        handleSendBitcoin();
        setShowVerification(false);
        // setSuccessMessage("Transaction processed successfully!");
        // setTimeout(() => {
        //   router.push("/wallets-and-accounts");
        // }, 5000);
      } else {
        setVerificationError("Verification failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setVerificationError(error.message || "Verification failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <ErrorAlert error={errorMessage} onClose={clearError} />
      <SuccessAlert message={successMessage} onClose={clearSuccess} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h3 className="text-xl font-semibold text-center">
          Confirm Transaction
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Recipient:</span>
            <div className="flex flex-col items-end">
              {recipientUsername && (
                <span className="font-medium text-sm text-blue-600">
                  @{recipientUsername}
                </span>
              )}
              <span className="font-medium truncate max-w-[250px]">
                {recipient}
              </span>
            </div>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">
              {amount} {currency}
            </span>
          </div>
          <div className="flex justify-between border-b pt-2">
            <span className="text-gray-600">Fees:</span>
            <span className="font-medium">
              {fees} {currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">From:</span>
            <span className="font-medium">{sourceWallet}</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={isProcessing}
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 px-4 rounded-lg text-white flex items-center justify-center"
            style={{ backgroundColor: xmobcolors.primary }}
            disabled={isProcessing}
          >
            {isProcessing || isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </motion.div>

      <SecurityVerificationModal
        isOpen={showVerification}
        onClose={() => setShowVerification(false)}
        onVerify={handleVerification}
        isProcessing={isProcessing}
        error={verificationError}
        has2fa={has2fa}
        hasSecurityQuestions={hasSecurityQuestions}
        verificationType={verificationType}
        securityQuestion={securityQuestion}
      />
    </>
  );
};

const MoneroForm: React.FC<CryptoFormProps> = ({ currency }) => {
  return <BitcoinForm currency={currency} />;
};

export default SendPage;
