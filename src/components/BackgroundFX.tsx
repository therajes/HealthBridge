import React from 'react';
import { motion } from 'framer-motion';

const BackgroundFX: React.FC = () => {
  return (
    <>
      {/* Premium particle background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-particles" />
      
      {/* Animated gradient orbs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute -top-20 -left-20 w-[50rem] h-[50rem] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary-glow) / 0.15) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute top-1/4 -right-32 w-[45rem] h-[45rem] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--secondary-glow) / 0.12) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1.1, 0.9, 1.1],
            opacity: [0.2, 0.5, 0.2],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
        
        <motion.div 
          className="absolute -bottom-32 left-1/3 w-[55rem] h-[55rem] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent-glow) / 0.1) 0%, transparent 70%)'
          }}
          animate={{
            scale: [0.9, 1.3, 0.9],
            opacity: [0.15, 0.4, 0.15],
            x: [-50, 50, -50]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10
          }}
        />
      </div>

      {/* Premium mesh gradient overlay */}
      <div 
        aria-hidden 
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, hsl(var(--primary) / 0.08), transparent),
            radial-gradient(ellipse 60% 80% at 80% 60%, hsl(var(--secondary) / 0.06), transparent),
            radial-gradient(ellipse 100% 60% at 40% 80%, hsl(var(--accent) / 0.05), transparent)
          `
        }}
      />
    </>
  );
};

export default BackgroundFX;
