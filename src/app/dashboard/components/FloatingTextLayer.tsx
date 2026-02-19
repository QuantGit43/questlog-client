"use client";

import { AnimatePresence, motion } from "framer-motion";

export type FloatingTextItem = {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
};


interface FloatingTextLayerProps {
  items: FloatingTextItem[];
}

export const FloatingTextLayer = ({ items }: FloatingTextLayerProps) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, y: item.y, x: item.x, scale: 0.5 }}
            animate={{ opacity: 0, y: item.y - 100, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`absolute font-bold text-2xl drop-shadow-[2px_2px_0_rgba(0,0,0,1)] ${item.color}`}
            style={{ textShadow: "2px 2px 0 #000" }}
          >
            {item.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};