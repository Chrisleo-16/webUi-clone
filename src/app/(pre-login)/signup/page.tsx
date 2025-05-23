"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Facebook, Google } from "@mui/icons-material";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import ErrorAlert from "@/components/ui/ErrorAlert";
import XmobButton from "@/components/button/xmobitButton";
import XmobInput from "@/components/inputs/xmobitInput";
import AuthApiService from "@/helpers/Api/authentication/Auth.service";
import { useRouter } from "next/navigation";
import { CircularProgress, Button, Divider } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
// Import icons
import { Mail, User, Lock } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signIn("google", {
        callbackUrl: window.location.origin + "/login",
        redirect: false,
      });

      if (result?.error) {
        setError(`Google authentication failed: ${result.error}`);
        setLoading(false);
      }
      // Otherwise, the session callback will handle the redirect
    } catch (err: any) {
      setError(err.message || "Failed to authenticate with Google");
      setLoading(false);
    }
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const { fullName, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await AuthApiService.signUp({
        fullName,
        email,
        password,
      });
      if (response) {
        // Redirect to verification page with email
        router.push(`/verify?email=${encodeURIComponent(email)}`);
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during sign up");
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const clearError = () => setError("");

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 bg-gradient-to-b from-white to-[#f0faf5]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md">
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 border border-[#e6f5ee]"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-3 text-center mb-8">
            
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">
              Sign Up
            </h1>
           
          </div>



          <ErrorAlert error={error || null} onClose={clearError} />

          <form onSubmit={onSubmit} className="space-y-5">
            {/* <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <XmobInput
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="h-12 bg-[#f7fbf9] pl-10 border border-[#e6f5ee] rounded-xl placeholder:text-gray-400 focus:ring-[#00BF63] focus:border-[#00BF63] transition-all duration-200"
                />
              </div>
            </div> */}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email address
              </Label>
              <div className="relative">
             
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12 bg-blue-100 w-full pl-4  rounded-full placeholder:text-gray-500 transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
               
                <input
                  name="password"
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="h-12 bg-blue-100 w-full pl-4 border border-[#e6f5ee] rounded-full placeholder:text-gray-500 focus:ring-[#00BF63] focus:border-[#00BF63] transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm Password
              </Label>
              <div className="relative">
                {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div> */}
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="h-12 bg-blue-100 pl-4 w-full border border-[#e6f5ee] rounded-full placeholder:text-gray-500 focus:ring-[#00BF63] focus:border-[#00BF63] transition-all duration-200"
                />
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8"
            >
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
                  boxShadow: "0 4px 14px 0 rgba(0, 191, 99, 0.39)",
                  borderRadius: "15px",
                  height: "3.5rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              >
                {isLoading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  "Create Account"
                )}
              </Button>
            </motion.div>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <motion.div variants={itemVariants}>
            <Button
              fullWidth
              // variant="outlined"
              startIcon={<Google />}
              onClick={handleGoogleLogin}
              disabled={loading}
              sx={{
                borderColor: "#E8F5F0",
                color: "gray",
                textTransform: "none",
                height: "3rem",
                "&:hover": {
                  borderColor: "#00BF63",
                },
              }}
            >
              {loading ? "Connecting..." : "Log In with Google"}
            </Button>
          </motion.div>

           <motion.div variants={itemVariants}>
            <Button
              fullWidth
              // variant="outlined"
              startIcon={<Facebook />}
              // onClick={handleGoogleLogin}
              disabled={loading}
              sx={{
                borderColor: "#E8F5F0",
                color: "gray",
                textTransform: "none",
                height: "3rem",
                "&:hover": {
                  borderColor: "#00BF63",
                },
              }}
            >
              {loading ? "Connecting..." : "Log In with Facebook"}
            </Button>
          </motion.div>

          <div className="text-center text-sm mt-6">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              href="/login"
              className="text-[#00BF63] hover:text-[#00A857] font-medium hover:underline transition-all duration-200"
            >
              Sign in
            </Link>
          </div>
        </motion.div>

        <div className="text-center mt-6 text-xs text-gray-500">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </div>
      </div>
    </motion.div>
  );
}
