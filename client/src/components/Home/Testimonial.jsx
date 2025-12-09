import React, { useEffect, useRef } from "react";
import { Users, Star } from "lucide-react";
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

const Testimonial = () => {
  const sectionRef = useRef(null);
  const marqueeRow1Ref = useRef(null);
  const marqueeRow2Ref = useRef(null);

  const cardsData = [
    {
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "Briar Martin",
      handle: "@briardesigns",
      role: "Senior Designer",
      testimonial: "ResumAI's AI enhancement turned my bland resume into a compelling story. Got 3 interviews in the first week!"
    },
    {
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Avery Johnson",
      handle: "@averywrites",
      role: "Content Strategist",
      testimonial: "The job tailor feature is a game-changer. I customize my resume for each position in under 5 minutes."
    },
    {
      image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
      name: "Jordan Lee",
      handle: "@jordantalks",
      role: "Marketing Manager",
      testimonial: "Resume analyzer caught issues I never noticed. My ATS score went from 67% to 94%!"
    },
    {
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
      name: "Casey Brooks",
      handle: "@caseytech",
      role: "Software Engineer",
      testimonial: "Finally, a resume builder that understands what recruiters actually want. The templates are gorgeous!"
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Badge Animation
      gsap.from('.testimonial-badge', {
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
      gsap.from('.testimonial-title', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.testimonial-title',
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      // Marquee Rows Fade In
      [marqueeRow1Ref.current, marqueeRow2Ref.current].forEach((row, i) => {
        gsap.from(row, {
          opacity: 0,
          y: 50,
          duration: 1,
          delay: i * 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const TestimonialCard = ({ card }) => (
    <div 
      className="p-6 rounded-2xl mx-4 shadow-lg hover:shadow-2xl transition-all duration-300 w-80 shrink-0 hover:-translate-y-1 hover-trigger"
      style={{ backgroundColor: '#fff', borderLeft: `4px solid ${theme.primary}` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <img
          className="w-12 h-12 rounded-full object-cover ring-2"
          style={{ ringColor: theme.surface }}
          src={card.image}
          alt={card.name}
        />
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <p className="font-bold" style={{ color: theme.text }}>{card.name}</p>
            <svg
              className="fill-current"
              style={{ color: theme.primary }}
              width="16"
              height="16"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z"
              />
            </svg>
          </div>
          <p className="text-xs opacity-70" style={{ color: theme.text }}>{card.handle}</p>
          <p className="text-xs font-semibold" style={{ color: theme.secondary }}>{card.role}</p>
        </div>
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-3">
        {Array(5).fill(0).map((_, i) => (
          <Star key={i} size={14} fill={theme.primary} color={theme.primary} />
        ))}
      </div>

      <p className="text-sm leading-relaxed" style={{ color: theme.text }}>
        "{card.testimonial}"
      </p>
    </div>
  );

  return (
    <section 
      id="testimonials"
      ref={sectionRef}
      className="py-24 px-6 scroll-mt-20 overflow-hidden relative"
      style={{ backgroundColor: theme.surface }}
    >
      {/* Background Decoration */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: theme.primary }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="testimonial-badge flex items-center justify-center gap-2 mb-6">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
              style={{ borderColor: theme.secondary, color: theme.text }}
            >
              <Users size={16} />
              <span className="text-sm font-bold uppercase tracking-wider">Testimonials</span>
            </div>
          </div>

          <div className="testimonial-title">
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{ color: theme.text }}
            >
              Don't just take our{" "}
              <span style={{ color: theme.primary }}>word for it</span>
            </h2>
            <p 
              className="text-lg md:text-xl max-w-2xl mx-auto opacity-80"
              style={{ color: theme.text }}
            >
              Hear from professionals who've transformed their careers with ResumAI. 
              Join thousands of success stories.
            </p>
          </div>
        </div>

        {/* Marquee Row 1 */}
        <div 
          ref={marqueeRow1Ref}
          className="marquee-row w-full overflow-hidden relative mb-6"
        >
          {/* Gradient Overlays */}
          <div 
            className="absolute left-0 top-0 h-full w-24 md:w-40 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to right, ${theme.surface}, transparent)` }}
          />
          <div 
            className="marquee-inner flex min-w-[200%]"
          >
            {[...cardsData, ...cardsData].map((card, index) => (
              <TestimonialCard key={`row1-${index}`} card={card} />
            ))}
          </div>
          <div 
            className="absolute right-0 top-0 h-full w-24 md:w-40 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to left, ${theme.surface}, transparent)` }}
          />
        </div>

        {/* Marquee Row 2 - Reverse */}
        <div 
          ref={marqueeRow2Ref}
          className="marquee-row w-full overflow-hidden relative"
        >
          <div 
            className="absolute left-0 top-0 h-full w-24 md:w-40 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to right, ${theme.surface}, transparent)` }}
          />
          <div 
            className="marquee-inner marquee-reverse flex min-w-[200%]"
          >
            {[...cardsData, ...cardsData].map((card, index) => (
              <TestimonialCard key={`row2-${index}`} card={card} />
            ))}
          </div>
          <div 
            className="absolute right-0 top-0 h-full w-24 md:w-40 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to left, ${theme.surface}, transparent)` }}
          />
        </div>

        {/* Bottom Stats */}
        <div className="text-center mt-20">
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: theme.primary }}>
                4.9/5
              </div>
              <p className="text-sm opacity-70" style={{ color: theme.text }}>Average Rating</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: theme.primary }}>
                2,500+
              </div>
              <p className="text-sm opacity-70" style={{ color: theme.text }}>Happy Users</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: theme.primary }}>
                98%
              </div>
              <p className="text-sm opacity-70" style={{ color: theme.text }}>Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Animation */}
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .marquee-inner {
          animation: marqueeScroll 30s linear infinite;
        }

        .marquee-reverse {
          animation-direction: reverse;
        }

        .marquee-row:hover .marquee-inner {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Testimonial;