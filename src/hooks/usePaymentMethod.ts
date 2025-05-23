import { useState, useEffect } from "react";
import AuthApiService from "@/helpers/Api/authentication/Auth.service";
interface PaymentMethod {
  id: number;
  name: string;
  country: string;
  category: string;
  is_active: boolean;
}

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const methods: any = await AuthApiService.getAllPaymentDetails();
        setPaymentMethods(methods.filter((method: any) => method.is_active));
        setError(null);
      } catch (err) {
        setError("Failed to fetch payment methods");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  return { paymentMethods, isLoading, error };
};
