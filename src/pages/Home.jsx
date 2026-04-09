import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowDown, Phone, WhatsappLogo, Star, Quotes, CaretLeft, CaretRight,
  ShieldCheck, Eye, Lock, Lightbulb, Buildings, Rocket, CheckCircle, Target,
} from '@phosphor-icons/react';
import PageTransition from '../components/PageTransition';
import siteData from '../data/siteData';

const iconMap = { ShieldCheck, Eye, Lock, Lightbulb, Buildings, Rocket, Star, Target, CheckCircle };

function AnimatedCounter({ target, suffix = '', duration = 2.5 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const num = parseInt(String(target).replace(/[^0-9]/g, ''), 10) || 0;
  useEffect(() => {
    if (!inView) return;
    let s = 0; const inc = num / (duration * 60);
    const t = setInterval(() => { s += inc; if (s >= num) { setCount(num); clearInterval(t); } else setCount(Math.floor(s)); }, 1000/60);
    return () => clearInterval(t);
  }, [inView, num, duration]);
  return <span ref={ref}>{inView ? count.toLocaleString() : '0'}{suffix}</span>;
}

function NoiseTexture({ opacity = 0.035 }) {
  return <div className="absolute inset-0 pointer-events-none z-10" style={{ opacity, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }} />;
}

/* ================================================================
   SHIELD WATERMARK — giant SVG behind hero
   ================================================================ */
function ShieldWatermark() {
  return (
    <div className="absolute inset-0 flex items-center justify-end pr-[5%] pointer-events-none z-[2] opacity-[0.04]">
      <svg width="500" height="600" viewBox="0 0 100 120" fill="none">
        <path d="M50 5 L90 25 L90 65 C90 90 70 110 50 115 C30 110 10 90 10 65 L10 25 Z" stroke="#DC2626" strokeWidth="2" />
        <path d="M50 20 L75 35 L75 60 C75 80 65 95 50 100 C35 95 25 80 25 60 L25 35 Z" stroke="#DC2626" strokeWidth="1" />
        <path d="M38 55 L48 65 L65 45" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ================================================================
   1. HERO — Shield Watermark + Surveillance Grid + Red Alert
   ================================================================ */
function HeroSection() {
  const { business, hero } = siteData;
  const containerRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroImages = hero.backgroundImages.map(img => img.url);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % heroImages.length), 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <section ref={containerRef} className="relative h-screen min-h-[700px] overflow-hidden bg-navy-950">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <AnimatePresence mode="sync">
          <motion.img key={currentSlide} src={heroImages[currentSlide]} alt={hero.backgroundImages[currentSlide]?.alt}
            className="absolute inset-0 w-full h-[130%] object-cover object-center"
            initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }} loading="eager" />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/85 via-navy-950/60 to-navy-950/95 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/80 via-transparent to-navy-950/40 z-[1]" />
      </motion.div>

      <ShieldWatermark />

      {/* Surveillance grid lines */}
      <div className="absolute inset-0 z-[3] pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      {/* Red alert pulse top bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-30">
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}
          className="h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>

      <div className="absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
        {heroImages.map((_, i) => (
          <button key={i} onClick={() => setCurrentSlide(i)}
            className={`w-[3px] transition-all duration-700 ${i === currentSlide ? 'h-10 bg-blue-500' : 'h-4 bg-white/20 hover:bg-white/40'}`} aria-label={`Slide ${i+1}`} />
        ))}
      </div>

      <NoiseTexture opacity={0.03} />
      <div className="absolute top-[15%] left-0 w-[2px] h-32 sm:h-48 bg-gradient-to-b from-transparent via-blue-500 to-transparent z-20" />

      <motion.div className="relative z-20 flex flex-col justify-center h-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-36" style={{ y: textY, opacity }}>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.3 }}
          className="w-16 h-[2px] bg-gradient-to-r from-blue-500 to-blue-400/50 mb-6 origin-left" />

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="text-blue-400 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
          {hero.badge}
        </motion.p>

        <div className="overflow-hidden">
          {(hero.titleParts || []).map((part, i) => (
            <motion.div key={i} initial={{ y: '110%' }} animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}>
              <h1 className={`font-heading leading-[0.92] tracking-tight ${part.highlight ? 'bg-gradient-to-r from-blue-500 via-red-400 to-blue-600 bg-clip-text text-transparent' : 'text-white'}`}
                style={{ fontSize: 'clamp(2.2rem, 7vw, 4.5rem)', fontWeight: part.highlight ? 700 : 300 }}>
                {part.text}
              </h1>
            </motion.div>
          ))}
        </div>

        {/* 24/7 Monitoring Badge */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 1 }}
          className="flex items-center gap-3 mt-8 bg-blue-500/10 border border-blue-500/20 px-4 py-2.5 w-fit">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
            <motion.div animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 w-2.5 h-2.5 bg-blue-500 rounded-full" />
          </div>
          <span className="text-blue-400/80 text-xs uppercase tracking-[0.2em] font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>99.9% Uptime</span>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.2 }}
          className="flex items-center gap-3 mt-4">
          <div className="w-8 h-[1px] bg-blue-500/40" />
          <p className="text-white/30 text-xs sm:text-sm uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-sans)' }}>
            {business.projectsCompleted} Systems &middot; {business.yearsExperience} Years &middot; Harare
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.4 }}
          className="flex flex-wrap gap-4 mt-10">
          <Link to="/contact" className="group inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 text-sm uppercase tracking-[0.15em] font-semibold hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-500" style={{ fontFamily: 'var(--font-sans)' }}>
            {hero.ctaPrimary} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/projects" className="group inline-flex items-center gap-3 border border-white/20 text-white px-8 py-4 text-sm uppercase tracking-[0.15em] font-semibold hover:border-blue-500/50 hover:text-blue-400 hover:bg-white/5 transition-all duration-500" style={{ fontFamily: 'var(--font-sans)' }}>
            {hero.ctaSecondary}
          </Link>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-white/20 text-[10px] uppercase tracking-[0.3em]" style={{ fontFamily: 'var(--font-sans)' }}>Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ArrowDown size={14} className="text-blue-500/40" />
        </motion.div>
      </motion.div>

      <div className="hidden lg:flex absolute right-8 bottom-12 z-20">
        <span className="text-white/10 text-[10px] uppercase tracking-[0.4em]" style={{ writingMode: 'vertical-rl', fontFamily: 'var(--font-sans)' }}>
          {business.name} &mdash; {business.city}
        </span>
      </div>
    </section>
  );
}

/* ================================================================
   2. EMERGENCY HOTLINE STRIP
   ================================================================ */
function EmergencyStrip() {
  const { business } = siteData;
  return (
    <section className="relative bg-blue-600 py-4 overflow-hidden z-10">
      <NoiseTexture opacity={0.04} />
      <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-3 h-3 bg-white rounded-full" />
          <span className="text-white text-xs sm:text-sm font-bold uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-sans)' }}>Tech Support 24/7</span>
        </div>
        <a href={`tel:${business.phone}`} className="flex items-center gap-2 bg-white text-red-600 px-5 py-2 text-sm font-bold uppercase tracking-[0.1em] hover:bg-blue-50 transition-colors" style={{ fontFamily: 'var(--font-sans)' }}>
          <Phone size={16} weight="fill" /> {business.phone}
        </a>
      </div>
    </section>
  );
}

/* ================================================================
   3. MARQUEE
   ================================================================ */
function MarqueeTicker() {
  const items = ['WEB DEV', 'CLOUD', 'CYBERSEC', 'IT SUPPORT', 'NETWORKING', 'SOFTWARE', 'ANALYTICS'];
  const repeated = [...items, ...items, ...items, ...items];
  return (
    <section className="bg-navy-950 border-y border-blue-500/10 py-5 sm:py-6 overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-6 sm:gap-8 mx-6 sm:mx-8">
            <span className="text-blue-500/50 font-heading text-lg sm:text-2xl tracking-wider">{item}</span>
            <span className="text-blue-500/15 text-sm">&diams;</span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* ================================================================
   4. SERVICES — Surveillance-feel grid with camera corners
   ================================================================ */
function ServicesGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { servicesPreview, services } = siteData;
  const imgs = [
    'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80',
    'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80',
    'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  ];

  return (
    <section ref={ref} className="bg-navy-900 py-24 sm:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="mb-14 sm:mb-20">
          <div className="w-12 h-[2px] bg-blue-500 mb-6" />
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="text-blue-500/60 text-xs uppercase tracking-[0.3em] mb-3" style={{ fontFamily: 'var(--font-sans)' }}>Tech Solutions</p>
              <h2 className="font-heading text-white leading-[0.92]" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
                Complete <span className="text-blue-500">Protection</span>
              </h2>
            </div>
            <Link to="/services" className="group text-white/30 text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:text-blue-500 transition-colors" style={{ fontFamily: 'var(--font-sans)' }}>
              All Services <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {servicesPreview.map((service, i) => {
            const Icon = iconMap[service.icon] || ShieldCheck;
            return (
              <motion.div key={service.title} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.08 * i }} className={i === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}>
                <Link to={`/services#${services?.items?.[i]?.slug || ''}`}
                  className={`group relative block overflow-hidden ${i === 0 ? 'aspect-[16/9] sm:aspect-[2/1]' : 'aspect-[3/4]'}`}>
                  <img src={imgs[i]} alt={service.title} className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-950/20 opacity-90" />

                  {/* Camera corners */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-blue-500/40 z-10" />
                  <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-blue-500/40 z-10" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-blue-500/40 z-10" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-blue-500/40 z-10" />

                  {i === 0 && (
                    <div className="absolute top-5 right-8 z-10 flex items-center gap-2">
                      <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-blue-500 text-[10px] font-mono uppercase tracking-wider">REC</span>
                    </div>
                  )}

                  <div className="absolute top-5 left-5 z-10 w-10 h-10 bg-blue-600 flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-500">
                    <Icon size={18} weight="fill" className="text-white" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
                    <h3 className="font-heading text-white text-xl sm:text-2xl tracking-wide mb-2">{service.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>{service.desc}</p>
                    <div className="flex items-center gap-2 mt-3 text-blue-500 group-hover:translate-x-1 transition-transform duration-300">
                      <span className="text-xs uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-sans)' }}>Explore</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-blue-400 z-10" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   5. PORTFOLIO — Horizontal scroll
   ================================================================ */
function PortfolioGallery() {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: '-80px' });
  const { projects } = siteData;
  return (
    <section ref={containerRef} className="bg-navy-950 py-24 sm:py-32 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 mb-12 sm:mb-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <div className="w-12 h-[2px] bg-blue-500 mb-6" />
            <p className="text-blue-500/60 text-xs uppercase tracking-[0.3em] mb-3" style={{ fontFamily: 'var(--font-sans)' }}>Deployments</p>
            <h2 className="font-heading text-white leading-[0.92]" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>Our <span className="text-blue-500">Portfolio</span></h2>
          </div>
          <Link to="/projects" className="group text-white/30 text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:text-blue-500 transition-colors" style={{ fontFamily: 'var(--font-sans)' }}>
            View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.2 }}>
        <div className="flex gap-4 sm:gap-5 overflow-x-auto px-5 sm:px-8 lg:px-12 pb-4" style={{ scrollbarWidth: 'none' }}>
          {projects.items.map((project) => (
            <div key={project.slug} className="group relative flex-shrink-0 w-[300px] sm:w-[360px] lg:w-[420px] overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden relative">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/40 transition-colors duration-700" />
                <div className="absolute top-5 left-5 z-10">
                  <span className="bg-blue-600 text-white text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>{project.category}</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent">
                <h4 className="text-white font-heading text-lg sm:text-xl tracking-wide">{project.title}</h4>
                <p className="text-white/40 text-xs mt-1 uppercase tracking-wider" style={{ fontFamily: 'var(--font-sans)' }}>{project.location}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ================================================================
   6. STATS
   ================================================================ */
function StatsBand() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const { stats } = siteData;
  return (
    <section ref={ref} className="relative bg-navy-950 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 sm:py-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12 }} className="text-center relative">
              <div className="font-heading text-blue-500 leading-none" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', textShadow: '0 0 40px rgba(59,130,246,0.15)' }}>
                <AnimatedCounter target={String(stat.number).replace(/[^0-9]/g, '')} suffix={String(stat.number).replace(/[0-9]/g, '')} />
              </div>
              <div className="text-white/30 text-xs sm:text-sm uppercase tracking-[0.25em] mt-3" style={{ fontFamily: 'var(--font-sans)' }}>{stat.label}</div>
              {i < stats.length - 1 && <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-[1px] bg-gradient-to-b from-transparent via-blue-500/15 to-transparent" />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   7. ABOUT — Split with image collage
   ================================================================ */
function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { business } = siteData;
  return (
    <section ref={ref} className="bg-navy-950 py-24 sm:py-32 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9 }}>
            <div className="w-12 h-[2px] bg-blue-500 mb-6" />
            <p className="text-blue-500/60 text-xs uppercase tracking-[0.3em] mb-3" style={{ fontFamily: 'var(--font-sans)' }}>About Us</p>
            <h2 className="font-heading text-white leading-[0.95] mb-8" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              The {business.name}<br /><span className="text-blue-500">Story</span>
            </h2>
            <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-6 max-w-lg" style={{ fontFamily: 'var(--font-sans)' }}>
              Founded in {business.established} with a mission to bring world-class security technology to Zimbabwe. What started as a small electronics shop has grown into Harare's most trusted security solutions provider, protecting homes, businesses, and institutions across the nation.
            </p>
            <p className="text-white/35 text-sm leading-relaxed max-w-lg" style={{ fontFamily: 'var(--font-sans)' }}>
              With over {business.projectsCompleted} systems installed and a team of {business.employees} certified technicians, we deliver comprehensive security solutions backed by 24/7 monitoring and rapid response.
            </p>
            <div className="w-full h-px bg-white/5 my-8" />
            <div className="flex gap-10 sm:gap-16">
              {[{ val: business.established, lbl: 'Founded' }, { val: business.projectsCompleted, lbl: 'Delivered' }, { val: business.employees, lbl: 'Engineers' }].map(s => (
                <div key={s.lbl}>
                  <div className="text-blue-500 font-heading text-3xl sm:text-4xl leading-none">{s.val}</div>
                  <div className="text-white/30 text-[10px] uppercase tracking-[0.2em] mt-2" style={{ fontFamily: 'var(--font-sans)' }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, delay: 0.2 }} className="relative">
            <div className="relative">
              <div className="overflow-hidden">
                <img src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80" alt={`${business.name} security installation`}
                  className="w-full aspect-[4/5] object-cover object-center" loading="lazy" />
              </div>
              <div className="absolute -bottom-8 -left-6 sm:-left-10 w-[45%] overflow-hidden border-4 border-navy-950 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80" alt="CCTV system" className="w-full aspect-square object-cover object-center" loading="lazy" />
              </div>
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-blue-600 text-white p-5 sm:p-7 shadow-2xl">
                <div className="text-center">
                  <div className="font-heading text-xs uppercase tracking-[0.2em] leading-none" style={{ fontFamily: 'var(--font-sans)' }}>Est.</div>
                  <div className="font-heading text-3xl sm:text-4xl leading-none mt-1">{business.established}</div>
                </div>
              </div>
              <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-blue-500/30" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   8. WHY CHOOSE US
   ================================================================ */
function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { business } = siteData;
  const points = [
    { title: 'Certified Engineers', desc: 'Factory-trained engineers with international certifications in CCTV, access control, and alarm system installation.' },
    { title: '24/7 Monitoring Centre', desc: 'Our dedicated control room operates around the clock, providing instant alerts and emergency response coordination.' },
    { title: 'Integrated Solutions', desc: 'Every system works together seamlessly — cameras, alarms, access control, and fencing in one unified platform.' },
    { title: 'Rapid Response', desc: 'Average response time under 15 minutes in Harare. Emergency teams on standby day and night.' },
  ];
  return (
    <section ref={ref} className="bg-navy-900 py-24 sm:py-32 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9 }} className="relative">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" alt="Monitoring centre" className="w-full aspect-[4/5] object-cover object-center" loading="lazy" />
            <div className="absolute -top-3 -left-3 w-20 h-20 border-t-2 border-l-2 border-blue-500/40" />
            <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b-2 border-r-2 border-blue-500/40" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, delay: 0.15 }}>
            <div className="w-12 h-[2px] bg-blue-500 mb-6" />
            <p className="text-blue-500/60 text-xs uppercase tracking-[0.3em] mb-3" style={{ fontFamily: 'var(--font-sans)' }}>The Difference</p>
            <h2 className="font-heading text-white leading-[0.95] mb-12" style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
              Why Choose <span className="text-blue-500">{business.name}</span>
            </h2>
            <div className="space-y-8">
              {points.map((point, i) => (
                <motion.div key={point.title} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }} className="flex gap-5">
                  <div className="shrink-0 mt-1"><div className="w-8 h-8 bg-blue-600 flex items-center justify-center"><CheckCircle size={16} weight="fill" className="text-white" /></div></div>
                  <div>
                    <h4 className="font-heading text-white text-base sm:text-lg tracking-wide mb-1">{point.title}</h4>
                    <p className="text-white/40 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>{point.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   9. TESTIMONIALS
   ================================================================ */
function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const { homeTestimonials } = siteData;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const next = useCallback(() => setActive(p => (p + 1) % homeTestimonials.length), [homeTestimonials.length]);
  const prev = useCallback(() => setActive(p => (p - 1 + homeTestimonials.length) % homeTestimonials.length), [homeTestimonials.length]);
  useEffect(() => { const t = setInterval(next, 7000); return () => clearInterval(t); }, [next]);
  const t = homeTestimonials[active];
  return (
    <section ref={ref} className="relative bg-navy-950 py-24 sm:py-32 lg:py-40 overflow-hidden">
      <NoiseTexture opacity={0.02} />
      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center">
          <Quotes size={48} weight="fill" className="text-blue-500/15 mx-auto mb-8" />
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
              <blockquote className="text-white text-lg sm:text-xl lg:text-2xl leading-relaxed font-heading mb-10">&ldquo;{t.text}&rdquo;</blockquote>
              <div className="flex flex-col items-center gap-3">
                {t.avatar && <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover object-center border-2 border-blue-500/30" loading="lazy" />}
                <div className="w-8 h-[2px] bg-blue-500" />
                <div className="text-white text-sm uppercase tracking-[0.15em] font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>{t.name}</div>
                <div className="text-white/40 text-xs uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-sans)' }}>{t.role}</div>
                <div className="flex items-center gap-0.5 mt-1">{[...Array(t.rating)].map((_, i) => <Star key={i} size={12} weight="fill" className="text-blue-500" />)}</div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-center gap-6 mt-12">
            <button onClick={prev} className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/30 hover:text-blue-500 hover:border-blue-500/30 transition-colors" aria-label="Previous"><CaretLeft size={16} /></button>
            <div className="flex gap-2">{homeTestimonials.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} className={`h-[2px] transition-all duration-500 ${i === active ? 'w-10 bg-blue-500' : 'w-3 bg-white/10 hover:bg-white/25'}`} aria-label={`Testimonial ${i+1}`} />
            ))}</div>
            <button onClick={next} className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/30 hover:text-blue-500 hover:border-blue-500/30 transition-colors" aria-label="Next"><CaretRight size={16} /></button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================
   10. CTA — Full-bleed BG
   ================================================================ */
function CTASection() {
  const { business } = siteData;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section ref={ref} className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      <img src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=1920&q=80" alt="Security systems" className="absolute inset-0 w-full h-full object-cover object-center" loading="lazy" />
      <div className="absolute inset-0 bg-navy-950/70" />
      <NoiseTexture opacity={0.03} />
      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9 }}>
          <div className="w-12 h-[2px] bg-blue-500 mx-auto mb-6" />
          <h2 className="font-heading text-white leading-[0.95] mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Protect What <span className="text-blue-500">Matters Most</span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-10" style={{ fontFamily: 'var(--font-sans)' }}>
            Get a free security assessment from {business.name}. Our team will evaluate your property and recommend the ideal security package for your needs and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="group inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 text-sm uppercase tracking-[0.15em] font-semibold hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-500" style={{ fontFamily: 'var(--font-sans)' }}>
              Free Consultation <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 border border-white/20 text-white px-8 py-4 text-sm uppercase tracking-[0.15em] font-semibold hover:border-green-500/50 hover:text-green-400 hover:bg-white/5 transition-all duration-500" style={{ fontFamily: 'var(--font-sans)' }}>
              <WhatsappLogo size={18} /> WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================
   HOME PAGE
   ================================================================ */
export default function Home() {
  return (
    <PageTransition>
      <HeroSection />
      <EmergencyStrip />
      <MarqueeTicker />
      <ServicesGrid />
      <PortfolioGallery />
      <StatsBand />
      <AboutSection />
      <WhyChooseUs />
      <TestimonialsSection />
      <CTASection />
    </PageTransition>
  );
}
