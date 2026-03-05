"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

/* ═══════ INLINE SVG LOGO (from 45.svg) - Pure White Minimalist ═══════ */
function AnimatedAuroraLogo({
  className,
  splashMode = false,
  useGradient = false,
}: {
  className?: string;
  splashMode?: boolean;
  useGradient?: boolean;
}) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 375 375"
      className={className}
      initial={splashMode ? "hidden" : "visible"}
      animate="visible"
    // Luma Ray style: no colored drop shadows, just pure stark contrast
    >
      <defs>
        <linearGradient id="auroraSplashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%">
            <animate attributeName="stop-color" values="#ff6b35;#8b5cf6;#c850c0;#ff6b35" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%">
            <animate attributeName="stop-color" values="#f7c59f;#c850c0;#ff6b35;#f7c59f" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%">
            <animate attributeName="stop-color" values="#c850c0;#ff6b35;#8b5cf6;#c850c0" dur="4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      {/* Triangle */}
      <motion.path
        d="M191.97 101.25L283.79 261.51C284.71 263.13 284.71 265.11 283.78 266.72C282.85 268.33 281.13 269.32 279.27 269.32H95.73C93.87 269.32 92.15 268.33 91.21 266.72C90.28 265.11 90.28 263.13 91.2 261.51L183.02 101.25C183.94 99.64 185.65 98.65 187.5 98.65C189.34 98.65 191.05 99.64 191.97 101.25Z"
        fill="none"
        stroke={useGradient ? "url(#auroraSplashGrad)" : "#FFFFFF"} // Colored gradient or Pure white stroke
        strokeWidth="12" // Slightly thinner, elegant stroke
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 1.5, ease: [0.32, 0.72, 0, 1], delay: 0.2 },
          },
        }}
      />
      {/* Circle */}
      <motion.circle
        cx="187.5"
        cy="209.85"
        r="38.89"
        fill="none"
        stroke={useGradient ? "url(#auroraSplashGrad)" : "#FFFFFF"}
        strokeWidth="12"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 1.2, ease: [0.32, 0.72, 0, 1], delay: 0.8 },
          },
        }}
      />
    </motion.svg>
  );
}

/* ═══════ MINIMAL OS DETECTION ═══════ */
function useOS() {
  const [os, setOs] = useState<"mac" | "windows" | "linux" | "other">("other");
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("mac")) setOs("mac");
    else if (ua.includes("win")) setOs("windows");
    else if (ua.includes("linux")) setOs("linux");
  }, []);
  return os;
}

/* ═══════ MAIN COMPONENT ═══════ */
export default function Home() {
  const [splashDone, setSplashDone] = useState(false);
  const os = useOS();
  const { scrollYProgress, scrollY } = useScroll();
  const [navVisible, setNavVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setNavVisible(latest > 150);
  });

  // Scroll hint — only shows when idle at top
  const [showScrollHint, setShowScrollHint] = useState(false);
  useEffect(() => {
    if (!splashDone) return;
    let idleTimer: NodeJS.Timeout;
    let cycleInterval: NodeJS.Timeout;
    const startIdle = () => {
      idleTimer = setTimeout(() => {
        setShowScrollHint(true);
        // Cycle: show 2.5s, hide 2s, repeat
        cycleInterval = setInterval(() => {
          setShowScrollHint(prev => !prev);
        }, 2500);
      }, 3000);
    };
    const handleScroll = () => {
      setShowScrollHint(false);
      clearTimeout(idleTimer);
      clearInterval(cycleInterval);
      if (window.scrollY === 0) startIdle();
    };
    startIdle();
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(idleTimer);
      clearInterval(cycleInterval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [splashDone]);

  // Parallax effects for the main hero image
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Scroll-driven parallax for browser mockup section
  const browserSectionRef = useRef(null);
  const { scrollYProgress: browserScrollProgress } = useScroll({
    target: browserSectionRef,
    offset: ["start end", "end start"],
  });
  // Text starts visible, moves up as browser comes in
  const browserTextY = useTransform(browserScrollProgress, [0, 0.3, 0.5, 0.7], ["60px", "0px", "0px", "-40px"]);
  const browserTextOpacity = useTransform(browserScrollProgress, [0, 0.2, 0.5, 0.75], [0, 1, 1, 0.9]);
  // Browser mockup slides up from below
  const browserMockupY = useTransform(browserScrollProgress, [0, 0.25, 0.5], ["200px", "200px", "0px"]);

  const dlLabel =
    os === "mac"
      ? "Download for macOS"
      : os === "windows"
        ? "Download for Windows"
        : os === "linux"
          ? "Download for Linux"
          : "Download Engine";

  return (
    <>
      {/* ═╦════ SPLASH SCREEN (Monochromatic & Clean) ════╦═ */}
      <AnimatePresence>
        {!splashDone && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-[999] bg-black flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0, filter: "blur(30px)" }}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Subtle, pure white bloom */}
            <motion.div
              className="absolute w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 60%)",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1, 1.5], opacity: [0, 0.8, 0] }}
              transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
            />

            {/* Logo Container - just draw in, no zoom */}
            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 1, 1, 0] }}
              transition={{
                duration: 4,
                times: [0, 0.5, 0.8, 1],
                ease: "easeInOut",
              }}
              onAnimationComplete={() => {
                setTimeout(() => setSplashDone(true), 600);
              }}
            >
              <AnimatedAuroraLogo splashMode className="w-48 h-48 md:w-64 md:h-64" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ═╩═════════════════════════════════════════╩═ */}

      {/* ─── ULTRA-THIN NAVBAR (outside motion.main to avoid filter containing block) ─── */}
      <AnimatePresence>
        {navVisible && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 inset-x-0 z-[200] h-16 flex items-center justify-between px-6 md:px-12 bg-black/60 backdrop-blur-md border-b border-white/[0.05]"
          >
            <div className="flex items-center">
              <AnimatedAuroraLogo className="w-12 h-12 shrink-0" />
            </div>

            <div className="hidden md:flex items-center gap-8 text-[11px] font-semibold tracking-[0.15em] uppercase text-zinc-400">
              <a href="#" className="hover:text-white transition-colors">Engine</a>
              <a href="#" className="hover:text-white transition-colors">Agents</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
            </div>

            <button className="aurora-nav-btn h-8 px-4 rounded-full bg-white text-black text-[13px] font-bold transition-all duration-300 flex items-center gap-2">
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                {dlLabel}
              </span>
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ═╦════ MAIN SITE (Luma Ray Aesthetic) ════╦═ */}
      <motion.main
        initial={{ filter: "blur(20px)", opacity: 0 }}
        animate={splashDone ? { filter: "blur(0px)", opacity: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black overflow-x-hidden"
      >

        {/* ═══ CINEMATIC HERO SECTION ═══ */}
        <section className="relative w-full min-h-screen flex flex-col items-center pt-6 overflow-hidden">
          {/* AURORA — fills the full width, big and bold */}
          <motion.div
            style={{ y: textY }}
            initial={{ opacity: 0, y: 30 }}
            animate={splashDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
            className="w-full px-0 mt-4 md:mt-8 overflow-hidden"
          >
            <h1
              className="aurora-gradient-flow text-transparent font-black tracking-tighter leading-[0.9] text-center uppercase w-full"
              style={{
                fontSize: 'clamp(6rem, 22vw, 32rem)',
              }}
            >
              AURORA
            </h1>
          </motion.div>

          {/* Subtitle + CTA centered below AURORA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={splashDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
            style={{
              filter: useTransform(scrollYProgress, [0, 0.15], ["blur(0px)", "blur(20px)"]),
              opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0])
            }}
            className="relative z-10 flex flex-col items-center text-center px-6 mt-6 md:mt-10"
          >
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6 max-w-3xl">
              The internet&apos;s native intelligence layer.
            </h2>
            <p className="text-lg md:text-xl text-zinc-500 max-w-xl font-light leading-relaxed mb-10">
              Not just a browser. A fully private infrastructure with local AI agents that browse, research, and execute tasks autonomously.
            </p>

            {/* Download CTA with gradient glow on hover */}
            <button className="aurora-download-btn group relative bg-transparent border border-white/30 text-white px-8 py-4 rounded-full font-bold text-[15px] transition-all duration-500 hover:border-transparent flex items-center gap-2.5">
              {/* Apple logo */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              {dlLabel}
              {/* Gradient glow ring on hover */}
              <span className="aurora-glow-ring"></span>
            </button>
          </motion.div>

          {/* Scroll hint — mouse icon */}
          <AnimatePresence>
            {showScrollHint && (
              <motion.div
                initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
              >
                {/* Mouse icon */}
                <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
                  <motion.div
                    className="w-1 h-2 rounded-full bg-white/40"
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <span className="text-[10px] text-white/30 font-mono tracking-widest uppercase">Scroll</span>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ═══ SCROLL-DRIVEN BROWSER MOCKUP WITH PARALLAX ═══ */}
        <section ref={browserSectionRef} className="relative w-full pt-20 pb-32">
          {/* Parallax text — appears first, browser slides over it */}
          <motion.div
            style={{ y: browserTextY, opacity: browserTextOpacity }}
            className="flex flex-col items-center text-center relative z-10 mb-8"
          >
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl leading-tight px-6">
              The first browser with a{" "}
              <span className="aurora-gradient-flow text-transparent">private AI agent</span>{" "}
              built in.
            </h3>
          </motion.div>

          {/* Browser mockup — slides up from below */}
          <motion.div
            style={{ y: browserMockupY }}
            className="w-[90%] md:w-[85%] mx-auto relative rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="relative rounded-2xl overflow-hidden bg-[#111] border border-white/[0.05]">
              {/* Mac Window Chrome */}
              <div className="relative top-0 inset-x-0 h-10 bg-black/40 backdrop-blur-md border-b border-white/[0.05] flex items-center px-4 gap-2 z-20">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />

                {/* Search Bar */}
                <div className="absolute left-1/2 -translate-x-1/2 w-1/3 h-6 bg-white/[0.03] rounded-md border border-white/[0.05] flex items-center justify-center">
                  <span className="text-[10px] text-zinc-600 font-mono tracking-wider">Search or enter protocol</span>
                </div>
              </div>

              {/* Inner Browser Content */}
              <div className="aspect-[16/9] w-full relative bg-zinc-950 flex flex-col items-center justify-center pt-10">
                <AnimatedAuroraLogo className="w-20 h-20 opacity-20 mb-6" />
                <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="mt-8 grid grid-cols-3 gap-4 w-3/4 opacity-40">
                  <div className="h-24 rounded-lg bg-white/5" />
                  <div className="h-24 rounded-lg bg-white/5" />
                  <div className="h-24 rounded-lg bg-white/5" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ═══ PRIVACY-FIRST: IT RUNS LOCALLY ═══ */}
        <section className="py-32 px-6 md:px-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">It runs <br />locally.</h3>
            <p className="text-xl text-zinc-400 font-light leading-relaxed mb-6">
              Aurora processes your tabs, documents, and screen context entirely on-device. The AI understands your workflow perfectly without ever pinging a cloud server.
            </p>
            <p className="text-xl text-zinc-400 font-light leading-relaxed">
              Zero latency. Zero data extraction. Pure speed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="aspect-square bg-[#0a0a0a] rounded-[2rem] border border-white/[0.03] flex items-center justify-center overflow-hidden"
          >
            {/* Privacy shield with Aurora logo */}
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              {/* Pulsing secure field */}
              <motion.div
                className="absolute w-64 h-64 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)" }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Shield shape */}
              <motion.div
                className="relative z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <svg width="140" height="170" viewBox="0 0 140 170" fill="none">
                  {/* Shield outline */}
                  <motion.path
                    d="M70 10 L130 40 L130 90 C130 130 100 155 70 165 C40 155 10 130 10 90 L10 40 Z"
                    fill="none"
                    stroke="url(#shieldGrad)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  {/* Inner fill */}
                  <path
                    d="M70 10 L130 40 L130 90 C130 130 100 155 70 165 C40 155 10 130 10 90 L10 40 Z"
                    fill="rgba(74,222,128,0.03)"
                  />
                  <defs>
                    <linearGradient id="shieldGrad" x1="0" y1="0" x2="140" y2="170">
                      <stop offset="0%" stopColor="#4ade80" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#22c55e" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#4ade80" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Aurora logo centered in shield */}
                <div className="absolute inset-0 flex items-center justify-center pt-2">
                  <AnimatedAuroraLogo className="w-12 h-12" />
                </div>
              </motion.div>

              {/* Lock icon below shield */}
              <motion.div
                className="mt-6 flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <svg className="w-4 h-4 text-green-400/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <span className="text-xs text-green-400/70 font-mono tracking-wider uppercase">Encrypted on-device</span>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ═══ EMBEDDED AGENTS — ANIMATED BEAM STYLE ═══ */}
        <section className="py-32 px-6 md:px-20 max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center border-t border-white/[0.05]">
          {/* Left: Animated beam visualization */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="md:w-1/2 aspect-square bg-[#0a0a0a] rounded-[2rem] border border-white/[0.03] flex items-center justify-center overflow-hidden"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* SVG beams connecting nodes */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" fill="none">
                {/* Beam: User → Aurora */}
                <motion.path
                  d="M100 200 C150 200, 150 200, 200 200"
                  stroke="url(#beamGrad1)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                />
                {/* Beam: Aurora → Calendar */}
                <motion.path
                  d="M200 200 C250 200, 260 120, 310 120"
                  stroke="url(#beamGrad2)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                />
                {/* Beam: Aurora → Search */}
                <motion.path
                  d="M200 200 C250 200, 260 200, 310 200"
                  stroke="url(#beamGrad2)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.0, duration: 1, ease: "easeOut" }}
                />
                {/* Beam: Aurora → Export */}
                <motion.path
                  d="M200 200 C250 200, 260 280, 310 280"
                  stroke="url(#beamGrad2)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                />
                {/* Animated pulse dots traveling along beams */}
                <motion.circle r="3" fill="#8b5cf6"
                  animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  style={{ offsetPath: "path('M100 200 C150 200, 150 200, 200 200')" }}
                />
                <motion.circle r="3" fill="#c850c0"
                  animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 2.0 }}
                  style={{ offsetPath: "path('M200 200 C250 200, 260 120, 310 120')" }}
                />
                <motion.circle r="3" fill="#ff6b35"
                  animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 2.3 }}
                  style={{ offsetPath: "path('M200 200 C250 200, 260 200, 310 200')" }}
                />
                <motion.circle r="3" fill="#4ade80"
                  animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 2.6 }}
                  style={{ offsetPath: "path('M200 200 C250 200, 260 280, 310 280')" }}
                />
                <defs>
                  <linearGradient id="beamGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
                  </linearGradient>
                  <linearGradient id="beamGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c850c0" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Node: User (left) */}
              <motion.div
                className="absolute left-[16%] top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#111] border border-white/10 flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              >
                <svg className="w-5 h-5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </motion.div>

              {/* Node: Aurora (center) */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-orange-500/20 border border-white/15 flex items-center justify-center"
                  animate={{ boxShadow: ["0 0 20px rgba(139,92,246,0.1)", "0 0 40px rgba(139,92,246,0.2)", "0 0 20px rgba(139,92,246,0.1)"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <AnimatedAuroraLogo className="w-8 h-8" />
                </motion.div>
              </motion.div>

              {/* Node: Calendar (top-right) */}
              <motion.div
                className="absolute right-[16%] top-[22%] w-14 h-14 rounded-full bg-[#111] border border-white/10 flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
              >
                <svg className="w-5 h-5 text-orange-400/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </motion.div>

              {/* Node: Search (mid-right) */}
              <motion.div
                className="absolute right-[16%] top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#111] border border-white/10 flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.5, type: "spring" }}
              >
                <svg className="w-5 h-5 text-purple-400/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </motion.div>

              {/* Node: Export (bottom-right) */}
              <motion.div
                className="absolute right-[16%] bottom-[22%] w-14 h-14 rounded-full bg-[#111] border border-white/10 flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
              >
                <svg className="w-5 h-5 text-green-400/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="md:w-1/2"
          >
            <h3 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-white">Embedded <br />Agents.</h3>
            <p className="text-xl text-zinc-400 font-light leading-relaxed mb-6">
              Say &quot;get me clients&quot; and Aurora navigates LinkedIn, extracts profiles, and exports a spreadsheet. Say &quot;fix a meeting at 11 PM&quot; and it opens your calendar, creates the event, and sends reminders.
            </p>
            <p className="text-xl text-zinc-400 font-light leading-relaxed">
              No extensions. No copy-paste. Just tell it what you need and watch it work.
            </p>
          </motion.div>
        </section>

        {/* ═══ FOOTER CTA (Clean Luma Style) ═══ */}
        <section className="py-40 px-6 flex flex-col items-center text-center border-t border-white/[0.05]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <div className="aurora-logo-glow">
              <AnimatedAuroraLogo className="w-32 h-32 md:w-40 md:h-40" useGradient={true} />
            </div>
          </motion.div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-12">
            TAKE BACK THE WEB.
          </h2>
          <button className="aurora-download-btn group relative bg-transparent border border-white/30 text-white px-12 py-5 rounded-full font-bold text-lg transition-all duration-500 hover:border-transparent flex items-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            {dlLabel}
            <span className="aurora-glow-ring"></span>
          </button>
        </section>

        {/* ═══ FOOTER LINKS ═══ */}
        <footer className="py-8 px-6 border-t border-white/[0.05]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-semibold tracking-[0.1em] uppercase text-zinc-600">
            <div>
              <span>© {new Date().getFullYear()} Aurora OS</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </footer>

      </motion.main>
    </>
  );
}
