"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import { baseUrl } from "@/helpers/constants/baseUrls";
import TokenService from "@/helpers/Token/token.service";
import SellDetails from "./(components)/SellDetails";
import BuyDetails from "./(components)/BuyDetails";

const fetchOrderDetails = async (orderId: string, type: string | null) => {
    const token = await TokenService.getToken();
    const endpoint = type === "buy" ? `${baseUrl}/order/buy-orders/${orderId}` : `${baseUrl}/order/${orderId}`;
    const { data } = await AxiosInstance.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
};

const OrderDetails = () => {
    const router = useRouter();
    const { id: orderId } = useParams();
    const type = useSearchParams().get('type');

    const id = typeof orderId === "string" ? orderId : Array.isArray(orderId) ? orderId[0] : null;

    const {
        data: order, isLoading, isError, } = useQuery({
            queryKey: ["orderDetails", id, type],
            queryFn: () => (id ? fetchOrderDetails(id, type) : Promise.reject("No order ID")),
            enabled: !!id,
        });


    if (isLoading) return <div className="text-center text-muted-foreground">Loading order details...</div>;
    if (isError || !order) return <div className="text-center text-red-500">Failed to load order details.</div>;

    return (
        type == "sell" ? <SellDetails order={order} /> : type == "buy" ? <BuyDetails order={order} /> : null
    );
};

export default OrderDetails;