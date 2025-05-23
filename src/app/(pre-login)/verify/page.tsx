"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import AuthApiService from "@/helpers/Api/authentication/Auth.service";
import ErrorAlert from "@/components/ui/ErrorAlert";
import { CircularProgress, Button } from "@mui/material";
import TokenService from "@/helpers/Token/token.service";

function VerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push("/signup");
    }
  }, [email, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0 && !canResend) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer, canResend]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");

    try {
      const data = await AuthApiService.verifyEmail({
        email,
        otpCode: code,
      });
      await TokenService.saveToken(data.token);
      router.push("/complete-profile");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !email) return;

    setIsLoading(true);
    setError("");

    try {
      await AuthApiService.resendOTPEmail(email);
      setResendTimer(60);
      setCanResend(false);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900">
            Second Step Verification
          </h1>
        </div>

        <ErrorAlert error={error || null} onClose={() => setError("")} />

        <div className="flex justify-center">
          <Image
            src="/verification.svg"
            alt="Verification Icon"
            width={64}
            height={100}
            priority
          />
        </div>

        <div className="text-center space-y-2">
          <p className="text-gray-600">
            Enter the verification code we sent to
          </p>
          <p className="text-green-500 font-medium">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            placeholder="Type code here"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-12 bg-[#e8f8f1] border-0 placeholder:text-gray-500"
            disabled={isLoading}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={isLoading}
            sx={{
              backgroundColor: "#00BF63",
              "&:hover": {
                backgroundColor: "#00A857",
              },
              textTransform: "none",
              py: 1.5,
              borderRadius: "9999px",
              height: "3rem",
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Verify"
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            Didn't get the code?{" "}
            <button
              onClick={handleResend}
              disabled={!canResend || isLoading}
              className={`${
                canResend && !isLoading
                  ? "text-yellow-500 hover:text-yellow-600"
                  : "text-gray-400"
              } font-medium`}
            >
              {canResend ? "Resend" : `Resend in ${resendTimer}s`}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <CircularProgress sx={{ color: "#00BF63" }} />
        </div>
      }
    >
      <VerificationContent />
    </Suspense>
  );
}
