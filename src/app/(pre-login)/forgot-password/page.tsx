"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CircularProgress, TextField, Button, Alert } from "@mui/material";
import {
  ArrowBack,
  MailOutline,
  Lock,
  QuestionAnswer,
} from "@mui/icons-material";
import AuthApiService from "@/helpers/Api/authentication/Auth.service";
import Link from "next/link";

enum ResetStep {
  EMAIL = 1,
  SECURITY_QUESTION = 2,
  SUCCESS = 3,
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentStep, setCurrentStep] = useState<ResetStep>(ResetStep.EMAIL);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await AuthApiService.getSecurityQuestion(email);

      if (response.question) {
        setSecurityQuestion(response.question);
        setCurrentStep(ResetStep.SECURITY_QUESTION);
      } else if (response.message === "No security question set") {
        // If no security question, send reset link directly
        await AuthApiService.resetPasswordSendToEmail(email);
        setSuccess("Password reset instructions have been sent to your email.");
        setCurrentStep(ResetStep.SUCCESS);
      } else {
        setError(response.message || "Could not process your request");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch security question");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!answer.trim()) {
      setError("Please enter your answer");
      return;
    }

    setLoading(true);

    try {
      const response = await AuthApiService.verifySecurityAnswer(email, answer);

      if (response.isValid) {
        await AuthApiService.resetPasswordSendToEmail(email);
        setSuccess(
          "Your answer was verified. Password reset instructions have been sent to your email."
        );
        setCurrentStep(ResetStep.SUCCESS);
      } else {
        setError(
          "The answer provided doesn't match our records. Please try again."
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify your answer");
    } finally {
      setLoading(false);
    }
  };

  const resetProcess = () => {
    setEmail("");
    setSecurityQuestion("");
    setAnswer("");
    setError("");
    setSuccess("");
    setCurrentStep(ResetStep.EMAIL);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Forgot Password</h1>
          <p className="text-gray-600 mt-2">
            {currentStep === ResetStep.EMAIL
              ? "Enter your email to recover your account"
              : currentStep === ResetStep.SECURITY_QUESTION
              ? "Answer your security question"
              : "Password recovery email sent"}
          </p>
        </div>

        {error && (
          <Alert severity="error" className="mb-4" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            className="mb-4"
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        {currentStep === ResetStep.EMAIL && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <TextField
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                InputProps={{
                  startAdornment: (
                    <MailOutline className="text-gray-400 mr-2" />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#E8F5F0",
                    "& fieldset": { borderColor: "transparent" },
                    "&:hover fieldset": { borderColor: "#00BF63" },
                    "&.Mui-focused fieldset": { borderColor: "#00BF63" },
                  },
                }}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: "#00BF63",
                color: "white",
                "&:hover": { backgroundColor: "#00A857" },
                py: 1.5,
                textTransform: "none",
                borderRadius: "9999px",
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Continue"
              )}
            </Button>

            <div className="text-center mt-4">
              <Link
                href="/login"
                className="text-sm text-[#00BF63] hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}

        {currentStep === ResetStep.SECURITY_QUESTION && (
          <form onSubmit={handleAnswerSubmit} className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Security Question
              </label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-700">
                {securityQuestion}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Answer
              </label>
              <TextField
                fullWidth
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer"
                InputProps={{
                  startAdornment: (
                    <QuestionAnswer className="text-gray-400 mr-2" />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#E8F5F0",
                    "& fieldset": { borderColor: "transparent" },
                    "&:hover fieldset": { borderColor: "#00BF63" },
                    "&.Mui-focused fieldset": { borderColor: "#00BF63" },
                  },
                }}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setCurrentStep(ResetStep.EMAIL)}
                startIcon={<ArrowBack />}
                sx={{
                  color: "gray",
                  textTransform: "none",
                  borderRadius: "9999px",
                }}
              >
                Back
              </Button>

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                sx={{
                  backgroundColor: "#00BF63",
                  color: "white",
                  "&:hover": { backgroundColor: "#00A857" },
                  py: 1.5,
                  textTransform: "none",
                  borderRadius: "9999px",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Verify Answer"
                )}
              </Button>
            </div>
          </form>
        )}

        {currentStep === ResetStep.SUCCESS && (
          <div className="text-center">
            <div className="bg-green-50 p-6 rounded-full inline-flex items-center justify-center mb-6">
              <MailOutline className="text-[#00BF63]" sx={{ fontSize: 48 }} />
            </div>

            <h2 className="text-xl font-semibold mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent password reset instructions to:
              <br />
              <strong className="font-medium">{email}</strong>
            </p>

            <div className="space-y-3">
              <Button
                fullWidth
                variant="contained"
                href="/login"
                sx={{
                  backgroundColor: "#00BF63",
                  color: "white",
                  "&:hover": { backgroundColor: "#00A857" },
                  py: 1.5,
                  textTransform: "none",
                  borderRadius: "9999px",
                }}
              >
                Return to Login
              </Button>

              <Button
                fullWidth
                onClick={resetProcess}
                variant="outlined"
                sx={{
                  borderColor: "#E8F5F0",
                  color: "gray",
                  textTransform: "none",
                  "&:hover": { borderColor: "#00BF63" },
                }}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
