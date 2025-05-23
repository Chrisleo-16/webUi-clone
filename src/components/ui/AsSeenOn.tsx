import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const AsSeenOn = () => {
  const shouldReduceMotion = useReducedMotion();
  const logos = [
    {
      name: "The Motley Fool",
      src: "/motley.svg",
      alt: "The Motley Fool Logo",
    },
    {
      name: "Nasdaq",
      src: "/nasdaq.svg", // Corrected typo in filename
      alt: "Nasdaq Logo",
    },
    {
      name: "Bloomberg",
      src: "/bloomberg.svg",
      alt: "Bloomberg Logo",
    },
    {
      name: "Yahoo Finance",
      src: "/yahoo.svg",
      alt: "Yahoo Finance Logo",
    },
    {
      name: "CoinTelegraph",
      src: "/cointelegraph.svg",
      alt: "CoinTelegraph Logo",
    },
  ];

  // Duplicate logos for infinite scroll effect
  const duplicatedLogos = [...logos, ...logos];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="w-full py-6 md:py-16 bg-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-16"
        >
          As seen on
        </motion.h2>
        <div className="relative">
          {/* First row - moving right */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{
              repeat: Infinity,
              duration: shouldReduceMotion ? 60 : 30, // Slower animation
              ease: "linear",
            }}
            className="flex gap-6 md:gap-24 justify-start mb-6 md:mb-12"
          >
            {duplicatedLogos.map((logo, index) => (
              <motion.div
                key={`${logo.name}-${index}`}
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center min-w-[140px] md:min-w-[250px] p-3"
              >
                <motion.img
                  src={logo.src}
                  alt={logo.alt}
                  className="w-[120px] h-[40px] md:w-[200px] md:h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </motion.div>
            ))}
          </motion.div>
          {/* Second row - moving left */}
          <motion.div
            initial={{ x: "-50%" }}
            animate={{ x: 0 }}
            transition={{
              repeat: Infinity,
              duration: shouldReduceMotion ? 60 : 30, // Slower animation
              ease: "linear",
            }}
            className="flex gap-6 md:gap-24 justify-start"
          >
            {duplicatedLogos.reverse().map((logo, index) => (
              <motion.div
                key={`${logo.name}-${index}-reverse`}
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center min-w-[140px] md:min-w-[250px] p-3"
              >
                <motion.img
                  src={logo.src}
                  alt={logo.alt}
                  className="w-[120px] h-[40px] md:w-[200px] md:h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </motion.div>
            ))}
          </motion.div>
          {/* Gradient overlays */}
          <div className="absolute top-0 left-0 w-[80px] md:w-[300px] h-full bg-gradient-to-r from-white to-transparent z-10" />{" "}
          {/* Narrower gradient on mobile */}
          <div className="absolute top-0 right-0 w-[80px] md:w-[300px] h-full bg-gradient-to-l from-white to-transparent z-10" />{" "}
          {/* Narrower gradient on mobile */}
        </div>
      </div>
    </motion.div>
  );
};

export default AsSeenOn;
