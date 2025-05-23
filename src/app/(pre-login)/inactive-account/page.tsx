"use client";

import { motion } from "framer-motion";
import { Button } from "@mui/material";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function InactiveAccountPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="p-4 md:p-8 flex flex-col items-center justify-center min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertCircle size={40} className="text-red-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4">Account Deactivated</h1>

        <p className="text-gray-600 mb-6">
          Your account has been deactivated. This may be due to a violation of
          our terms of service, suspicious activity, or at your request.
        </p>

        <p className="text-gray-600 mb-8">
          Please contact our support team for assistance in reactivating your
          account.
        </p>

        <div className="space-y-3">
          <Button
            fullWidth
            variant="contained"
            component="a"
            href="mailto:support@xmobit.com"
            sx={{
              backgroundColor: "#00BF63",
              "&:hover": { backgroundColor: "#00A857" },
              textTransform: "none",
              py: 1.5,
              borderRadius: "9999px",
            }}
          >
            Contact Support
          </Button>

          <Link href="/login" passHref>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                borderColor: "#E8F5F0",
                color: "gray",
                textTransform: "none",
                "&:hover": { borderColor: "#00BF63" },
              }}
            >
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
