"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function PreLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "/btc-illustration.svg",
    "/login-image.svg",
    "/onboarding-image.svg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen grid md:grid-cols-2 bg-slate-50">
      {/* Left Section */}
      <motion.div
        className="hidden md:flex bg-[#E8F5F0] p-4 md:p-8 flex-col items-center justify-center relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="w-full max-w-[400px] mx-auto text-center space-y-4 md:space-y-6"
          variants={itemVariants}
        >
          <div className="relative w-full aspect-square max-h-[320px]">
            <Image
              src={images[currentImageIndex]}
              alt="Analytics Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Receive payments in Bitcoin & Monero
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-[90%] mx-auto">
            Connect your bank card, and create accounts in the selected
            currency.
          </p>
          <div className="flex justify-center space-x-2">
            {images.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? "bg-[#00BF63]" : "bg-gray-300"
                }`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
      {children}
    </div>
  );
}
