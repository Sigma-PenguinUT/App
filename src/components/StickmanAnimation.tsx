import React from 'react';
import { motion } from 'motion/react';

import { ExerciseRarity } from '../types';
import { RARITY_COLORS } from '../constants';

interface StickmanProps {
  exerciseId: string;
  rarity?: ExerciseRarity;
  className?: string;
}

export const StickmanAnimation: React.FC<StickmanProps> = ({ exerciseId, rarity = 'Common', className }) => {
  const color = RARITY_COLORS[rarity] || RARITY_COLORS.Common;
  
  const renderAnimation = () => {
    switch (exerciseId) {
      case 'pike-pushups':
        return (
          <motion.g>
            <line x1="10" y1="95" x2="90" y2="95" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
            <motion.g
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, 5, 0]
              }}
              style={{ originX: "20px", originY: "95px" }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              {/* Legs to Hips */}
              <line x1="20" y1="95" x2="45" y2="50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              {/* Hips to Head */}
              <line x1="45" y1="50" x2="75" y2="80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <circle cx="78" cy="83" r="5" fill="currentColor" />
              {/* Arms */}
              <motion.path
                d="M70 75 L75 95"
                stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                animate={{ d: ["M70 75 L75 95", "M70 75 L80 85 L75 95", "M70 75 L75 95"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
            </motion.g>
          </motion.g>
        );
      case 'dynamic-side-stretch':
        return (
          <motion.g>
            <circle cx="50" cy="25" r="8" fill="currentColor" />
            <line x1="50" y1="33" x2="50" y2="70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <motion.path
              d="M50 40 L80 40"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: ["M50 40 L80 40", "M50 40 L70 10", "M50 40 L80 40"] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <motion.path
              d="M50 40 L20 40"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: ["M50 40 L20 40", "M50 40 L30 10", "M50 40 L20 40"] }}
              transition={{ repeat: Infinity, duration: 2, delay: 1 }}
            />
            <line x1="50" y1="70" x2="35" y2="95" stroke="currentColor" strokeWidth="4" />
            <line x1="50" y1="70" x2="65" y2="95" stroke="currentColor" strokeWidth="4" />
          </motion.g>
        );
      case 'cobra-pose':
        return (
          <motion.g>
            <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <motion.path
              d="M20 90 L60 90 L85 85"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: ["M20 90 L60 90 L85 85", "M20 90 L50 90 L70 50", "M20 90 L60 90 L85 85"] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
            <motion.circle 
              cx="85" cy="85" r="5" fill="currentColor"
              animate={{ cx: [85, 70, 85], cy: [85, 45, 85] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
          </motion.g>
        );
      case 'quad-stretch':
        return (
          <motion.g>
            <circle cx="50" cy="20" r="8" fill="currentColor" />
            <line x1="50" y1="28" x2="50" y2="65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="65" x2="50" y2="95" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <motion.path
              d="M50 65 L60 85 L55 70"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: ["M50 65 L60 85 L55 70", "M50 65 L65 90 L60 75", "M50 65 L60 85 L55 70"] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <line x1="50" y1="35" x2="35" y2="50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </motion.g>
        );
      case 'wall-w-stretch':
        return (
          <motion.g>
            <circle cx="50" cy="25" r="8" fill="currentColor" />
            <line x1="50" y1="33" x2="50" y2="70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <motion.path
              d="M50 40 L70 30 L85 45"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: ["M50 40 L70 30 L85 45", "M50 40 L75 15 L85 5", "M50 40 L70 30 L85 45"] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <motion.path
              d="M50 40 L30 30 L15 45"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: ["M50 40 L30 30 L15 45", "M50 40 L25 15 L15 5", "M50 40 L30 30 L15 45"] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <line x1="50" y1="70" x2="40" y2="95" stroke="currentColor" strokeWidth="4" />
            <line x1="50" y1="70" x2="60" y2="95" stroke="currentColor" strokeWidth="4" />
          </motion.g>
        );
      case 'leg-raises':
        return (
          <motion.g>
            <line x1="10" y1="85" x2="90" y2="85" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <circle cx="20" cy="80" r="5" fill="currentColor" />
            <motion.path
              d="M25 85 L85 85"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: ["M25 85 L85 85", "M25 85 L25 25", "M25 85 L85 85"] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.g>
        );
      case 'downward-dog':
        return (
          <motion.g>
            <motion.path
              d="M20 90 L50 40 L80 90"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: ["M20 90 L50 40 L80 90", "M20 90 L50 30 L80 90", "M20 90 L50 40 L80 90"] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
            <circle cx="20" cy="95" r="3" fill="currentColor" />
            <circle cx="80" cy="95" r="3" fill="currentColor" />
          </motion.g>
        );
      case 'standard-pushups':
      case 'diamond-pushups':
        return (
          <motion.g>
            {/* Ground */}
            <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
            {/* Body & Head */}
            <motion.g
              animate={{ 
                rotate: [0, 15, 0],
                y: [0, 20, 0]
              }}
              style={{ originX: "20px", originY: "85px" }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <line x1="20" y1="85" x2="80" y2="85" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <circle cx="85" cy="85" r="5" fill="currentColor" />
              {/* Arms */}
              <motion.path
                d="M70 85 L70 95"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ d: ["M70 85 L70 95", "M70 85 L75 90 L70 95", "M70 85 L70 95"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
            </motion.g>
          </motion.g>
        );
      case 'step-ups':
        return (
          <motion.g>
            {/* Chair */}
            <rect x="60" y="70" width="30" height="20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <motion.g
              animate={{ 
                y: [0, -25, -25, 0],
                x: [0, 20, 20, 0]
              }}
              transition={{ repeat: Infinity, duration: 3, times: [0, 0.4, 0.6, 1] }}
            >
              <circle cx="30" cy="40" r="6" fill="currentColor" />
              <line x1="30" y1="46" x2="30" y2="75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <motion.path
                d="M30 75 L20 95"
                stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                animate={{ d: ["M30 75 L20 95", "M30 75 L50 70 L60 70", "M30 75 L20 95"] }}
                transition={{ repeat: Infinity, duration: 3, times: [0, 0.4, 1] }}
              />
              <motion.path
                d="M30 75 L40 95"
                stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                animate={{ d: ["M30 75 L40 95", "M30 75 L40 85", "M30 75 L40 95"] }}
                transition={{ repeat: Infinity, duration: 3, times: [0, 0.4, 1] }}
              />
            </motion.g>
          </motion.g>
        );
      case 'squat-jumps':
        return (
          <motion.g>
            <motion.g
              animate={{ 
                y: [0, 30, -30, 0],
                scaleY: [1, 0.7, 1.1, 1]
              }}
              transition={{ repeat: Infinity, duration: 1.5, times: [0, 0.3, 0.6, 1] }}
              style={{ originX: "50px", originY: "90px" }}
            >
              <circle cx="50" cy="20" r="8" fill="currentColor" />
              <line x1="50" y1="28" x2="50" y2="60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <motion.path
                d="M50 60 L35 90"
                stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                animate={{ d: ["M50 60 L35 90", "M50 60 L30 75 L50 75", "M50 60 L35 90"] }}
                transition={{ repeat: Infinity, duration: 1.5, times: [0, 0.3, 1] }}
              />
              <motion.path
                d="M50 60 L65 90"
                stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                animate={{ d: ["M50 60 L65 90", "M50 60 L70 75 L50 75", "M50 60 L65 90"] }}
                transition={{ repeat: Infinity, duration: 1.5, times: [0, 0.3, 1] }}
              />
              <motion.path
                d="M50 40 L20 40"
                stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                animate={{ d: ["M50 40 L20 40", "M50 40 L20 10", "M50 40 L20 40"] }}
                transition={{ repeat: Infinity, duration: 1.5, times: [0, 0.6, 1] }}
              />
              <motion.path
                d="M50 40 L80 40"
                stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                animate={{ d: ["M50 40 L80 40", "M50 40 L80 10", "M50 40 L80 40"] }}
                transition={{ repeat: Infinity, duration: 1.5, times: [0, 0.6, 1] }}
              />
            </motion.g>
          </motion.g>
        );
      case 'plank-crawl':
        return (
          <motion.g>
            <motion.g
              animate={{ x: [-20, 20, -20] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            >
              <line x1="20" y1="80" x2="80" y2="80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <circle cx="85" cy="75" r="5" fill="currentColor" />
              <motion.path
                d="M75 80 L75 95"
                stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              />
              <motion.path
                d="M20 80 L10 95"
                stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                animate={{ x: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: 0.25 }}
              />
            </motion.g>
          </motion.g>
        );
      case 'squats':
      case 'vertical-jumps':
        return (
          <motion.g>
            {/* Head */}
            <motion.circle 
              cx="50" cy="25" r="8" fill="currentColor"
              animate={{ y: [0, 35, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
            {/* Torso */}
            <motion.line 
              x1="50" y1="33" x2="50" y2="65" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
              animate={{ y1: [33, 68, 33], y2: [65, 85, 65] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
            {/* Arms */}
            <motion.path
              d="M50 40 L80 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: ["M50 40 L80 40", "M50 75 L80 75", "M50 40 L80 40"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
            {/* Legs */}
            <motion.path
              d="M50 65 L35 85 L50 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: ["M50 65 L35 85 L50 100", "M50 85 L70 90 L50 95", "M50 65 L35 85 L50 100"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
            <motion.path
              d="M50 65 L65 85 L50 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: ["M50 65 L65 85 L50 100", "M50 85 L30 90 L50 95", "M50 65 L65 85 L50 100"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </motion.g>
        );
      case 'lunges':
      case 'bulgarian-split-squat-l':
      case 'bulgarian-split-squat-r':
        return (
          <motion.g>
            <circle cx="50" cy="20" r="8" fill="currentColor" />
            <line x1="50" y1="28" x2="50" y2="55" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            {/* Front Leg */}
            <motion.path
              d="M50 55 L70 75 L70 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: ["M50 55 L70 75 L70 100", "M50 55 L80 85 L60 100", "M50 55 L70 75 L70 100"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            {/* Back Leg */}
            <motion.path
              d="M50 55 L30 75 L30 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: ["M50 55 L30 75 L30 100", "M50 55 L20 85 L40 100", "M50 55 L30 75 L30 100"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </motion.g>
        );
      case 'dips':
        return (
          <motion.g>
            {/* Chair */}
            <path d="M60 60 L80 60 L80 90 M80 60 L80 40" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <motion.g animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <circle cx="50" cy="30" r="8" fill="currentColor" />
              <line x1="50" y1="38" x2="50" y2="70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M50 70 L30 70 L30 90" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <motion.path
                d="M50 45 L70 45 L70 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ d: ["M50 45 L70 45 L70 60", "M50 45 L75 55 L70 70", "M50 45 L70 45 L70 60"] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </motion.g>
          </motion.g>
        );
      case 'plank':
        return (
          <motion.g animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
            <line x1="20" y1="80" x2="80" y2="80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <circle cx="85" cy="75" r="5" fill="currentColor" />
            <path d="M75 80 L75 95" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <path d="M20 80 L10 95" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </motion.g>
        );
      case 'sit-ups':
        return (
          <motion.g>
            <path d="M20 90 L80 90" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <motion.g
              animate={{ rotate: [0, -70, 0] }}
              style={{ originX: "50px", originY: "90px" }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <circle cx="50" cy="40" r="8" fill="currentColor" />
              <line x1="50" y1="48" x2="50" y2="90" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M50 55 L70 70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </motion.g>
            <path d="M50 90 L80 90 L90 70" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </motion.g>
        );
      case 'high-knees':
        return (
          <motion.g>
            <circle cx="50" cy="20" r="8" fill="currentColor" />
            <line x1="50" y1="28" x2="50" y2="60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <motion.path
              d="M50 60 L40 90"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: ["M50 60 L40 90", "M50 60 L30 70 L50 70", "M50 60 L40 90"] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
            />
            <motion.path
              d="M50 60 L60 90"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: ["M50 60 L60 90", "M50 60 L70 70 L50 70", "M50 60 L60 90"] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
            />
          </motion.g>
        );
      case 'calf-raises':
        return (
          <motion.g animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <circle cx="50" cy="20" r="8" fill="currentColor" />
            <line x1="50" y1="28" x2="50" y2="70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="70" x2="40" y2="100" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="70" x2="60" y2="100" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </motion.g>
        );
      case 'inverted-row':
        return (
          <motion.g>
            {/* Table */}
            <path d="M20 50 L80 50 M30 50 L30 90 M70 50 L70 90" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <motion.g animate={{ y: [20, 0, 20] }} transition={{ repeat: Infinity, duration: 2 }}>
              <circle cx="50" cy="65" r="5" fill="currentColor" />
              <line x1="20" y1="75" x2="80" y2="75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M50 75 L50 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </motion.g>
          </motion.g>
        );
      case 'jumping-jacks':
        return (
          <motion.g>
            <motion.circle 
              cx="50" cy="20" r="8" fill="currentColor"
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
            <motion.line 
              x1="50" y1="28" x2="50" y2="60" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
              animate={{ y1: [28, 33, 28], y2: [60, 65, 60] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
            {/* Arms */}
            <motion.path
              d="M50 35 L20 50"
              stroke="currentColor" strokeWidth="4" strokeLinecap="round"
              animate={{ d: ["M50 35 L20 50", "M50 35 L80 5", "M50 35 L20 50"] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
            <motion.path
              d="M50 35 L80 50"
              stroke="currentColor" strokeWidth="4" strokeLinecap="round"
              animate={{ d: ["M50 35 L80 50", "M50 35 L20 5", "M50 35 L80 50"] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
            {/* Legs */}
            <motion.path
              d="M50 60 L40 90"
              stroke="currentColor" strokeWidth="4" strokeLinecap="round"
              animate={{ d: ["M50 60 L40 90", "M50 60 L20 90", "M50 60 L40 90"] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
            <motion.path
              d="M50 60 L60 90"
              stroke="currentColor" strokeWidth="4" strokeLinecap="round"
              animate={{ d: ["M50 60 L60 90", "M50 60 L80 90", "M50 60 L60 90"] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          </motion.g>
        );
      case 'arm-circles':
        return (
          <motion.g>
            <circle cx="50" cy="25" r="8" fill="currentColor" />
            <line x1="50" y1="33" x2="50" y2="70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <motion.line 
              x1="50" y1="40" x2="85" y2="40" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
              animate={{ y2: [30, 50, 30] }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            <motion.line 
              x1="50" y1="40" x2="15" y2="40" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
              animate={{ y2: [50, 30, 50] }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            <line x1="50" y1="70" x2="40" y2="95" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="70" x2="60" y2="95" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </motion.g>
        );
      case 'mountain-climber':
      case 'dynamic-plank':
        return (
          <motion.g>
            <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
            <motion.g animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}>
              <line x1="20" y1="75" x2="80" y2="75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <circle cx="85" cy="70" r="5" fill="currentColor" />
              <line x1="75" y1="75" x2="75" y2="90" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              {/* Leg 1 */}
              <motion.path
                d="M20 75 L10 90"
                stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                animate={{ d: ["M20 75 L10 90", "M20 75 L40 70 L50 85", "M20 75 L10 90"] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
              />
              {/* Leg 2 */}
              <motion.path
                d="M20 75 L10 90"
                stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                animate={{ d: ["M20 75 L10 90", "M20 75 L40 70 L50 85", "M20 75 L10 90"] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
              />
            </motion.g>
          </motion.g>
        );
      case 'superman':
        return (
          <motion.g>
            <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <motion.g
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              {/* Body */}
              <line x1="30" y1="85" x2="70" y2="85" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              {/* Head */}
              <circle cx="75" cy="80" r="5" fill="currentColor" />
              {/* Arms */}
              <motion.path
                d="M70 85 L90 75"
                stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                animate={{ d: ["M70 85 L90 85", "M70 85 L95 65", "M70 85 L90 85"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
              {/* Legs */}
              <motion.path
                d="M30 85 L10 85"
                stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                animate={{ d: ["M30 85 L10 85", "M30 85 L5 65", "M30 85 L10 85"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
            </motion.g>
          </motion.g>
        );
      case 'dead-hang':
        return (
          <motion.g animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
            <line x1="20" y1="10" x2="80" y2="10" stroke="currentColor" strokeWidth="4" />
            <circle cx="50" cy="35" r="8" fill="currentColor" />
            <line x1="50" y1="43" x2="50" y2="75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <path d="M50 43 L40 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <path d="M50 43 L60 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="75" x2="40" y2="95" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="75" x2="60" y2="95" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </motion.g>
        );
      case 'cat-cow':
        return (
          <motion.g>
            <line x1="10" y1="95" x2="90" y2="95" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            {/* Legs */}
            <line x1="30" y1="80" x2="30" y2="95" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="70" y1="80" x2="70" y2="95" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            {/* Spine */}
            <motion.path
              d="M30 80 Q50 80 70 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: ["M30 80 Q50 60 70 80", "M30 80 Q50 100 70 80", "M30 80 Q50 60 70 80"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
            {/* Head */}
            <motion.circle 
              cx="75" cy="75" r="5" fill="currentColor"
              animate={{ y: [-5, 10, -5] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
          </motion.g>
        );
      case 'burpees':
        return (
          <motion.g>
            <motion.g
              animate={{ 
                y: [0, 40, 40, 40, 0, -30, 0],
                scaleY: [1, 0.6, 0.6, 0.6, 1, 1.2, 1]
              }}
              transition={{ repeat: Infinity, duration: 4, times: [0, 0.1, 0.3, 0.5, 0.7, 0.85, 1] }}
              style={{ originX: "50px", originY: "90px" }}
            >
              <circle cx="50" cy="20" r="8" fill="currentColor" />
              <line x1="50" y1="28" x2="50" y2="60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              {/* Arms */}
              <motion.path
                d="M50 40 L30 60"
                stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                animate={{ d: ["M50 40 L30 60", "M50 40 L40 80", "M50 40 L60 80", "M50 40 L30 60"] }}
                transition={{ repeat: Infinity, duration: 4, times: [0, 0.1, 0.5, 1] }}
              />
              {/* Legs */}
              <motion.path
                d="M50 60 L40 90"
                stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                animate={{ d: ["M50 60 L40 90", "M50 60 L10 80", "M50 60 L10 80", "M50 60 L40 90"] }}
                transition={{ repeat: Infinity, duration: 4, times: [0, 0.1, 0.5, 1] }}
              />
            </motion.g>
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
      <defs>
        <filter id={`glow-${rarity}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <g style={{ color: color, filter: rarity !== 'Common' ? `url(#glow-${rarity})` : 'none' }}>
        {renderAnimation()}
      </g>
    </svg>
  );
};
