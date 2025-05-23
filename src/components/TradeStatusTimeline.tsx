import React from "react";
import { Card, CardContent } from "./ui/card";
import {
  CheckCircle,
  CircleDot,
  AlertTriangle,
  Clock,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TradeStatusTimelineProps {
  isPaid: boolean;
  isReleased: boolean;
  isFlagged: boolean;
  isAdminClosed?: boolean;
  isCancelled?: boolean;
}

export default function TradeStatusTimeline({
  isPaid,
  isReleased,
  isFlagged,
  isAdminClosed,
  isCancelled,
}: TradeStatusTimelineProps) {
  const getStatusStep = () => {
    if (isCancelled) return -1;
    if (isAdminClosed) return 4;
    if (isReleased) return 3;
    if (isFlagged) return 2;
    if (isPaid) return 1;
    return 0;
  };

  const currentStep = getStatusStep();

  const timelineSteps = [
    {
      title: "Trade Started",
      description: "Trade has been initiated",
      icon: currentStep >= 0 ? CheckCircle : CircleDot,
      active: currentStep >= 0,
      completed: currentStep > 0,
    },
    {
      title: "Payment Sent",
      description: "Buyer has marked payment as sent",
      icon:
        currentStep >= 1 ? CheckCircle : currentStep < 1 ? CircleDot : Clock,
      active: currentStep >= 1,
      completed: currentStep > 1,
    },
    {
      title: isFlagged ? "Trade Flagged" : "Coins Released",
      description: isFlagged
        ? "Trade has been flagged for review"
        : "Seller has released the coins",
      icon: isFlagged
        ? AlertTriangle
        : currentStep >= 2
        ? CheckCircle
        : CircleDot,
      active: currentStep >= 2 || isFlagged,
      completed: currentStep > 2,
      flagged: isFlagged,
    },
    {
      title: "Trade Completed",
      description: "Transaction has been completed successfully",
      icon: currentStep >= 3 ? CheckCircle : CircleDot,
      active: currentStep >= 3,
      completed: false,
    },
  ];

  if (isAdminClosed) {
    timelineSteps.push({
      title: "Admin Closed",
      description: "This trade was closed by an admin",
      icon: Shield,
      active: true,
      completed: false,
    });
  }

  if (isCancelled) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="text-center mt-4">
            <h3 className="font-medium text-lg">Trade Cancelled</h3>
            <p className="text-muted-foreground">
              This trade has been cancelled
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="relative">
          {/* Vertical timeline line */}
          <div
            className="absolute left-[15px] top-[24px] bottom-[24px] w-[2px] bg-muted"
            aria-hidden="true"
          />

          {/* Timeline items */}
          <div className="space-y-8">
            {timelineSteps.map((step, index) => (
              <div key={index} className="relative flex gap-4">
                <div
                  className={cn(
                    "flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full border",
                    step.active
                      ? step.flagged
                        ? "border-yellow-500 bg-yellow-100"
                        : "border-green-500 bg-green-100"
                      : "border-muted bg-background"
                  )}
                >
                  {
                    <step.icon
                      className={cn(
                        "h-4 w-4",
                        step.active
                          ? step.flagged
                            ? "text-yellow-600"
                            : "text-green-600"
                          : "text-muted-foreground"
                      )}
                    />
                  }
                </div>

                <div className="flex-1 pt-1">
                  <h3
                    className={cn(
                      "font-medium leading-none",
                      step.active ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
