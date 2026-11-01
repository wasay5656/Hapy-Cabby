import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { NO_BUTTON_QUIPS } from '../data/constants';
import { playDodgeSound } from '../utils/audio';

interface DodgingNoButtonProps {
  arenaRef: React.RefObject<HTMLDivElement | null>;
  yesButtonRef?: React.RefObject<HTMLButtonElement | null>;
  onDodgeAttempt?: (count: number) => void;
  className?: string;
}

export const DodgingNoButton: React.FC<DodgingNoButtonProps> = ({
  arenaRef,
  yesButtonRef,
  onDodgeAttempt,
  className = '',
}) => {
  const [dodgeCount, setDodgeCount] = useState<number>(0);
  const [currentQuip, setCurrentQuip] = useState<string>('No');
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isWiggling, setIsWiggling] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Reset or re-bound on screen resize or orientation change
  useEffect(() => {
    const handleResize = () => {
      // If the button has already dodged, re-clamp to make sure it's within new viewport
      if (position && buttonRef.current && arenaRef.current) {
        const arenaRect = arenaRef.current.getBoundingClientRect();
        const btnRect = buttonRef.current.getBoundingClientRect();
        
        const maxX = arenaRect.width - btnRect.width - 24;
        const maxY = arenaRect.height - btnRect.height - 24;

        setPosition((prev) => {
          if (!prev) return null;
          return {
            x: Math.max(16, Math.min(prev.x, maxX)),
            y: Math.max(16, Math.min(prev.y, maxY)),
          };
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [position, arenaRef]);

  /**
   * Calculates a safe new coordinate that:
   * 1. Stays inside the container / viewport bounds with 20px padding
   * 2. Does NOT overlap the YES button (maintaining at least 40px buffer)
   * 3. Is at least 90px away from the current position so the escape is noticeable
   */
  const calculateSafeEscapeCoordinate = useCallback(() => {
    if (!arenaRef.current || !buttonRef.current) return { x: 0, y: 0 };

    const arenaRect = arenaRef.current.getBoundingClientRect();
    const btnRect = buttonRef.current.getBoundingClientRect();

    const btnWidth = btnRect.width || 120;
    const btnHeight = btnRect.height || 48;

    const minX = 16;
    const maxX = Math.max(minX, arenaRect.width - btnWidth - 16);
    const minY = 16;
    const maxY = Math.max(minY, arenaRect.height - btnHeight - 16);

    let yesRect: DOMRect | null = null;
    if (yesButtonRef?.current) {
      yesRect = yesButtonRef.current.getBoundingClientRect();
    }

    // Try multiple candidate points until we find one that does not overlap YES button
    for (let attempts = 0; attempts < 35; attempts++) {
      const candidateX = minX + Math.random() * (maxX - minX);
      const candidateY = minY + Math.random() * (maxY - minY);

      // Convert candidate to viewport space to check collision with YES button
      const candidateAbsoluteX = arenaRect.left + candidateX;
      const candidateAbsoluteY = arenaRect.top + candidateY;

      if (yesRect) {
        const buffer = 45;
        const overlapX =
          candidateAbsoluteX < yesRect.right + buffer &&
          candidateAbsoluteX + btnWidth > yesRect.left - buffer;
        const overlapY =
          candidateAbsoluteY < yesRect.bottom + buffer &&
          candidateAbsoluteY + btnHeight > yesRect.top - buffer;

        if (overlapX && overlapY) {
          continue; // Try again
        }
      }

      // Check distance from current position if it has already moved
      if (position) {
        const dx = candidateX - position.x;
        const dy = candidateY - position.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 70 && attempts < 30) {
          continue;
        }
      }

      return { x: candidateX, y: candidateY };
    }

    // Fallback: pick corner furthest from YES button
    if (yesRect) {
      const yesCenterX = yesRect.left + yesRect.width / 2;
      const arenaCenterX = arenaRect.left + arenaRect.width / 2;
      const targetX = yesCenterX > arenaCenterX ? minX : maxX;
      return { x: targetX, y: minY + Math.random() * 80 };
    }

    return { x: minX, y: minY };
  }, [arenaRef, yesButtonRef, position]);

  const triggerDodge = useCallback(
    (e?: React.SyntheticEvent | Event) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      playDodgeSound();

      const nextCount = dodgeCount + 1;
      setDodgeCount(nextCount);
      if (onDodgeAttempt) {
        onDodgeAttempt(nextCount);
      }

      // Choose a fun quip
      const quip = NO_BUTTON_QUIPS[(nextCount - 1) % NO_BUTTON_QUIPS.length];
      setCurrentQuip(quip);

      const nextCoord = calculateSafeEscapeCoordinate();
      setPosition(nextCoord);

      // Trigger brief wiggle
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 300);
    },
    [dodgeCount, onDodgeAttempt, calculateSafeEscapeCoordinate]
  );

  return (
    <>
      <motion.button
        ref={buttonRef}
        type="button"
        tabIndex={0}
        // Intercept touches and mouse hovers instantly before click
        onPointerDown={triggerDodge}
        onTouchStart={triggerDodge}
        onMouseEnter={triggerDodge}
        onFocus={triggerDodge}
        onClick={triggerDodge}
        aria-label="No button (playful dodging button)"
        className={`px-5 py-3 rounded-full text-sm font-semibold transition-colors shadow-sm select-none touch-none ${
          position
            ? 'absolute z-30 bg-rose-100 hover:bg-rose-200 text-rose-800 border-2 border-rose-300 shadow-md'
            : 'relative bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
        } ${isWiggling ? 'animate-wiggle' : ''} ${className}`}
        style={
          position
            ? {
                left: `${position.x}px`,
                top: `${position.y}px`,
              }
            : undefined
        }
        animate={
          position
            ? {
                scale: [1, 1.12, 1],
                rotate: shouldReduceMotion ? 0 : [0, -8, 8, -4, 0],
              }
            : {}
        }
        transition={{
          type: 'spring',
          stiffness: 450,
          damping: 25,
        }}
      >
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          {position ? currentQuip : 'No 🙈'}
        </span>
      </motion.button>

      {/* Floating Cheeky Counter badge when dodged at least 3 times */}
      {dodgeCount >= 2 && position && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-20 pointer-events-none text-xs font-semibold text-rose-600 bg-white/95 px-2.5 py-1 rounded-full shadow-sm border border-rose-200 backdrop-blur-xs"
          style={{
            left: `${Math.max(16, position.x - 10)}px`,
            top: `${Math.max(8, position.y - 28)}px`,
          }}
        >
          Dodged {dodgeCount}x! 💨
        </motion.div>
      )}
    </>
  );
};
