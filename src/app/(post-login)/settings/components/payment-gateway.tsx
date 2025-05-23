"use client";

import { useEffect, useState } from "react";
import { Info, Loader2, CheckCircle, XCircle } from "lucide-react";
import {
  SiVisa,
  SiMastercard,
  SiStripe,
  SiPaypal,
  SiGooglepay,
} from "react-icons/si";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import TokenService from "@/helpers/Token/token.service";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import { baseUrl } from "@/helpers/constants/baseUrls";
import { useQuery } from "@tanstack/react-query";

const fetchPayementDetails = async () => {
  const token = await TokenService.getToken();
  const { data } = await AxiosInstance.get(`${baseUrl}/auth/get/payment/details`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
};

export default function PaymentGateway() {
  const [isLoadingMobile, setIsLoadingMobile] = useState(false);
  const [isLoadingBank, setIsLoadingBank] = useState(false);
  const [isSubmittedMobile, setIsSubmittedMobile] = useState(false);
  const [isSubmittedBank, setIsSubmittedBank] = useState(false);
  const [error, setError] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("visa");

  const [formData, setFormData] = useState({
    country: "kenya",
    carrier: "mpesa",
    name: "",
    phone: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const paymentMethods = [
    { id: "visa", icon: SiVisa },
    { id: "stripe", icon: SiStripe },
    { id: "paypal", icon: SiPaypal },
    { id: "mastercard", icon: SiMastercard },
    { id: "googlepay", icon: SiGooglepay },
  ];
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["paymentDetails"],
    queryFn: fetchPayementDetails,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        country: data.mobileMoneyDetails.country || prev.country,
        carrier: data.mobileMoneyDetails.carrier || prev.carrier,
        name: data.mobileMoneyDetails.fullname || prev.name,
        phone: data.mobileMoneyDetails.phonenumber || prev.phone,
        cardName: data.cardName || prev.cardName,
        cardNumber: data.cardNumber || prev.cardNumber,
        expiry: data.expiry || prev.expiry,
        cvc: data.cvc || prev.cvc,
      }));
      setSelectedPaymentMethod(data.paymentMethod || "visa");
    }
  }, [data]);


  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateMobileForm = () => {
    if (!formData.name || !formData.phone) return "Name and phone are required.";
    return "";
  };

  const validateBankForm = () => {
    if (!formData.cardName) return "Cardholder's name is required.";
    if (!formData.cardNumber || formData.cardNumber.length < 16) return "Invalid card number.";
    if (!formData.expiry) return "Expiry date is required.";
    if (!formData.cvc || formData.cvc.length !== 3) return "Invalid CVC.";
    return "";
  };

  const handleSubmitMobile = async () => {
    const validationError = validateMobileForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoadingMobile(true);
    setError("");
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(`${baseUrl}/auth/save/payment-details`, {
        country: formData.country,
        carrier: formData.carrier,
        fullName: formData.name,
        phoneNumber: formData.phone,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setIsSubmittedMobile(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoadingMobile(false);
    }
  };

  const handleSubmitBank = async () => {
    const validationError = validateBankForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoadingBank(true);
    setError("");
    try {
      const response = await fetch("/api/save/payment-bank-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardName: formData.cardName,
          cardNumber: formData.cardNumber,
          expiry: formData.expiry,
          cvc: formData.cvc,
          paymentMethod: selectedPaymentMethod,
        }),
      });

      if (!response.ok) throw new Error("Failed to update bank payment details.");
      setIsSubmittedBank(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoadingBank(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Complete registration payment</h2>

        {/* Mobile Money Wallets */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-medium">Mobile Money Wallets</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Choose your preferred mobile money wallet</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Country</Label>
              <Select defaultValue={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kenya">Kenya</SelectItem>
                  <SelectItem value="uganda">Uganda</SelectItem>
                  <SelectItem value="tanzania">Tanzania</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Carrier</Label>
              <Select defaultValue={formData.carrier} onValueChange={(value) => setFormData({ ...formData, carrier: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mpesa">M-PESA</SelectItem>
                  <SelectItem value="airtel">Airtel Money</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input name="name" placeholder="Charles" value={formData.name} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input name="phone" placeholder="(123) 456-7890" value={formData.phone} onChange={handleChange} />
            </div>
          </div>

          {isSubmittedMobile && (
            <div className="text-green-500 flex items-center gap-2 mt-4">
              <CheckCircle className="w-5 h-5" /> Mobile payment details saved successfully!
            </div>
          )}

          <div className="flex mt-6">
            <Button
              className="bg-green-600 w-fit max-w-md text-white hover:text-black"
              variant="secondary"
              disabled={isLoadingMobile}
              onClick={handleSubmitMobile}
            >
              {isLoadingMobile ? <Loader2 className="animate-spin mr-2" /> : null}
              Save Mobile Payment Details
            </Button>
          </div>
        </div>

        {/* Payment Methods */}
        <h3 className="text-lg font-medium mb-4">Payment methods</h3>
        <div className="flex flex-wrap gap-8 items-center mb-8">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              className={`payment-method-button p-2 rounded-md transition-all ${selectedPaymentMethod === method.id ? "bg-green-100 ring-2 ring-green-500" : "hover:bg-gray-100"
                }`}
              onClick={() => setSelectedPaymentMethod(method.id)}
            >
              <method.icon className="w-12 h-8" />
              {selectedPaymentMethod === method.id && (
                <div className="text-xs font-medium text-green-600 mt-1">Selected</div>
              )}
            </button>
          ))}
        </div>

        {/* Bank Details */}
        <h3 className="text-lg font-medium mb-4">Bank Details</h3>
        <div className="space-y-4">
          <Input
            name="cardName"
            placeholder="Cardholder's Name"
            value={formData.cardName}
            onChange={handleChange}
          />
          <Input
            name="cardNumber"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="expiry"
              placeholder="MM/YY"
              value={formData.expiry}
              onChange={handleChange}
            />
            <Input
              name="cvc"
              placeholder="CVC"
              type="password"
              maxLength={3}
              value={formData.cvc}
              onChange={handleChange}
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 flex items-center gap-2 mt-4">
            <XCircle className="w-5 h-5" /> {error}
          </div>
        )}

        {isSubmittedBank && (
          <div className="text-green-500 flex items-center gap-2 mt-4">
            <CheckCircle className="w-5 h-5" /> Bank payment details saved successfully!
          </div>
        )}

        <div className="flex mt-6">
          <Button
            className="bg-green-600 w-fit max-w-md text-white hover:text-black"
            variant="secondary"
            disabled={isLoadingBank}
            onClick={handleSubmitBank}
          >
            {isLoadingBank ? <Loader2 className="animate-spin mr-2" /> : null}
            Save Bank Details
          </Button>
        </div>
      </Card>
    </div>
  );
}