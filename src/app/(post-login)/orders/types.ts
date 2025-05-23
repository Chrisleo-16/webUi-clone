
export interface User {
    id: string;
    username: string;
    image: string;
    completedTrades: number;
    rating: number;
}

export interface Order {
    id: string;
    user: User;
    coin: 'btc' | 'xmr';
    amount: number;
    rate: number;
    currency: 'kes' | 'usd';
    paymentMethod: string;
    minTrade: number;
    maxTrade: number;
    createdAt: string;
    status: 'active' | 'completed' | 'cancelled';
}

export interface Trade {
    id: string;
    buyer: User;
    seller: User;
    coin: 'btc' | 'xmr';
    amount: number;
    rate: number;
    currency: 'kes' | 'usd';
    paymentMethod: string;
    status: 'active' | 'completed' | 'cancelled' | 'disputed';
    createdAt: string;
    updatedAt: string;
    totalAmount: number;
}