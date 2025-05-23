export interface PartialTradesModel {
  id: number;
  trade_id: string;
  order_id: string;
  seller_id: string;
  buyer_id: string;
  amount: number;
  date: Date;
  is_success: boolean;
  pay_time: Date | null;
  is_buyer_paid: boolean;
  has_seller_received: boolean;
  trade_joining_time: string;
  time_to_pay_buyer: string;
  seller_username: string;
  buyer_username: string;
  appealer_id: string | null;
  is_canceled: boolean;
  is_flagged: boolean;
  remaining_time: number;
}

export interface OrderModel {
  id: number;
  user_id: string;
  username: string;
  profile_pic_url: string;
  order_type: string;
  currency_symbol: string;
  order_id: string;
  paymentmethod: string;
  is_order_complete: boolean;
  is_success: boolean;
  order_creation_date: string;
  is_order_flagged: boolean;
  potential_buyer_id: string | null;
  potential_buyer_trade_entered: Date | null;
  is_transferred: boolean;
  is_received: boolean;
  is_active: boolean;
  amount: number;
  usd_rate: number;
  coin_sold_rate: number;
  remaining_amount: number;
  orderCount: number;
  completionRate: number;
  limit: string;
}

export interface PaymentDetails {
  id: number;
  user_id: string;
  country: string;
  carrier: string;
  fullname: string;
  phonenumber: string;
}

export type responseType = {
  sellerName?: string | null;
  sellerUsername?: string | null;
  sellerId?: string | null;
  sellerEmail?: string | null;
  sellerBio?: string | null;
  sellerProfileUrl?: string | null;
  tradeAmount?: number | null;
  tradeDate?: string | null;
  isBuyerPaid?: boolean | null;
  tradeJoiningTime?: string | null;
  usdRateToKes?: number | null;
  coinRateToUsd?: number | null;
  paymentDetails?: string | null;
  currencySymbol?: string | null;
  currentUserId?: string | null;
  buyerPaidTime?: string | null;
  isFlagged?: boolean;
  appealerId?: string | null;
  userId?: string;
  hasSellerRecieved?: boolean;
  sellerPaymentAccount?: string;
};
