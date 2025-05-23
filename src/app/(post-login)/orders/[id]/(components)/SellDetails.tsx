"use client"

import { Button } from "@/components/ui/button";
import { baseUrl } from "@/helpers/constants/baseUrls";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import TokenService from "@/helpers/Token/token.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";


const cancelOrder = async (orderId: string) => {
    const token = await TokenService.getToken();
    const { data } = await AxiosInstance.get(`${baseUrl}/order/cancel/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};
const reactivateOrder = async (orderId: string) => {
    const token = await TokenService.getToken();
    const { data } = await AxiosInstance.post(`${baseUrl}/order/buy-orders/${orderId}/reactivate`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};
const SellDetails = ({ order }: { order: any }) => {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showReactivateModal, setShowReactivateModal] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => {
        const fetchUserId = async () => {
            const decodedToken = await TokenService.decodeToken();
            setUserId(decodedToken?.userId);
        };
        fetchUserId();
    }, []);

    const cancelMutation = useMutation({
        mutationFn: () => cancelOrder(order.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orderDetails"] });
            router.push("/");
        },
    });

    const reactivateMutation = useMutation({
        mutationFn: () => reactivateOrder(order.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orderDetails"] });
        },
    });

    return (
        <div className="p-6 space-y-4">
            <Button variant="outline" onClick={() => router.push("/orders")}><FaArrowLeft /></Button>

            <h1 className="text-2xl font-bold mb-4">Order Details</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p><span className="font-semibold">Order ID:</span> {order.order_id}</p>
                    <p><span className="font-semibold">Type:</span> {order.order_type}</p>
                    <p><span className="font-semibold">Currency:</span> {order.currency_symbol}</p>
                    <p><span className="font-semibold">Payment Method:</span> {order.paymentmethod}</p>
                </div>

                <div>
                    <p><span className="font-semibold">Amount:</span> {order.amount} {order.currency_symbol}</p>
                    <p><span className="font-semibold">Rate:</span> {order.coin_sold_rate} USD</p>
                    <p><span className="font-semibold">Min Trade Limit:</span> {order.min_limit} {order.min_limit_type}</p>
                    <p><span className="font-semibold">Max Trade Limit:</span> {order.max_limit} {order.tradesizecurrency}</p>
                </div>
            </div>

            <p className={`font-semibold ${order.is_active ? "text-green-500" : "text-red-500"}`}>
                Status: {order.is_order_complete ? "Completed" : order.is_active ? "Active" : "Inactive"}
            </p>

            <p className="text-sm text-muted-foreground">Created on: {new Date(order.order_creation_date).toLocaleString()}</p>

            {order.is_active && !order.is_order_complete && order.user_id == userId && (
                <Button
                    variant="destructive"
                    onClick={() => cancelMutation.mutate()}
                    disabled={cancelMutation.isPending}
                >
                    {cancelMutation.isPending ? "Cancelling..." : "Cancel Order"}
                </Button>
            )}
            {!order.is_active && order.user_id == userId && (
                <Button
                    className="bg-emerald-500 hover:bg-emerald-500 opacity-90 hover:opacity-100"
                    onClick={() => setShowReactivateModal(true)}
                    disabled={reactivateMutation.isPending}
                >
                    {reactivateMutation.isPending ? "Reactivating..." : "Reactivate Order"}
                </Button>
            )}

            {/* Cancel Confirmation Modal */}
            <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
                <DialogContent>
                    <DialogTitle>Are you sure you want to cancel this order?</DialogTitle>
                    <DialogFooter>
                        <Button className="w-1/4" variant="outline" onClick={() => setShowCancelModal(false)}>No</Button>
                        <Button className="w-1/4" variant="destructive" onClick={() => { setShowCancelModal(false); cancelMutation.mutate(); }}>Yes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reactivate Confirmation Modal */}
            <Dialog open={showReactivateModal} onOpenChange={setShowReactivateModal}>
                <DialogContent>
                    <DialogTitle>Are you sure you want to reactivate this order?</DialogTitle>
                    <DialogFooter>
                        <Button className="w-1/4" variant="outline" onClick={() => setShowReactivateModal(false)}>No</Button>
                        <Button className="w-1/4 bg-emerald-500 hover:bg-emerald-500 opacity-90 hover:opacity-100" onClick={() => { setShowReactivateModal(false); reactivateMutation.mutate(); }}>Yes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default SellDetails