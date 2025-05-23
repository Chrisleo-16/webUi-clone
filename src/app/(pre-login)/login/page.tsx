"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TextField, Button, Divider, CircularProgress } from "@mui/material";
import { Facebook, Google } from "@mui/icons-material";
import { Label } from "@/components/ui/label";
import XmobInput from "@/components/inputs/xmobitInput";
import AuthApiService from "@/helpers/Api/authentication/Auth.service";
import { useRouter } from "next/navigation";
import TokenService from "@/helpers/Token/token.service";
import ErrorAlert from "@/components/ui/ErrorAlert";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import TwoFactorVerification from "@/components/auth/TwoFactorVerification";
import { User3partyDTO } from "@/types/user3party.types";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFAMessage, setTwoFAMessage] = useState("");
  const [twoFAMethod, setTwoFAMethod] = useState("");

  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (session && session.user) {
      handleThirdPartyAuth();
    }
  }, [session]);

  const handleThirdPartyAuth = async () => {
    if (!session?.user) return;

    setLoading(true);

    try {
      const user: User3partyDTO = {
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
        authProvider: session.user.provider || "google",
      };

      const response = await AuthApiService.continueWith3Party(user);

      if (response) {
        const token = response.data || response.token || response;
        await TokenService.saveToken(token);
        await signOut({ redirect: false });
        router.push("/dashboard");
      } else {
        setError("Authentication failed: No valid response from server");
      }
    } catch (err: any) {
      setError(
        typeof err === "object" && err.message
          ? err.message
          : "Failed to authenticate with Google"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await AuthApiService.login({
        phone_email: email,
        password,
      });

      if (response.data && response.data.statusCode === 302) {
        setTwoFAMessage(
          response.data.message || "Please verify your identity to continue"
        );

        setUserId(response.data.userId || "");
        setUserEmail(response.data.email || email);
        setTwoFAMethod(response.data.method || "email");

        if (response.data.tempToken) {
          await TokenService.saveToken(response.data.tempToken);
        }

        setShowTwoFactor(true);
      } else if (response.error) {
        if (
          response.data.statusCode === 401 &&
          response.data.message &&
          response.data.message.toLowerCase().includes("inactive")
        ) {
          router.push("/inactive-account");
          return;
        }

        setError(response.data.message || "Invalid email or password");
      } else {
        if (response.data.data) {
          await TokenService.saveToken(response.data.data);
          router.push("/dashboard");
        } else {
          setError("Invalid response format from server");
        }
      }
    } catch (err: any) {
      if (
        err.response &&
        err.response.status === 401 &&
        err.response.data &&
        err.response.data.message &&
        err.response.data.message.toLowerCase().includes("inactive")
      ) {
        router.push("/inactive-account");
        return;
      }

      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorVerify = async (token: string) => {
    if (token) {
      await TokenService.saveToken(token);
    }
    router.push("/dashboard");
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
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

  return (
    <motion.div
      className="p-4 md:p-8 flex flex-col justify-center w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="w-full max-w-[400px] mx-auto">
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl text-center md:text-3xl font-bold mb-6 md:mb-8">
            {showTwoFactor ? "Verification Required" : "Log In"}
          </h2>
          <ErrorAlert error={error} onClose={() => setError("")} />
        </motion.div>

        {showTwoFactor ? (
          <TwoFactorVerification
            method={twoFAMethod}
            message={twoFAMessage}
            onVerify={handleTwoFactorVerify}
            onCancel={() => setShowTwoFactor(false)}
            userEmail={userEmail}
          />
        ) : (
          <>
            <motion.form
              className="space-y-4 md:space-y-6"
              variants={containerVariants}
              onSubmit={handleLogin}
            >
              <motion.div variants={itemVariants}>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email address
                </Label>
                <div className="relative mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-blue-100 w-full pl-4  rounded-full placeholder:text-gray-500 transition-all duration-200"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative mt-2">
                  <input
                    name="password"
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-blue-100 w-full pl-4 border border-[#e6f5ee] rounded-full placeholder:text-gray-500 focus:ring-[#00BF63] focus:border-[#00BF63] transition-all duration-200"
                  />
                </div>
              </motion.div>

              <div className="flex justify-end mb-2">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#00BF63] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <motion.div variants={itemVariants} className="pt-2">
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
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
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Log In"
                  )}
                </Button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4 my-6 md:my-8"
              >
                <Divider sx={{ flex: 1 }} />
                <span className="text-gray-500">or</span>
                <Divider sx={{ flex: 1 }} />
              </motion.div>

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
            </motion.form>

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

            <div className="text-center text-sm mt-[2rem]">
              <span className="text-gray-600">Don't have an account? </span>
              <Link
                href="/signup"
                className="text-[#00BF63] hover:text-[#00A857] font-medium"
              >
                Sign up
              </Link>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
