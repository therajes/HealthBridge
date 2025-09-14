import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RippleEffect {
  id: string;
  x: number;
  y: number;
}

const ClickRippleEffect: React.FC = () => {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Create ripple effect
      const rippleId = `ripple-${Date.now()}-${Math.random()}`;
      const newRipple: RippleEffect = {
        id: rippleId,
        x: e.clientX,
        y: e.clientY,
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== rippleId));
      }, 800);
    };

    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <>
      {/* Click Ripple Effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="click-ripple"
            style={{
              left: ripple.x - 100,
              top: ripple.y - 100,
            }}
            initial={{
              width: 0,
              height: 0,
              opacity: 0.6,
            }}
            animate={{
              width: 200,
              height: 200,
              opacity: 0,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            onAnimationComplete={() => {
              setRipples(prev => prev.filter(r => r.id !== ripple.id));
            }}
          />
        ))}
      </AnimatePresence>
    </>
  );
};

export default ClickRippleEffect;
