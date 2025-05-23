"use client";

import { useState } from "react";
import {
  Check,
  Globe,
  HelpCircle,
  Info,
  Lock,
  type LucideIcon,
  CreditCard,
  User,
} from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PaymentGateway from "./components/payment-gateway";
import Security from "./components/security";
import Verification from "./components/verification";
import ProfileComponent from "@/components/ui/profle/profileComponent";
import { ProfileContent } from "./components/Profile";
import TokenService from "@/helpers/Token/token.service";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import { baseUrl } from "@/helpers/constants/baseUrls";
import { useQuery } from "@tanstack/react-query";

interface TabItem {
  icon: LucideIcon;
  label: string;
  id: string;
}

const tabs: TabItem[] = [
  { icon: User, label: "Profile", id: "profile" },
  { icon: CreditCard, label: "Payment Gateway", id: "payment" },
  { icon: Globe, label: "Verification", id: "verification" },
  { icon: Lock, label: "Security", id: "security" },
];

// FETCH MY DETAILS
const fetchMyDetails = async () => {
  const token = await TokenService.getToken();
  const { data } = await AxiosInstance.get(`${baseUrl}/auth/my-details`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data.data;
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const { data: myDetails, isLoading } = useQuery({
    queryKey: ['myDetails'],
    queryFn: fetchMyDetails
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "payment":
        return <PaymentGateway />;
      case "profile":
        return <ProfileContent myDetails={myDetails}/>;
      case "verification":
        return <Verification myDetails={myDetails}/>;
      case "security":
        return <Security />;
      default:
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            Content for {activeTab}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container py-8">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-x-6 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm",
                activeTab === tab.id
                  ? "text-green-500 bg-green-50"
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}
