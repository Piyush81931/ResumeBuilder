import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Menu, X, Wand2, Target, BarChart3 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const theme = {
  bg: '#faedcd',
  text: '#99582a',
  primary: '#bb9457',
  secondary: '#d4a373',
  surface: '#f8f1de',
  border: '#d4a373'
};

const Hero = () => {
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  // GSAP Animation Setup
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Text Reveal - Matching reference timing
      const heroTl = gsap.timeline({ delay: 0.2 });
      
      heroTl.from('.hero-line', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
      })
      .from('.hero-fade', {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.8");

      // Feature Cards - One by one reveal
      gsap.utils.toArray('.feature-card').forEach((card, index) => {
        gsap.fromTo(card, 
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: index * 0.2, // Stagger delay
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Stats Counter Animation
      gsap.utils.toArray('.stat-number').forEach(stat => {
        ScrollTrigger.create({
          trigger: stat,
          start: "top 80%",
          onEnter: () => {
            const target = parseInt(stat.getAttribute('data-target'));
            gsap.to(stat, {
              innerText: target,
              duration: 2,
              snap: { innerText: 1 },
              ease: "power1.out"
            });
          },
          once: true
        });
      });

      // Marquee Animation (if you add it)
      if (document.querySelector('.marquee-track')) {
        gsap.to(".marquee-track", {
          xPercent: -50,
          ease: "none",
          duration: 20,
          repeat: -1
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="min-h-screen relative" style={{ backgroundColor: theme.bg }}>
        {/* Navbar */}
        <nav 
          className="fixed top-0 left-0 w-full z-50 flex items-center justify-between py-4 px-6 md:px-16 lg:px-24 xl:px-40 border-b backdrop-blur-md"
          style={{ 
            backgroundColor: 'rgba(250, 237, 205, 0.9)',
            borderColor: 'rgba(153, 88, 42, 0.1)'
          }}
        >
          <Link to="/" className="flex items-center gap-2 hover-trigger group">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
              style={{ backgroundColor: theme.primary }}
            >
              <Sparkles size={20} color="#fff" className="group-hover:animate-pulse" />
            </div>
            <span 
              className="text-2xl font-bold tracking-tight transition-colors"
              style={{ color: theme.text }}
            >
              ResumAI
            </span>
          </Link>

          <div 
            className="hidden md:flex items-center gap-8 text-sm font-medium"
            style={{ color: theme.text }}
          >
            {['Features', 'Testimonials', 'Contact'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="relative group hover-trigger opacity-80 hover:opacity-100 transition-opacity"
              >
                {item}
                <span 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" 
                  style={{ backgroundColor: theme.primary }}
                />
              </a>
            ))}
          </div>

          <div className="flex gap-3">
            {!user ? (
              <>
                <Link
                  to="/app?state=login"
                  className="hidden md:block px-6 py-2 rounded-full font-semibold text-sm transition-all hover-trigger hover:scale-105"
                  style={{ 
                    border: `1px solid ${theme.text}`,
                    color: theme.text,
                    backgroundColor: theme.surface
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/app?state=register"
                  className="hidden md:block px-6 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105 hover-trigger hover:shadow-[0_0_20px_rgba(187,148,87,0.4)]"
                  style={{ 
                    backgroundColor: theme.text,
                    color: theme.bg
                  }}
                >
                  Get Started
                </Link>
              </>
            ) : (
              <Link
                to="/app"
                className="hidden md:block px-8 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105 hover-trigger"
                style={{ 
                  backgroundColor: theme.primary,
                  color: '#fff'
                }}
              >
                Dashboard
              </Link>
            )}

            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden hover-trigger"
              style={{ color: theme.text }}
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ backgroundColor: theme.bg }}
        >
          <a href="#features" onClick={() => setMenuOpen(false)} style={{ color: theme.text }} className="hover-trigger">
            Features
          </a>
          <a href="#testimonials" onClick={() => setMenuOpen(false)} style={{ color: theme.text }} className="hover-trigger">
            Testimonials
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)} style={{ color: theme.text }} className="hover-trigger">
            Contact
          </a>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-3 rounded-full hover-trigger"
            style={{ backgroundColor: theme.text, color: theme.bg }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 md:px-16 lg:px-24 xl:px-40 overflow-hidden">
          {/* Glow Effects */}
          <div 
            className="absolute top-0 right-0 w-[60vw] h-[60vw] pointer-events-none blur-3xl"
            style={{ background: `radial-gradient(circle, rgba(187,148,87,0.15) 0%, transparent 70%)` }}
          />

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="hero-fade flex items-center gap-2 px-4 py-2 rounded-full border" style={{ borderColor: theme.secondary, color: theme.secondary }}>
                <Sparkles size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">AI-Powered Platform</span>
              </div>
            </div>

            {/* Main Heading with proper overflow hidden */}
            <div className="text-center mb-6">
              <div className="overflow-hidden">
                <h1 className="hero-line text-5xl md:text-7xl lg:text-8xl font-bold leading-tight" style={{ color: theme.text }}>
                  Craft your
                </h1>
              </div>
              <div className="overflow-hidden">
                <h1 className="hero-line text-5xl md:text-7xl lg:text-8xl font-bold italic" style={{ color: theme.primary }}>
                  dream career
                </h1>
              </div>
            </div>

            {/* Subtitle */}
            <p 
              className="hero-fade text-lg md:text-xl text-center max-w-2xl mx-auto mb-10 opacity-80"
              style={{ color: theme.text }}
            >
              AI-powered resume builder with instant enhancement, smart analysis, and job matching. 
              Stand out from the crowd.
            </p>

            {/* CTA Buttons with hover effects */}
            <div className="hero-fade flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/app"
                className="group relative px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover-trigger transition-transform hover:-translate-y-1 shadow-lg overflow-hidden"
                style={{ backgroundColor: theme.primary, color: '#fff' }}
              >
                <span className="relative z-10">Start Building Free</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div 
                  className="absolute inset-0 translate-y-[101%] transition-transform duration-300 group-hover:translate-y-0"
                  style={{ backgroundColor: theme.text }}
                />
              </Link>
              <button
                className="px-8 py-4 rounded-full border font-bold text-lg hover-trigger transition-all hover:scale-105"
                style={{ 
                  borderColor: theme.text, 
                  color: theme.text,
                  backgroundColor: theme.surface
                }}
              >
                View Demo
              </button>
            </div>

            {/* Stats */}
            <div className="hero-fade grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
              <div>
                <div className="stat-number text-3xl md:text-4xl font-bold" style={{ color: theme.primary }} data-target="10000">0</div>
                <p className="text-sm opacity-70" style={{ color: theme.text }}>Active Users</p>
              </div>
              <div>
                <div className="stat-number text-3xl md:text-4xl font-bold" style={{ color: theme.primary }} data-target="95">0</div>
                <p className="text-sm opacity-70" style={{ color: theme.text }}>Success Rate</p>
              </div>
              <div>
                <div className="stat-number text-3xl md:text-4xl font-bold" style={{ color: theme.primary }} data-target="50000">0</div>
                <p className="text-sm opacity-70" style={{ color: theme.text }}>Resumes Created</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="py-20 px-6 md:px-16 lg:px-24 xl:px-40">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16" style={{ color: theme.text }}>
              Powered by <span style={{ color: theme.primary }}>AI Intelligence</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* AI Enhance Feature */}
              <div 
                className="feature-card group p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover-trigger shadow-lg"
                style={{ backgroundColor: '#fff' }}
              >
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: theme.surface }}
                >
                  <Wand2 size={32} style={{ color: theme.primary }} className="group-hover:rotate-12 transition-transform" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-[#bb9457] transition-colors" style={{ color: theme.text }}>
                  AI Enhance
                </h3>
                <p className="opacity-70 leading-relaxed" style={{ color: theme.text }}>
                  Transform basic descriptions into powerful achievements. One click turns "managed team" into compelling results-driven content.
                </p>
              </div>

              {/* Resume Analyzer */}
              <div 
                className="feature-card group p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover-trigger shadow-lg"
                style={{ backgroundColor: '#fff' }}
              >
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: theme.surface }}
                >
                  <BarChart3 size={32} style={{ color: theme.primary }} className="group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-[#bb9457] transition-colors" style={{ color: theme.text }}>
                  Resume Analyzer
                </h3>
                <p className="opacity-70 leading-relaxed" style={{ color: theme.text }}>
                  Get instant scores, identify issues, and discover wins. Fix problems before recruiters see them with our smart analysis.
                </p>
              </div>

              {/* Job Tailor */}
              <div 
                className="feature-card group p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover-trigger shadow-lg"
                style={{ backgroundColor: '#fff' }}
              >
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: theme.surface }}
                >
                  <Target size={32} style={{ color: theme.primary }} className="group-hover:rotate-12 transition-transform" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-[#bb9457] transition-colors" style={{ color: theme.text }}>
                  AI Job Tailor
                </h3>
                <p className="opacity-70 leading-relaxed" style={{ color: theme.text }}>
                  Paste any job description. See what's missing. Auto-fix alignment issues. Get the perfect match every time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-12 px-6" style={{ backgroundColor: theme.secondary }}>
          <p className="text-center text-sm font-medium mb-6 opacity-80" style={{ color: theme.text }}>
            Trusted by professionals at leading companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto opacity-60">
            {[
              "https://saasly.prebuiltui.com/assets/companies-logo/instagram.svg",
              "https://saasly.prebuiltui.com/assets/companies-logo/framer.svg",
              "https://saasly.prebuiltui.com/assets/companies-logo/microsoft.svg",
              "https://saasly.prebuiltui.com/assets/companies-logo/huawei.svg",
              "https://saasly.prebuiltui.com/assets/companies-logo/walmart.svg",
            ].map((logo, i) => (
              <img key={i} src={logo} alt="company" className="h-6 grayscale hover:grayscale-0 transition-all hover:scale-110" />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Hero;