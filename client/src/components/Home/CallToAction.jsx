import React, { useEffect, useRef } from "react";

const CallToAction = () => {
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate visibility percentage (0 to 1)
      const visibleTop = Math.max(0, Math.min(windowHeight, rect.bottom));
      const visibleBottom = Math.max(0, Math.min(windowHeight, windowHeight - rect.top));
      const visibleHeight = Math.min(visibleTop, visibleBottom);
      const elementHeight = rect.height;
      const visibilityRatio = Math.min(visibleHeight / (elementHeight * 0.6), 1);

      // Smooth easing function (ease-out cubic)
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      const smoothRatio = easeOutCubic(visibilityRatio);

      // Apply opacity and transform based on visibility
      const opacity = smoothRatio;

      // Text animation - slide from left
      if (textRef.current) {
        textRef.current.style.opacity = opacity;
        textRef.current.style.transform = `translateX(${-50 * (1 - smoothRatio)}px)`;
      }

      // Button animation - slide from right
      if (buttonRef.current) {
        buttonRef.current.style.opacity = opacity;
        buttonRef.current.style.transform = `translateX(${50 * (1 - smoothRatio)}px)`;
      }
    };

    // Initial check
    handleScroll();

    // Use requestAnimationFrame for smoother performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div 
      id="cta" 
      className="border-y border-dashed border-slate-200 w-full max-w-5xl mx-auto px-10 sm:px-16 mt-28"
      ref={sectionRef}
    >
      <div className="flex flex-col md:flex-row text-center md:text-left items-center justify-between gap-8 px-3 md:px-10 border-x border-dashed border-slate-200 py-16 sm:py-20 -mt-10 -mb-10 w-full">
        <p 
          className="text-xl font-medium max-w-md text-slate-800"
          ref={textRef}
          style={{ 
            transition: 'none',
            willChange: 'transform, opacity'
          }}
        >
          Build the professional resume that help you stand out and get
        </p>
        <a
          href="https://prebuiltui.com"
          className="flex items-center gap-2 rounded py-3 px-8 bg-[#e0f2fe] hover:bg-[#2563eb] hover:text-white transition text-[#1e3a8a]"
          ref={buttonRef}
          style={{ 
            transition: 'none',
            willChange: 'transform, opacity'
          }}
        >
          <span>Get started</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4.5"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default CallToAction;