import { motion } from "motion/react";

export default function Loading() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 z-10"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex gap-3"
        animate={{
          scale: [1, 1.1, 1],
          rotateZ: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="w-4 h-4 rounded-full bg-primary"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: 0,
          }}
        />
        <motion.div
          className="w-4 h-4 rounded-full bg-primary"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: 0.2,
          }}
        />
        <motion.div
          className="w-4 h-4 rounded-full bg-primary"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: 0.4,
          }}
        />
      </motion.div>
      <motion.p
        className="mt-4 text-lg font-medium text-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Loading...
      </motion.p>
    </motion.div>
  );
}
