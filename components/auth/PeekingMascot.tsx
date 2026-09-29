"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PeekingMascotProps {
  isEmailFocused: boolean;
  emailLength: number;
  isPasswordFocused: boolean;
  showPassword: boolean;
  isSubmitting?: boolean;
  isError?: boolean;
}

export function PeekingMascot({
  isEmailFocused,
  emailLength,
  isPasswordFocused,
  showPassword,
  isSubmitting = false,
  isError = false,
}: PeekingMascotProps) {
  // Blinking cycle when eyes are visible
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (isPasswordFocused && !showPassword) return;

    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [isPasswordFocused, showPassword]);

  // Calculate pupil tracking based on email character length
  // Clamped between -4px (far left) and +5px (far right), looking down towards input (+2px to +4px)
  const maxChar = 32;
  const normalizedLen = Math.min(Math.max(emailLength, 0), maxChar) / maxChar;
  
  let eyeX = 0;
  let eyeY = 0;
  let headRotate = 0;

  if (isEmailFocused) {
    eyeX = -3 + normalizedLen * 8; // -3 to +5
    eyeY = 3.5; // looking down at the field
    headRotate = -2 + normalizedLen * 4;
  } else if (isPasswordFocused && showPassword) {
    // Peeking state: looking intently towards the password toggle
    eyeX = 5;
    eyeY = 2.5;
    headRotate = 3;
  } else if (isError) {
    eyeX = 0;
    eyeY = -2;
    headRotate = -4;
  } else if (isSubmitting) {
    eyeX = 0;
    eyeY = -1;
    headRotate = 0;
  }

  // Determine speech bubble / status text
  let statusText = "Ready to inspect";
  let statusEmoji = "✨";

  if (isSubmitting) {
    statusText = "Authenticating...";
    statusEmoji = "⏳";
  } else if (isError) {
    statusText = "Credentials didn't match!";
    statusEmoji = "🤔";
  } else if (isPasswordFocused && !showPassword) {
    statusText = "I'm not looking, promise!";
    statusEmoji = "🙈";
  } else if (isPasswordFocused && showPassword) {
    statusText = "Sneaky peek...";
    statusEmoji = "👀";
  } else if (isEmailFocused) {
    statusText = emailLength > 0 ? "Tracking input..." : "Type your address";
    statusEmoji = "✍️";
  }

  // Paw animation states
  // Resting: y: 220 (down off the face)
  // Covering eyes: Left paw -> y: 92, x: 80; Right paw -> y: 92, x: 140
  // Peeking: Left paw -> y: 92 (still covers left eye), Right paw -> y: 130, rotate: 22deg (drops down so right eye peeks)
  const isCovering = isPasswordFocused && !showPassword;
  const isPeeking = isPasswordFocused && showPassword;

  return (
    <div className="flex flex-col items-center select-none">
      {/* Speech bubble */}
      <div className="mb-3 h-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={statusText}
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-keyline shadow-xs text-[11px] font-mono font-medium text-ink tracking-tight"
          >
            <span>{statusEmoji}</span>
            <span>{statusText}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mascot Stage */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
        {/* Soft background aura */}
        <div className="absolute inset-0 rounded-full bg-accent-wash/60 blur-xl pointer-events-none" />

        <svg
          viewBox="0 0 220 220"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          {/* Defs for gradients & clip-paths */}
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2D2A26" />
              <stop offset="100%" stopColor="#1E1C1A" />
            </linearGradient>
            <linearGradient id="chestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FAF7F2" />
              <stop offset="100%" stopColor="#ECE6DC" />
            </linearGradient>
            <linearGradient id="pawGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3A3631" />
              <stop offset="100%" stopColor="#252320" />
            </linearGradient>
            <clipPath id="leftEyeClip">
              <ellipse cx="84" cy="100" rx="14" ry="16" />
            </clipPath>
            <clipPath id="rightEyeClip">
              <ellipse cx="136" cy="100" rx="14" ry="16" />
            </clipPath>
          </defs>

          {/* Shoulders / Torso */}
          <path
            d="M 45 220 C 45 168 70 152 110 152 C 150 152 175 168 175 220 Z"
            fill="url(#bodyGrad)"
          />
          {/* Chest Plate (Soft Cream) */}
          <path
            d="M 75 220 C 75 180 90 168 110 168 C 130 168 145 180 145 220 Z"
            fill="url(#chestGrad)"
          />

          {/* Safety Orange Inspector Tie / Badge */}
          <polygon
            points="110,166 116,182 110,196 104,182"
            fill="#e9551b"
          />
          <circle cx="110" cy="167" r="3.5" fill="#e9551b" />

          {/* Animated Head Group */}
          <motion.g
            animate={{
              rotate: headRotate,
              y: isSubmitting ? [0, -3, 0] : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 18,
            }}
            style={{ transformOrigin: "110px 120px" }}
          >
            {/* Left Ear */}
            <g>
              <circle cx="68" cy="66" r="19" fill="url(#bodyGrad)" />
              <circle cx="68" cy="66" r="11" fill="#e9551b" opacity="0.85" />
            </g>

            {/* Right Ear */}
            <g>
              <circle cx="152" cy="66" r="19" fill="url(#bodyGrad)" />
              <circle cx="152" cy="66" r="11" fill="#e9551b" opacity="0.85" />
            </g>

            {/* Head Base */}
            <rect
              x="52"
              y="58"
              width="116"
              height="96"
              rx="46"
              fill="url(#bodyGrad)"
            />

            {/* Face Muzzle (Cream) */}
            <ellipse
              cx="110"
              cy="120"
              rx="38"
              ry="26"
              fill="url(#chestGrad)"
            />

            {/* Nose */}
            <ellipse
              cx="110"
              cy="114"
              rx="6"
              ry="4"
              fill="#1E1C1A"
            />

            {/* Cute Mouth */}
            <path
              d={
                isError
                  ? "M 104 125 Q 110 121 116 125" // slightly puzzled wave
                  : "M 104 123 Q 110 128 116 123" // sweet smile
              }
              stroke="#1E1C1A"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Soft Blush on Cheeks */}
            <circle cx="72" cy="116" r="7" fill="#e9551b" opacity="0.25" />
            <circle cx="148" cy="116" r="7" fill="#e9551b" opacity="0.25" />

            {/* ===================== EYES ===================== */}

            {/* LEFT EYE */}
            <g>
              {/* White Sclera */}
              <ellipse
                cx="84"
                cy="100"
                rx="14"
                ry="16"
                fill="#FFFFFF"
                stroke="#1E1C1A"
                strokeWidth="1.5"
              />

              {/* Pupil + Catchlight (Masked within eyeball) */}
              <g clipPath="url(#leftEyeClip)">
                <motion.g
                  animate={{
                    x: eyeX,
                    y: eyeY,
                    scaleY: isBlinking ? 0.05 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                  }}
                  style={{ transformOrigin: "84px 100px" }}
                >
                  <circle cx="84" cy="100" r="7" fill="#141413" />
                  {/* Catchlight */}
                  <circle cx="82" cy="97" r="2.5" fill="#FFFFFF" />
                  <circle cx="86" cy="102" r="1.2" fill="#FFFFFF" opacity="0.7" />
                </motion.g>
              </g>

              {/* Eyelid Blink Cover */}
              <motion.ellipse
                cx="84"
                cy="100"
                rx="14"
                ry="16"
                fill="url(#bodyGrad)"
                initial={false}
                animate={{
                  scaleY: isBlinking ? 1 : 0,
                }}
                transition={{ duration: 0.12 }}
                style={{ transformOrigin: "84px 100px" }}
              />
            </g>

            {/* RIGHT EYE */}
            <g>
              {/* White Sclera */}
              <ellipse
                cx="136"
                cy="100"
                rx="14"
                ry="16"
                fill="#FFFFFF"
                stroke="#1E1C1A"
                strokeWidth="1.5"
              />

              {/* Pupil + Catchlight (Masked within eyeball) */}
              <g clipPath="url(#rightEyeClip)">
                <motion.g
                  animate={{
                    x: eyeX,
                    y: eyeY,
                    scaleY: isBlinking && !isPeeking ? 0.05 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                  }}
                  style={{ transformOrigin: "136px 100px" }}
                >
                  <circle cx="136" cy="100" r="7" fill="#141413" />
                  {/* Catchlight */}
                  <circle cx="134" cy="97" r="2.5" fill="#FFFFFF" />
                  <circle cx="138" cy="102" r="1.2" fill="#FFFFFF" opacity="0.7" />
                </motion.g>
              </g>

              {/* Eyelid Blink Cover */}
              <motion.ellipse
                cx="136"
                cy="100"
                rx="14"
                ry="16"
                fill="url(#bodyGrad)"
                initial={false}
                animate={{
                  scaleY: isBlinking && !isPeeking ? 1 : 0,
                }}
                transition={{ duration: 0.12 }}
                style={{ transformOrigin: "136px 100px" }}
              />
            </g>
          </motion.g>

          {/* ===================== PAWS / HANDS ===================== */}

          {/* LEFT PAW (Covers left eye on password focus) */}
          <motion.g
            initial={false}
            animate={{
              x: isCovering || isPeeking ? 0 : 0,
              y: isCovering || isPeeking ? -110 : 0,
              rotate: isCovering || isPeeking ? -12 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 240,
              damping: 20,
            }}
            style={{ transformOrigin: "84px 210px" }}
          >
            {/* Left Arm / Paw Base */}
            <path
              d="M 60 215 C 60 200 68 190 84 190 C 100 190 108 200 108 215 Z"
              fill="url(#pawGrad)"
              stroke="#1E1C1A"
              strokeWidth="1.5"
            />
            {/* Claws / Finger pads */}
            <circle cx="76" cy="198" r="2.5" fill="#e9551b" opacity="0.75" />
            <circle cx="84" cy="195" r="2.5" fill="#e9551b" opacity="0.75" />
            <circle cx="92" cy="198" r="2.5" fill="#e9551b" opacity="0.75" />
          </motion.g>

          {/* RIGHT PAW (Covers right eye or peeks down on toggle) */}
          <motion.g
            initial={false}
            animate={{
              x: isCovering ? 0 : isPeeking ? 12 : 0,
              y: isCovering ? -110 : isPeeking ? -65 : 0, // Lower down in peeking mode!
              rotate: isCovering ? 12 : isPeeking ? 34 : 0, // Tilted down away from eye!
            }}
            transition={{
              type: "spring",
              stiffness: isPeeking ? 280 : 240,
              damping: 20,
            }}
            style={{ transformOrigin: "136px 210px" }}
          >
            {/* Right Arm / Paw Base */}
            <path
              d="M 112 215 C 112 200 120 190 136 190 C 152 190 160 200 160 215 Z"
              fill="url(#pawGrad)"
              stroke="#1E1C1A"
              strokeWidth="1.5"
            />
            {/* Claws / Finger pads */}
            <circle cx="128" cy="198" r="2.5" fill="#e9551b" opacity="0.75" />
            <circle cx="136" cy="195" r="2.5" fill="#e9551b" opacity="0.75" />
            <circle cx="144" cy="198" r="2.5" fill="#e9551b" opacity="0.75" />
          </motion.g>
        </svg>
      </div>

      {/* Decorative Stage Plinth */}
      <div className="w-36 h-2 rounded-full bg-keyline-strong/30 blur-[1px] mt-1" />
    </div>
  );
}
