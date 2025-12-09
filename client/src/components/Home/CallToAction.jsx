import React, { useEffect, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const theme = {
  bg: '#faedcd',
  text: '#99582a',
  primary: '#bb9457',
  secondary: '#d4a373',
  surface: '#f8f1de',
};

const CallToAction = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background glow pulse
      gsap.to('.cta-glow', {
        scale: 1.2,
        opacity: 0.4,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });

      // Main content reveal - Fixed Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      tl.from('.cta-badge', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out"
      })
      .from('.cta-heading', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out"
      }, "-=0.4")
      .from('.cta-text', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6")
      .from('.cta-buttons', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4")
      .from('.cta-trust', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.3");

      // Floating animation for sparkles
      gsap.to('.cta-sparkle', {
        y: -10,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.3
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="cta"
      ref={sectionRef}
      className="relative py-32 px-6 md:px-16 lg:px-24 xl:px-40 overflow-hidden"
      style={{ backgroundColor: theme.secondary }}
    >
      {/* Animated Background Glow */}
      <div 
        className="cta-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: theme.primary }}
      />

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 cta-sparkle">
        <Sparkles size={32} style={{ color: theme.primary }} className="opacity-30" />
      </div>
      <div className="absolute bottom-10 right-10 cta-sparkle">
        <Sparkles size={24} style={{ color: theme.primary }} className="opacity-30" />
      </div>
      <div className="absolute top-1/3 right-1/4 cta-sparkle">
        <Sparkles size={20} style={{ color: theme.primary }} className="opacity-20" />
      </div>

      <div 
        ref={contentRef}
        className="max-w-5xl mx-auto text-center relative z-10"
      >
        {/* Badge */}
        <div className="cta-badge flex items-center justify-center gap-2 mb-8">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border hover:scale-105 transition-transform duration-300"
            style={{ 
              borderColor: theme.text,
              backgroundColor: 'rgba(250, 237, 205, 0.5)',
              color: theme.text
            }}
          >
            <Sparkles size={16} />
            <span className="text-sm font-bold uppercase tracking-wider">Ready to Transform?</span>
          </div>
        </div>

        {/* Main Heading with Hover Effect */}
        <h2 
          className="cta-heading text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
          style={{ color: theme.text }}
        >
          Start building your{" "}
          <span 
            className="italic block md:inline hover-text-scale"
            style={{ color: theme.primary }}
          >
            dream career
          </span>{" "}
          today
        </h2>

        {/* Description */}
        <p 
          className="cta-text text-lg md:text-xl max-w-2xl mx-auto mb-12 opacity-90 leading-relaxed"
          style={{ color: theme.text }}
        >
          Join thousands of professionals who've landed their dream jobs with AI-powered resumes. 
          Your success story starts here.
        </p>

        {/* CTA Buttons */}
        <div className="cta-buttons flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/app"
            className="group relative px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 hover-trigger transition-all duration-300 hover:scale-105 shadow-xl overflow-hidden"
            style={{ backgroundColor: theme.text, color: theme.bg }}
          >
            <span className="relative z-10">Start Building Free</span>
            <ArrowRight 
              size={20} 
              className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" 
            />
            {/* Hover Effect */}
            <div 
              className="absolute inset-0 translate-y-[101%] transition-transform duration-300 group-hover:translate-y-0"
              style={{ backgroundColor: theme.primary }}
            />
          </a>

          <button
            className="group px-10 py-5 rounded-full border-2 font-bold text-lg hover-trigger transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ 
              borderColor: theme.text, 
              color: theme.text,
              backgroundColor: 'transparent'
            }}
          >
            <span className="transition-transform duration-300 inline-block group-hover:scale-110">
              View Live Demo
            </span>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="cta-trust mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm opacity-80">
          <div className="flex items-center gap-2 hover:opacity-100 transition-opacity">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span style={{ color: theme.text }}>No credit card required</span>
          </div>
          <div className="flex items-center gap-2 hover:opacity-100 transition-opacity">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span style={{ color: theme.text }}>Free forever plan</span>
          </div>
          <div className="flex items-center gap-2 hover:opacity-100 transition-opacity">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span style={{ color: theme.text }}>Cancel anytime</span>
          </div>
        </div>
      </div>

      {/* Decorative Border Pattern */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 opacity-20"
        style={{ 
          background: `repeating-linear-gradient(90deg, ${theme.text} 0px, ${theme.text} 10px, transparent 10px, transparent 20px)`
        }}
      />

      {/* Enhanced Text Hover Animations */}
      <style>{`
        .hover-text-scale {
          display: inline-block;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .hover-text-scale:hover {
          transform: scale(1.08) translateY(-3px);
          text-shadow: 0 6px 12px rgba(187, 148, 87, 0.4);
        }
      `}</style>
    </section>
  );
};

export default CallToAction;