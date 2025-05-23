"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import {
  CircularProgress,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  CheckCircleOutline,
} from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import AuthApiService from "@/helpers/Api/authentication/Auth.service";
import Link from "next/link";

// Component that uses useSearchParams
const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError(
        "Invalid or missing reset token. Please request a new password reset link."
      );
    }
  }, [token]);

  const validatePassword = (password: string): boolean => {
    // At least 8 characters, one uppercase letter, one lowercase letter, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters and include uppercase letter, lowercase letter, and number"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await AuthApiService.resetPassword({
        token: token as string,
        newPassword,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          className="max-w-md w-full bg-white p-8 rounded-lg shadow-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Invalid Reset Link
            </h1>
          </div>
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
          <Button
            fullWidth
            variant="contained"
            component={Link}
            href="/forgot-password"
            sx={{
              backgroundColor: "#00BF63",
              color: "white",
              "&:hover": { backgroundColor: "#00A857" },
              py: 1.5,
              textTransform: "none",
              borderRadius: "9999px",
            }}
          >
            Request New Reset Link
          </Button>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-green-50 p-6 rounded-full inline-flex items-center justify-center mb-6">
            <CheckCircleOutline
              className="text-[#00BF63]"
              sx={{ fontSize: 48 }}
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Password Reset Successful
          </h1>
          <p className="text-gray-600 mb-6">
            Your password has been successfully reset. You will be redirected to
            the login page shortly.
          </p>

          <Button
            fullWidth
            variant="contained"
            component={Link}
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
            Log In Now
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Reset Your Password
          </h1>
          <p className="text-gray-600 mt-2">
            Please create a new strong password for your account
          </p>
        </div>

        {error && (
          <Alert severity="error" className="mb-4" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              InputProps={{
                startAdornment: <LockOutlined className="text-gray-400 mr-2" />,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              InputProps={{
                startAdornment: <LockOutlined className="text-gray-400 mr-2" />,
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

          <ul className="text-xs text-gray-600 space-y-1 pl-5 list-disc">
            <li className={newPassword.length >= 8 ? "text-green-600" : ""}>
              At least 8 characters long
            </li>
            <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>
              Contains uppercase letter
            </li>
            <li className={/[a-z]/.test(newPassword) ? "text-green-600" : ""}>
              Contains lowercase letter
            </li>
            <li className={/\d/.test(newPassword) ? "text-green-600" : ""}>
              Contains number
            </li>
          </ul>

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
              mt: 2,
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

// Main page component with Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <CircularProgress sx={{ color: "#00BF63" }} />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
