// ErrorPage.tsx
import React from "react";
import { motion } from "framer-motion";

const ErrorPage = ({ error }: { error: any }) => {
  return (
    <div className="flex flex-col items-center justify-center  bg-white text-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center text-center"
      >
        <motion.img
          src="/error-illustration.svg"
          alt="Error"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-1/2 h-auto"
        />
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-4xl md:text-6xl font-bold mt-6"
        >
          Oops! Something went wrong.
        </motion.h1>
        <motion.p
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="text-lg md:text-2xl mt-4"
        >
          {error ||
            " We couldn't find the page you're looking for. Try loggin in again"}
        </motion.p>
        <motion.a
          href="/dashboard"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
          className="mt-8 px-6 py-3 bg-[#00BF63] text-white rounded-full text-lg font-bold"
        >
          Go to Dashboard
        </motion.a>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
