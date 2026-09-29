"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

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
  // Natural blinking cycle
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (isPasswordFocused && !showPassword) return;

    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3500 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [isPasswordFocused, showPassword]);

  // Caret tracking calculation
  const maxChar = 32;
  const normalizedLen = Math.min(Math.max(emailLength, 0), maxChar) / maxChar;

  // Eye tracking offsets
  let eyeX = 0;
  let eyeY = 0;

  if (isEmailFocused) {
    eyeX = -3 + normalizedLen * 8; // -3px to +5px
    eyeY = 3.5;
  } else if (isPasswordFocused && showPassword) {
    eyeX = 5;
    eyeY = 2;
  } else if (isError) {
    eyeX = 0;
    eyeY = -2;
  }

  // Animation states for the 4 characters
  const isCovered = isPasswordFocused && !showPassword;
  const isPeeking = isPasswordFocused && showPassword;

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* SVG Stage with 4 Characters */}
      <div className="relative w-full max-w-[420px] aspect-[16/11] flex items-center justify-center">
        {/* Soft atmospheric backlight */}
        <div className="absolute inset-4 rounded-[28px] bg-gradient-to-b from-accent-wash/80 to-transparent blur-2xl pointer-events-none" />

        <svg
          viewBox="0 0 380 250"
          className="w-full h-full drop-shadow-sm overflow-visible"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="char1Grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f0642f" />
              <stop offset="100%" stopColor="#d14b18" />
            </linearGradient>

            <linearGradient id="char2Grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2c2925" />
              <stop offset="100%" stopColor="#171614" />
            </linearGradient>

            <linearGradient id="char3Grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#ECE6DC" />
            </linearGradient>

            <linearGradient id="char4Grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59569" />
              <stop offset="100%" stopColor="#e37b4b" />
            </linearGradient>

            {/* Clip paths for pupil containment */}
            <clipPath id="c1LeftEyeClip">
              <ellipse cx="140" cy="118" rx="11" ry="13" />
            </clipPath>
            <clipPath id="c1RightEyeClip">
              <ellipse cx="174" cy="118" rx="11" ry="13" />
            </clipPath>

            <clipPath id="c2LeftEyeClip">
              <ellipse cx="64" cy="138" rx="8" ry="10" />
            </clipPath>
            <clipPath id="c2RightEyeClip">
              <ellipse cx="88" cy="138" rx="8" ry="10" />
            </clipPath>

            <clipPath id="c3LeftEyeClip">
              <ellipse cx="232" cy="132" rx="9" ry="11" />
            </clipPath>
            <clipPath id="c3RightEyeClip">
              <ellipse cx="260" cy="132" rx="9" ry="11" />
            </clipPath>

            <clipPath id="c4LeftEyeClip">
              <ellipse cx="316" cy="162" rx="9" ry="11" />
            </clipPath>
            <clipPath id="c4RightEyeClip">
              <ellipse cx="340" cy="162" rx="9" ry="11" />
            </clipPath>
          </defs>

          {/* ============================================================ */}
          {/* STAGE PEDESTAL / BASELINE                                     */}
          {/* ============================================================ */}
          <ellipse cx="190" cy="235" rx="175" ry="14" fill="#e5dfd3" opacity="0.6" />
          <line x1="20" y1="230" x2="360" y2="230" stroke="#d5cebf" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 6" />

          {/* ============================================================ */}
          {/* CHARACTER 2 (The Shy One - Round Dark Friend on Left)        */}
          {/* Reaction: Turns completely around when password hidden,      */}
          {/* Peeks sideways over shoulder when revealed.                  */}
          {/* ============================================================ */}
          <motion.g
            animate={{
              rotate: isCovered ? -40 : isPeeking ? 16 : isEmailFocused ? 6 : 0,
              x: isCovered ? -10 : isPeeking ? 6 : 0,
              y: isEmailFocused ? 2 : 0,
            }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            style={{ transformOrigin: "76px 190px" }}
          >
            {/* Cute Cat/Bear Ears */}
            <circle cx="56" cy="104" r="14" fill="url(#char2Grad)" />
            <circle cx="56" cy="104" r="7" fill="#f0642f" opacity="0.8" />
            <circle cx="96" cy="104" r="14" fill="url(#char2Grad)" />
            <circle cx="96" cy="104" r="7" fill="#f0642f" opacity="0.8" />

            {/* Round Body */}
            <ellipse cx="76" cy="155" rx="38" ry="45" fill="url(#char2Grad)" />

            {/* Back View (When covered, showing back of head) */}
            {isCovered ? (
              <g>
                {/* Back head texture / tuft */}
                <path d="M 72 108 Q 76 100 80 108" stroke="#3d3934" strokeWidth="2" fill="none" />
                <path d="M 68 116 Q 76 110 84 116" stroke="#3d3934" strokeWidth="2" fill="none" />
                {/* Sweat drop (embarrassed not looking) */}
                <path d="M 50 120 C 48 116 48 112 52 110 C 56 112 56 116 54 120 Z" fill="#60a5fa" opacity="0.8" />
              </g>
            ) : (
              /* Front View */
              <g>
                {/* Cream Belly Patch */}
                <ellipse cx="76" cy="172" rx="22" ry="24" fill="#FAF7F2" opacity="0.9" />

                {/* Left Eye */}
                <ellipse cx="64" cy="138" rx="8" ry="10" fill="#FFFFFF" stroke="#171614" strokeWidth="1.2" />
                <g clipPath="url(#c2LeftEyeClip)">
                  <motion.g
                    animate={{
                      x: isPeeking ? 4 : eyeX * 0.7,
                      y: isPeeking ? 1 : eyeY * 0.7,
                      scaleY: isBlinking && !isPeeking ? 0.1 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 280, damping: 20 }}
                    style={{ transformOrigin: "64px 138px" }}
                  >
                    <circle cx="64" cy="138" r="4.5" fill="#141413" />
                    <circle cx="62.5" cy="136" r="1.5" fill="#FFFFFF" />
                  </motion.g>
                </g>

                {/* Right Eye */}
                <ellipse cx="88" cy="138" rx="8" ry="10" fill="#FFFFFF" stroke="#171614" strokeWidth="1.2" />
                <g clipPath="url(#c2RightEyeClip)">
                  <motion.g
                    animate={{
                      x: isPeeking ? 4 : eyeX * 0.7,
                      y: isPeeking ? 1 : eyeY * 0.7,
                      scaleY: isBlinking && !isPeeking ? 0.1 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 280, damping: 20 }}
                    style={{ transformOrigin: "88px 138px" }}
                  >
                    <circle cx="88" cy="138" r="4.5" fill="#141413" />
                    <circle cx="86.5" cy="136" r="1.5" fill="#FFFFFF" />
                  </motion.g>
                </g>

                {/* Nose & Mouth */}
                <ellipse cx="76" cy="147" rx="3.5" ry="2.5" fill="#f0642f" />
                <path d="M 72 153 Q 76 156 80 153" stroke="#FAF7F2" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </g>
            )}
          </motion.g>

          {/* ============================================================ */}
          {/* CHARACTER 1 (Lead Inspector - Tall Orange Center-Left)        */}
          {/* Reaction: Both paws over eyes on password,                   */}
          {/* Drops right paw and peeks through fingers when revealed!      */}
          {/* ============================================================ */}
          <motion.g
            animate={{
              rotate: isEmailFocused ? -2 + normalizedLen * 5 : isPeeking ? 3 : 0,
              y: isEmailFocused ? 2 : 0,
            }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            style={{ transformOrigin: "157px 190px" }}
          >
            {/* Rounded Ears with Antenna */}
            <circle cx="132" cy="74" r="13" fill="url(#char1Grad)" />
            <circle cx="132" cy="74" r="7" fill="#FFFFFF" opacity="0.6" />
            <circle cx="182" cy="74" r="13" fill="url(#char1Grad)" />
            <circle cx="182" cy="74" r="7" fill="#FFFFFF" opacity="0.6" />
            {/* Little Tech Antenna */}
            <line x1="157" y1="70" x2="157" y2="52" stroke="#d14b18" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="157" cy="50" r="4.5" fill="#171614" />
            <circle cx="157" cy="50" r="2" fill="#f0642f" />

            {/* Tall Pill-shaped Body */}
            <rect x="117" y="68" width="80" height="145" rx="40" fill="url(#char1Grad)" />

            {/* Cream Face Mask */}
            <ellipse cx="157" cy="126" rx="30" ry="24" fill="#FAF7F2" />

            {/* Left Eye */}
            <ellipse cx="140" cy="118" rx="11" ry="13" fill="#FFFFFF" stroke="#d14b18" strokeWidth="1.5" />
            <g clipPath="url(#c1LeftEyeClip)">
              <motion.g
                animate={{
                  x: eyeX,
                  y: eyeY,
                  scaleY: isBlinking && !isPeeking ? 0.08 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                style={{ transformOrigin: "140px 118px" }}
              >
                <circle cx="140" cy="118" r="6" fill="#141413" />
                <circle cx="138" cy="115" r="2.2" fill="#FFFFFF" />
              </motion.g>
            </g>

            {/* Right Eye */}
            <ellipse cx="174" cy="118" rx="11" ry="13" fill="#FFFFFF" stroke="#d14b18" strokeWidth="1.5" />
            <g clipPath="url(#c1RightEyeClip)">
              <motion.g
                animate={{
                  x: eyeX,
                  y: eyeY,
                  scaleY: isBlinking && !isPeeking ? 0.08 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                style={{ transformOrigin: "174px 118px" }}
              >
                <circle cx="174" cy="118" r="6" fill="#141413" />
                <circle cx="172" cy="115" r="2.2" fill="#FFFFFF" />
              </motion.g>
            </g>

            {/* Cheerful Mouth / Expression */}
            <ellipse cx="157" cy="132" rx="4" ry="2.5" fill="#d14b18" />
            <path
              d={isError ? "M 151 140 Q 157 136 163 140" : "M 151 138 Q 157 143 163 138"}
              stroke="#141413"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Security Inspector Tie */}
            <polygon points="157,156 162,172 157,184 152,172" fill="#171614" />
            <circle cx="157" cy="156" r="3" fill="#171614" />

            {/* Paws: Left Paw */}
            <motion.g
              animate={{
                y: isCovered || isPeeking ? -74 : 0,
                rotate: isCovered || isPeeking ? -14 : 0,
              }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
              style={{ transformOrigin: "135px 195px" }}
            >
              <ellipse cx="135" cy="195" rx="11" ry="9" fill="#d14b18" stroke="#b74014" strokeWidth="1.2" />
              <circle cx="132" cy="193" r="1.5" fill="#f0642f" />
              <circle cx="136" cy="191" r="1.5" fill="#f0642f" />
              <circle cx="140" cy="193" r="1.5" fill="#f0642f" />
            </motion.g>

            {/* Paws: Right Paw (drops & angles when peeking!) */}
            <motion.g
              animate={{
                y: isCovered ? -74 : isPeeking ? -38 : 0,
                x: isPeeking ? 8 : 0,
                rotate: isCovered ? 14 : isPeeking ? 34 : 0,
              }}
              transition={{ type: "spring", stiffness: isPeeking ? 280 : 240, damping: 18 }}
              style={{ transformOrigin: "179px 195px" }}
            >
              <ellipse cx="179" cy="195" rx="11" ry="9" fill="#d14b18" stroke="#b74014" strokeWidth="1.2" />
              <circle cx="174" cy="193" r="1.5" fill="#f0642f" />
              <circle cx="178" cy="191" r="1.5" fill="#f0642f" />
              <circle cx="182" cy="193" r="1.5" fill="#f0642f" />
            </motion.g>
          </motion.g>

          {/* ============================================================ */}
          {/* CHARACTER 3 (Whistling Bot - Cream Square Center-Right)       */}
          {/* Reaction: Looks up at ceiling & whistles when password hidden, */}
          {/* Snaps eyes wide open staring right when revealed!             */}
          {/* ============================================================ */}
          <motion.g
            animate={{
              rotate: isCovered ? -16 : isPeeking ? 8 : isEmailFocused ? 4 : 0,
              y: isCovered ? -6 : 0,
            }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            style={{ transformOrigin: "246px 190px" }}
          >
            {/* Antenna with bouncy ball */}
            <line x1="246" y1="94" x2="246" y2="78" stroke="#2D2A26" strokeWidth="2" strokeLinecap="round" />
            <circle cx="246" cy="76" r="4.5" fill="#f0642f" />

            {/* Square Robot Body */}
            <rect
              x="214"
              y="94"
              width="64"
              height="100"
              rx="18"
              fill="url(#char3Grad)"
              stroke="#2D2A26"
              strokeWidth="2"
            />

            {/* Screen Visor Area */}
            <rect
              x="222"
              y="114"
              width="48"
              height="42"
              rx="10"
              fill="#2c2925"
            />

            {/* Whistling State (Looks UP & Whistles Notes!) */}
            {isCovered ? (
              <g>
                {/* Eyes Looking Straight Up */}
                <ellipse cx="234" cy="124" rx="4" ry="5" fill="#4ade80" />
                <ellipse cx="258" cy="124" rx="4" ry="5" fill="#4ade80" />

                {/* Whistling Mouth (Little "o") */}
                <circle cx="246" cy="142" r="3.5" fill="#f0642f" />

                {/* Animated Floating Musical Notes */}
                <motion.g
                  animate={{
                    y: [-4, -18],
                    x: [0, 8],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
                >
                  <text x="254" y="108" fontSize="13" fill="#f0642f" fontFamily="sans-serif">♪</text>
                </motion.g>
              </g>
            ) : (
              /* Regular / Peeking State */
              <g>
                {/* Left Digital Eye */}
                <ellipse cx="234" cy="132" rx="7" ry="9" fill="#FFFFFF" />
                <g clipPath="url(#c3LeftEyeClip)">
                  <motion.g
                    animate={{
                      x: isPeeking ? 5 : eyeX * 0.8,
                      y: isPeeking ? 1 : eyeY * 0.8,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ transformOrigin: "234px 132px" }}
                  >
                    <circle cx="234" cy="132" r="4.5" fill="#4ade80" />
                    <circle cx="233" cy="130" r="1.5" fill="#FFFFFF" />
                  </motion.g>
                </g>

                {/* Right Digital Eye */}
                <ellipse cx="258" cy="132" rx="7" ry="9" fill="#FFFFFF" />
                <g clipPath="url(#c3RightEyeClip)">
                  <motion.g
                    animate={{
                      x: isPeeking ? 5 : eyeX * 0.8,
                      y: isPeeking ? 1 : eyeY * 0.8,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ transformOrigin: "258px 132px" }}
                  >
                    <circle cx="258" cy="132" r="4.5" fill="#4ade80" />
                    <circle cx="257" cy="130" r="1.5" fill="#FFFFFF" />
                  </motion.g>
                </g>

                {/* Cute Digital Smirk */}
                <line x1="240" y1="146" x2="252" y2="146" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}

            {/* Little Feet */}
            <ellipse cx="230" cy="198" rx="8" ry="4" fill="#2D2A26" />
            <ellipse cx="262" cy="198" rx="8" ry="4" fill="#2D2A26" />
          </motion.g>

          {/* ============================================================ */}
          {/* CHARACTER 4 (Little Peeker - Petite Coral Friend on Right)   */}
          {/* Reaction: Paws cover face on password,                       */}
          {/* Lowers one paw to reveal giant sparkly peeking eye!           */}
          {/* ============================================================ */}
          <motion.g
            animate={{
              rotate: isEmailFocused ? 6 : isPeeking ? -6 : 0,
              y: isEmailFocused ? [0, -3, 0] : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 18,
            }}
            style={{ transformOrigin: "328px 210px" }}
          >
            {/* Sprout on Head */}
            <path d="M 328 128 Q 332 118 338 120 Q 332 125 328 128" fill="#10b981" />
            <path d="M 328 128 Q 322 120 318 124 Q 324 126 328 128" fill="#10b981" />

            {/* Chubby Pear Body */}
            <path
              d="M 304 218 C 298 178 310 134 328 134 C 346 134 358 178 352 218 Z"
              fill="url(#char4Grad)"
            />

            {/* Left Big Eye */}
            <ellipse cx="316" cy="162" rx="9" ry="11" fill="#FFFFFF" stroke="#b74014" strokeWidth="1.2" />
            <g clipPath="url(#c4LeftEyeClip)">
              <motion.g
                animate={{
                  x: eyeX * 0.9,
                  y: eyeY * 0.9,
                  scaleY: isBlinking && !isPeeking ? 0.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ transformOrigin: "316px 162px" }}
              >
                <circle cx="316" cy="162" r="5" fill="#141413" />
                <circle cx="314.5" cy="159.5" r="1.8" fill="#FFFFFF" />
              </motion.g>
            </g>

            {/* Right Big Eye */}
            <ellipse cx="340" cy="162" rx="9" ry="11" fill="#FFFFFF" stroke="#b74014" strokeWidth="1.2" />
            <g clipPath="url(#c4RightEyeClip)">
              <motion.g
                animate={{
                  x: isPeeking ? 4 : eyeX * 0.9,
                  y: isPeeking ? 1 : eyeY * 0.9,
                  scaleY: isBlinking && !isPeeking ? 0.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ transformOrigin: "340px 162px" }}
              >
                <circle cx="340" cy="162" r="5" fill="#141413" />
                <circle cx="338.5" cy="159.5" r="1.8" fill="#FFFFFF" />
                {/* Extra gleam when peeking */}
                {isPeeking && <circle cx="342" cy="164" r="1.2" fill="#FFFFFF" />}
              </motion.g>
            </g>

            {/* Rosy Cheeks */}
            <circle cx="308" cy="172" r="4.5" fill="#ef4444" opacity="0.3" />
            <circle cx="348" cy="172" r="4.5" fill="#ef4444" opacity="0.3" />

            {/* Tiny Mouth */}
            <ellipse cx="328" cy="172" rx="2.5" ry="1.5" fill="#b74014" />

            {/* Tiny Paws */}
            {/* Left Paw (Covers left eye when hidden or peeking) */}
            <motion.g
              animate={{
                y: isCovered || isPeeking ? -46 : 0,
                rotate: isCovered || isPeeking ? -16 : 0,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              style={{ transformOrigin: "314px 198px" }}
            >
              <circle cx="314" cy="198" r="6" fill="#e37b4b" stroke="#b74014" strokeWidth="1" />
            </motion.g>

            {/* Right Paw (Covers right eye when hidden, drops down when peeking!) */}
            <motion.g
              animate={{
                y: isCovered ? -46 : isPeeking ? -22 : 0,
                x: isPeeking ? 6 : 0,
                rotate: isCovered ? 16 : isPeeking ? 30 : 0,
              }}
              transition={{ type: "spring", stiffness: isPeeking ? 300 : 260, damping: 18 }}
              style={{ transformOrigin: "342px 198px" }}
            >
              <circle cx="342" cy="198" r="6" fill="#e37b4b" stroke="#b74014" strokeWidth="1" />
            </motion.g>
          </motion.g>
        </svg>
      </div>

      {/* Ground Shadow */}
      <div className="w-56 h-3 rounded-full bg-keyline-strong/30 blur-[2px] mt-1" />
    </div>
  );
}
