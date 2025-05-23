
import { Order, Trade } from './types';

export const MOCK_USERS = {
    user1: {
        id: 'u1',
        username: 'CryptoKing',
        image: '/leon.png',
        completedTrades: 156,
        rating: 4.8,
    },
    user2: {
        id: 'u2',
        username: 'BitMaster',
        image: '/leon.png',
        completedTrades: 89,
        rating: 4.5,
    }
};

export const MOCK_BUY_ORDERS: Order[] = [
    {
        id: 'bo1',
        user: MOCK_USERS.user1,
        coin: 'btc',
        amount: 0.5,
        rate: 4500000,
        currency: 'kes',
        paymentMethod: 'mpesa',
        minTrade: 20000,
        maxTrade: 500000,
        createdAt: '2024-01-20T10:00:00Z',
        status: 'active',
    },
];

export const MOCK_SELL_ORDERS: Order[] = [
    {
        id: 'so1',
        user: MOCK_USERS.user2,
        coin: 'xmr',
        amount: 5,
        rate: 150000,
        currency: 'kes',
        paymentMethod: 'mpesa',
        minTrade: 10000,
        maxTrade: 300000,
        createdAt: '2024-01-21T09:00:00Z',
        status: 'active',
    },
];

export const MOCK_ACTIVE_TRADES: Trade[] = [
    {
        id: 't1',
        buyer: MOCK_USERS.user1,
        seller: MOCK_USERS.user2,
        coin: 'btc',
        amount: 0.1,
        rate: 4500000,
        currency: 'kes',
        paymentMethod: 'mpesa',
        status: 'active',
        createdAt: '2024-01-22T08:00:00Z',
        updatedAt: '2024-01-22T08:00:00Z',
        totalAmount: 450000,
    },
];

export const MOCK_INACTIVE_TRADES: Trade[] = [
    {
        id: 't2',
        buyer: MOCK_USERS.user2,
        seller: MOCK_USERS.user1,
        coin: 'xmr',
        amount: 2,
        rate: 150000,
        currency: 'kes',
        paymentMethod: 'mpesa',
        status: 'completed',
        createdAt: '2024-01-19T10:00:00Z',
        updatedAt: '2024-01-19T10:30:00Z',
        totalAmount: 300000,
    },
];