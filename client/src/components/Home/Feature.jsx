import React, { useEffect, useRef } from "react";
import { Sparkles, Wand2, Layout, Download } from "lucide-react";
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

const Feature = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Badge Animation
      gsap.from('.feature-badge', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Title Animation
      gsap.from('.feature-title', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.feature-title',
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      // Image Parallax (Fixed)
      gsap.to('.feature-image', {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: '.feature-image-container',
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Feature Cards - Fixed Sequential Animation (ONE BY ONE)
      const featureCards = gsap.utils.toArray('.feature-card');
      
      featureCards.forEach((card, i) => {
        gsap.fromTo(card, 
          { 
            opacity: 0, 
            x: -50 
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse"
            },
            // This ensures cards appear ONE BY ONE with delay
            delay: i * 0.15
          }
        );
      });

      // Floating Animation for Icons
      gsap.utils.toArray('.feature-icon').forEach((icon) => {
        gsap.to(icon, {
          y: -8,
          duration: 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <Wand2 size={24} />,
      title: "AI-Powered Enhancement",
      description: "Transform basic bullet points into powerful achievements with one click. Our AI analyzes and enhances your content.",
      color: theme.primary
    },
    {
      icon: <Layout size={24} />,
      title: "Live Preview Editor",
      description: "See changes instantly with split-screen editing. Choose templates, customize colors, and export professional PDFs.",
      color: theme.secondary
    },
    {
      icon: <Download size={24} />,
      title: "Smart Export & Analysis",
      description: "Download ATS-optimized resumes. Get instant scoring, identify issues, and match against job descriptions.",
      color: theme.primary
    }
  ];

  return (
    <section 
      id="features"
      ref={sectionRef}
      className="py-24 px-6 md:px-16 lg:px-24 xl:px-40 scroll-mt-20 relative overflow-hidden"
      style={{ backgroundColor: theme.bg }}
    >
      {/* Background Decoration */}
      <div 
        className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${theme.secondary} 0%, transparent 70%)` }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="feature-badge flex items-center justify-center gap-2 mb-6">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
              style={{ borderColor: theme.secondary, color: theme.text }}
            >
              <Sparkles size={16} />
              <span className="text-sm font-bold uppercase tracking-wider">Simple Process</span>
            </div>
          </div>

          <div className="feature-title">
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{ color: theme.text }}
            >
              Build your resume with{" "}
              <span className="hover-text-effect" style={{ color: theme.primary }}>intelligence</span>
            </h2>
            <p 
              className="text-lg md:text-xl max-w-2xl mx-auto opacity-80"
              style={{ color: theme.text }}
            >
              Our streamlined process helps you create professional resumes in minutes with intelligent AI-powered tools and features.
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <div className="relative order-2 lg:order-1">
            <div className="feature-image-container relative rounded-2xl overflow-hidden shadow-2xl border-4" style={{ borderColor: theme.surface }}>
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png"
                alt="Resume Builder Interface"
                className="feature-image w-full h-auto"
              />
              
              {/* Overlay Badge */}
              <div 
                className="absolute bottom-6 left-6 px-4 py-2 rounded-full backdrop-blur-md font-semibold text-sm shadow-lg"
                style={{ 
                  backgroundColor: 'rgba(250, 237, 205, 0.9)',
                  color: theme.text
                }}
              >
                ✨ Live Editor Preview
              </div>
            </div>

            {/* Decorative Element */}
            <div 
              className="absolute -bottom-6 -right-6 w-48 h-48 rounded-full blur-2xl opacity-30 -z-10"
              style={{ backgroundColor: theme.primary }}
            />
          </div>

          {/* Right Side - Features (Cards appear ONE BY ONE) */}
          <div className="space-y-6 order-1 lg:order-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card group relative p-6 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover-trigger shadow-lg cursor-pointer"
                style={{ backgroundColor: '#fff' }}
              >
                <div className="flex gap-5">
                  {/* Icon */}
                  <div 
                    className="feature-icon flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                    style={{ 
                      backgroundColor: theme.surface,
                      color: feature.color
                    }}
                  >
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 
                      className="text-xl font-bold mb-2 transition-all duration-300 group-hover:translate-x-1"
                      style={{ color: theme.text }}
                    >
                      {feature.title}
                    </h3>
                    <p 
                      className="text-sm leading-relaxed opacity-75 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ color: theme.text }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-300"
                  style={{ 
                    border: `2px solid ${theme.primary}`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <p 
            className="text-lg mb-6 opacity-70"
            style={{ color: theme.text }}
          >
            Join thousands of professionals who've landed their dream jobs
          </p>
          <button 
            className="group px-8 py-4 rounded-full font-bold text-lg hover-trigger transition-all duration-300 hover:scale-105 shadow-lg relative overflow-hidden"
            style={{ 
              backgroundColor: theme.primary,
              color: '#fff'
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Building Now 
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
            {/* Hover effect background */}
            <div 
              className="absolute inset-0 translate-y-[101%] transition-transform duration-300 group-hover:translate-y-0"
              style={{ backgroundColor: theme.text }}
            />
          </button>
        </div>
      </div>

      {/* Enhanced Hover Text Animation */}
      <style>{`
        .hover-text-effect {
          display: inline-block;
          transition: all 0.3s ease;
        }
        
        .hover-text-effect:hover {
          transform: scale(1.05) translateY(-2px);
          text-shadow: 0 4px 8px rgba(187, 148, 87, 0.3);
        }
      `}</style>
    </section>
  );
};

export default Feature;