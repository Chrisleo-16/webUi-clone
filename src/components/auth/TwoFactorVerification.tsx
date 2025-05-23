"use client";
import { useState } from "react";
import { Button, TextField, CircularProgress, Alert } from "@mui/material";
import { motion } from "framer-motion";
import AuthApiService from "@/helpers/Api/authentication/Auth.service";

interface TwoFactorVerificationProps {
  method: string;
  message: string;
  userEmail: string;
  onVerify: (token: string) => void;
  onCancel: () => void;
}

export default function TwoFactorVerification({
  method,
  message,
  userEmail,
  onVerify,
  onCancel,
}: TwoFactorVerificationProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async () => {
    if (!verificationCode) {
      setError("Verification code is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let response;

      if (method === "email") {
        response = await AuthApiService.verifyEmail({
          email: userEmail,
          otpCode: verificationCode,
        });

        setSuccess("Email verification successful");
        onVerify(response.token || "");
      } else {
        response = await AuthApiService.verify2FAToken(verificationCode);

        if (response.error) {
          setError(response.data.message || "Invalid verification code");
        } else {
          setSuccess("Verification successful");

          if (response.data.token) {
            onVerify(response.data.token.data);
          } else if (response.data.verified) {
            onVerify("");
          } else {
            setError(
              "Verification failed. Please check your code and try again."
            );
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Add resend OTP functionality
  const handleResendOTP = async () => {
    if (!userEmail) {
      setError("Email address is missing for resend");
      return;
    }

    setResending(true);
    setError("");

    try {
      await AuthApiService.resendOTPEmail(userEmail);
      setSuccess("Verification code has been resent to your email");
    } catch (err: any) {
      setError(err.message || "Failed to resend verification code");
    } finally {
      setResending(false);
    }
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-semibold text-center">
        Two-Factor Authentication
      </h3>

      {error && (
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 2 }}>
        {message}
      </Alert>

      <div className="space-y-2">
        {method === "2FA" ? (
          <p className="text-sm text-gray-600">
            Enter the verification code from your authenticator app.
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Enter the verification code sent to your email.
          </p>
        )}

        <TextField
          fullWidth
          label="Verification Code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          inputProps={{ maxLength: 6 }}
          placeholder="Enter 6-digit code"
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#E8F5F0",
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: "#00BF63",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#00BF63",
              },
            },
          }}
        />
      </div>

      {/* Add resend button if method is email (not for authenticator apps) */}
      {method !== "2FA" && (
        <div className="flex justify-center">
          <Button
            onClick={handleResendOTP}
            disabled={resending}
            sx={{ textTransform: "none" }}
          >
            {resending ? (
              <CircularProgress size={24} />
            ) : (
              "Resend verification code"
            )}
          </Button>
        </div>
      )}

      <div className="flex gap-4 pt-2">
        <Button
          fullWidth
          variant="outlined"
          onClick={onCancel}
          disabled={loading || resending}
          sx={{
            textTransform: "none",
            borderColor: "#E8F5F0",
            color: "gray",
          }}
        >
          Back
        </Button>

        <Button
          fullWidth
          variant="contained"
          onClick={handleVerify}
          disabled={loading || resending || !verificationCode}
          sx={{
            backgroundColor: "#00BF63",
            "&:hover": {
              backgroundColor: "#00A857",
            },
            textTransform: "none",
            borderRadius: "9999px",
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Verify"}
        </Button>
      </div>
    </motion.div>
  );
}
