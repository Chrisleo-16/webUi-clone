"use client"
import { createContext, useContext, ReactNode } from "react";
import { Toaster, toast } from "react-hot-toast";

interface ToastContextType {
    showToast: (message: string, type?: "success" | "error" | "loading") => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const showToast = (message: string, type: "success" | "error" | "loading" = "success") => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message);
        } else {
            toast.loading(message);
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            <Toaster position="top-right" />
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);