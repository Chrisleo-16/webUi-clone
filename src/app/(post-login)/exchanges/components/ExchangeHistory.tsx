import React, { useEffect, useState } from "react";
import ExchangeService from "@/helpers/Api/exchange/exchange.service";
import xmobColors from "@/app/styles/xmobcolors";
import { formatDate } from "@/helpers/util";
import ErrorAlert from "@/components/ui/ErrorAlert";
import Spinner from "@/components/ui/Spinner";

interface ExchangeHistoryItem {
  exchange_id: string;
  from_currency: string;
  to_currency: string;
  amount_sent: number;
  amount_received: number;
  status: "Pending" | "Completed" | "Failed";
  exchange_date: Date;
  user_id: string;
}

export const ExchangeHistory = () => {
  const [exchanges, setExchanges] = useState<ExchangeHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [exchangeStatus, setExchangeStatus] = useState<Record<string, any>>({});
  const [loadingStatus, setLoadingStatus] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const result = await ExchangeService.getAllMyExchanges();
        if (result.error) {
          setError(result.message);
        } else {
          setExchanges(result || []);
        }
      } catch (error) {
        setError("Failed to load exchange history");
        console.error("Error loading exchanges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExchanges();
  }, []);

  const fetchExchangeStatus = async (exchangeId: string) => {
    if (loadingStatus[exchangeId]) return;

    setLoadingStatus((prev) => ({ ...prev, [exchangeId]: true }));

    try {
      const status = await ExchangeService.getExchangeStatus(exchangeId);
      setExchangeStatus((prev) => ({
        ...prev,
        [exchangeId]: status,
      }));
    } catch (error) {
      console.error(
        `Failed to fetch status for exchange ${exchangeId}:`,
        error
      );
      setExchangeStatus((prev) => ({
        ...prev,
        [exchangeId]: { error: "Failed to fetch status" },
      }));
    } finally {
      setLoadingStatus((prev) => ({ ...prev, [exchangeId]: false }));
    }
  };

  const toggleExpand = (exchangeId: string) => {
    if (expandedRow === exchangeId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(exchangeId);
      fetchExchangeStatus(exchangeId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "waiting":
      case "pending":
      case "confirming":
        return "bg-yellow-100 text-yellow-800";
      case "exchanging":
      case "sending":
        return "bg-blue-100 text-blue-800";
      case "finished":
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
      case "refunded":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number | string, currency: string) => {
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numericAmount)) return `${amount} ${currency}`;

    // Format based on currency
    if (currency?.toLowerCase() === "btc") {
      return `${numericAmount.toFixed(8)} BTC`;
    } else if (currency?.toLowerCase() === "xmr") {
      return `${numericAmount?.toFixed(6)} XMR`;
    }

    return `${numericAmount} ${currency}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" color={xmobColors.primary} />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  if (exchanges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>You haven't made any exchanges yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Exchange
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount Sent
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount Received
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {exchanges.map((exchange) => (
            <React.Fragment key={exchange.exchange_id}>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(exchange.exchange_date.toString())}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className="font-medium">
                    {exchange.from_currency?.toUpperCase()} →{" "}
                    {exchange.to_currency?.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {formatCurrency(exchange.amount_sent, exchange.from_currency)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {formatCurrency(
                    exchange.amount_received,
                    exchange.to_currency
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      exchange.status
                    )}`}
                  >
                    {exchange.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    onClick={() => toggleExpand(exchange.exchange_id)}
                    className="text-blue-600 hover:text-blue-800"
                    style={{ color: xmobColors.primary }}
                  >
                    {expandedRow === exchange.exchange_id ? "Hide" : "View"}
                  </button>
                </td>
              </tr>
              {expandedRow === exchange.exchange_id && (
                <tr>
                  <td colSpan={6} className="px-4 py-4 bg-gray-50">
                    {loadingStatus[exchange.exchange_id] ? (
                      <div className="flex justify-center py-4">
                        <Spinner size="sm" color={xmobColors.primary} />
                      </div>
                    ) : exchangeStatus[exchange.exchange_id] ? (
                      <div className="text-sm">
                        <p className="mb-2">
                          <strong>Exchange ID:</strong> {exchange.exchange_id}
                        </p>
                        <p className="mb-2">
                          <strong>Status:</strong>{" "}
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                              exchangeStatus[exchange.exchange_id].status ||
                                "unknown"
                            )}`}
                          >
                            {exchangeStatus[exchange.exchange_id].status ||
                              "Unknown"}
                          </span>
                        </p>
                        {exchangeStatus[exchange.exchange_id].updated_at && (
                          <p className="mb-2">
                            <strong>Last Updated:</strong>{" "}
                            {formatDate(
                              exchangeStatus[exchange.exchange_id].updated_at
                            )}
                          </p>
                        )}
                        {/* SimpleSwap specific fields */}
                        {exchangeStatus[exchange.exchange_id].address_from && (
                          <p className="mb-2">
                            <strong>Deposit Address:</strong>{" "}
                            {exchangeStatus[exchange.exchange_id].address_from}
                          </p>
                        )}
                        {exchangeStatus[exchange.exchange_id].address_to && (
                          <p className="mb-2">
                            <strong>Receiving Address:</strong>{" "}
                            {exchangeStatus[exchange.exchange_id].address_to}
                          </p>
                        )}
                        {exchangeStatus[exchange.exchange_id].amount_to && (
                          <p className="mb-2">
                            <strong>Expected amount:</strong>{" "}
                            {formatCurrency(
                              exchangeStatus[exchange.exchange_id].amount_to,
                              exchange.to_currency
                            )}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500">
                        Failed to load exchange details.
                      </p>
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
