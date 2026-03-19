import React from 'react';
import { motion } from 'motion/react';

interface StickmanProps {
  exerciseId: string;
  className?: string;
}

export const StickmanAnimation: React.FC<StickmanProps> = ({ exerciseId, className }) => {
  // Simple SVG stickman animations based on exerciseId
  const renderAnimation = () => {
    switch (exerciseId) {
      case 'pushups':
      case 'diamond-pushups':
        return (
          <motion.g
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            {/* Body */}
            <line x1="20" y1="70" x2="80" y2="70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            {/* Head */}
            <circle cx="85" cy="65" r="5" fill="currentColor" />
            {/* Arms */}
            <line x1="70" y1="70" x2="70" y2="90" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            {/* Legs */}
            <line x1="20" y1="70" x2="10" y2="85" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </motion.g>
        );
      case 'squats':
      case 'squat-jumps':
        return (
          <motion.g
            animate={{ y: [0, 30, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            {/* Head */}
            <circle cx="50" cy="20" r="8" fill="currentColor" />
            {/* Torso */}
            <line x1="50" y1="28" x2="50" y2="60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            {/* Arms */}
            <line x1="50" y1="35" x2="80" y2="35" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            {/* Legs */}
            <motion.path
              d="M50 60 L35 80 L50 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: ["M50 60 L35 80 L50 100", "M50 60 L70 75 L50 85", "M50 60 L35 80 L50 100"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
            <motion.path
              d="M50 60 L65 80 L50 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: ["M50 60 L65 80 L50 100", "M50 60 L30 75 L50 85", "M50 60 L65 80 L50 100"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </motion.g>
        );
      case 'burpees':
        return (
          <motion.g
            animate={{ 
              y: [0, 40, 40, 0, -20, 0],
              scaleY: [1, 0.5, 0.5, 1, 1.2, 1]
            }}
            transition={{ repeat: Infinity, duration: 3, times: [0, 0.2, 0.5, 0.7, 0.85, 1] }}
          >
            <circle cx="50" cy="20" r="8" fill="currentColor" />
            <line x1="50" y1="28" x2="50" y2="60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="60" x2="40" y2="90" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="60" x2="60" y2="90" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </motion.g>
        );
      default:
        return (
          <motion.g
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <circle cx="50" cy="25" r="10" fill="currentColor" />
            <line x1="50" y1="35" x2="50" y2="75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="45" x2="30" y2="60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="45" x2="70" y2="60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="75" x2="35" y2="95" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="75" x2="65" y2="95" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </motion.g>
        );
    }
  };

  return (
    <svg viewBox="0 0 100 100" className={className}>
      {renderAnimation()}
    </svg>
  );
};
