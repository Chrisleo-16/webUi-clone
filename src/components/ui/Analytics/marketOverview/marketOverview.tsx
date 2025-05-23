import { CryptoCurrency } from "@/app/admin/dashboard/backed/BackedAdminDashBoard";
import MobitCard from "@/components/cards/xmobcard";
import Xmoblayout from "@/components/layouts/xmoblayout";
import XmobText from "@/components/text/xmobText";

interface MarketOverviewProps {
    topCurrencies: CryptoCurrency[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ topCurrencies }) => {
    return <>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {topCurrencies.map((currency) => (
                        <MobitCard bordered={true} isShadow={true}
                          key={currency.name}
                          className="bg-gray-50 rounded-lg p-6 space-y-4"
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                              {currency.name}/USD
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                currency.change > 0
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {currency.change > 0 ? "+" : ""}
                              {currency.change.toFixed(2)}%
                            </span>
                          </div>
                          <div className="text-3xl font-bold">
                            ${currency.price.toLocaleString()}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">24h Volume</p>
                              <p className="font-medium">
                                ${(currency.volume / 1000000).toFixed(2)}M
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Market Cap</p>
                              <p className="font-medium">
                                ${(currency.marketCap / 1000000000).toFixed(2)}B
                              </p>
                            </div>
                          </div>
                        </MobitCard>
                      ))}
                    </div>

   
    </>;
}

export default MarketOverview;