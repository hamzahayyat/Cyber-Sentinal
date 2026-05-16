"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="p-6 md:p-8 max-w-7xl mx-auto w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
}
