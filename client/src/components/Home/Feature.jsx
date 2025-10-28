import { Zap } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

const Title = ({ title, description }) => (
  <div className="text-center max-w-2xl mx-auto my-8">
    <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3">
      {title}
    </h2>
    <p className="text-slate-600">{description}</p>
  </div>
);

const Feature = () => {
  const [isHover, setIsHover] = useState(false);
  
  // Refs for scroll animation
  const tagRef = useRef(null);
  const titleRef = useRef(null);
  const imageRef = useRef(null);
  const featuresRef = useRef([]);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.4, // Trigger when 20% of element is visible
      rootMargin: '0px'
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          // Tag animation
          if (tagRef.current) {
            tagRef.current.animate([
              { opacity: 0, transform: 'translateY(20px)' },
              { opacity: 1, transform: 'translateY(0)' }
            ], {
              duration: 600,
              easing: 'ease-out',
              fill: 'forwards'
            });
          }

          // Title animation
          if (titleRef.current) {
            titleRef.current.animate([
              { opacity: 0, transform: 'translateY(20px)' },
              { opacity: 1, transform: 'translateY(0)' }
            ], {
              duration: 600,
              delay: 150,
              easing: 'ease-out',
              fill: 'forwards'
            });
          }

          // Image animation - slide from left
          if (imageRef.current) {
            imageRef.current.animate([
              { opacity: 0, transform: 'translateX(-50px)' },
              { opacity: 1, transform: 'translateX(0)' }
            ], {
              duration: 800,
              delay: 300,
              easing: 'ease-out',
              fill: 'forwards'
            });
          }

          // Features animation - staggered fade up
          featuresRef.current.forEach((feature, index) => {
            if (feature) {
              feature.animate([
                { opacity: 0, transform: 'translateY(30px)' },
                { opacity: 1, transform: 'translateY(0)' }
              ], {
                duration: 700,
                delay: 500 + (index * 450),
                easing: 'ease-out',
                fill: 'forwards'
              });
            }
          });
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <div
      id="features"
      className="flex flex-col items-center my-10 scroll-mt-12"
      ref={sectionRef}
    >
      {/* Tag */}
      <div 
        className="flex items-center gap-2 text-sm text-[#1e3a8a] bg-[#e0f2fe] border border-blue-200 rounded-full px-4 py-1"
        ref={tagRef}
        style={{ opacity: 0 }}
      >
        <Zap width={14} />
        <span>Simple process</span>
      </div>
      
      <div ref={titleRef} style={{ opacity: 0 }}>
        <Title
          title="Build your resume"
          description="Our streamlined process helps you create 
          professional resume in minutes with intelligent
          AI-powered tools and fearures."
        />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center mt-6 xl:-mt-10">
        <img
          ref={imageRef}
          className="max-w-2xl w-full xl:-ml-32"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png"
          alt=""
          style={{ opacity: 0 }}
        />
        <div
          className="px-4 md:px-0 mt-6 md:mt-0"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          {/* Feature 1 */}
          <div 
            className="flex items-center justify-center gap-6 max-w-md group cursor-pointer mb-4"
            ref={(el) => featuresRef.current[0] = el}
            style={{ opacity: 0 }}
          >
            <div className="p-6 border border-transparent rounded-xl flex gap-4 transition-colors bg-white group-hover:bg-[#dbeafe] group-hover:border-[#2563eb]">
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
                className="size-6 stroke-[#1e40af] group-hover:stroke-[#1e40af]"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
              </svg>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-[#1e3a8a]">
                  AI Resume Builder
                </h3>
                <p className="text-sm text-slate-600 max-w-xs">
                 Create professional resumes instantly using AI-powered suggestions tailored to your career.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div 
            className="flex items-center justify-center gap-6 max-w-md group cursor-pointer mb-4"
            ref={(el) => featuresRef.current[1] = el}
            style={{ opacity: 0 }}
          >
            <div className="p-6 group-hover:bg-[#dbeafe] border border-transparent group-hover:border-[#2563eb] flex gap-4 rounded-xl transition-colors">
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
                className="size-6 stroke-[#1e40af]"
              >
                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
              </svg>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-[#1e3a8a]">
                  Real-Time Editing
                </h3>
                <p className="text-sm text-slate-600 max-w-xs">
                  Edit and format your resume in real-time with smart AI recommendations.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div 
            className="flex items-center justify-center gap-6 max-w-md group cursor-pointer"
            ref={(el) => featuresRef.current[2] = el}
            style={{ opacity: 0 }}
          >
            <div className="p-6 group-hover:bg-[#dbeafe] border border-transparent group-hover:border-[#2563eb] flex gap-4 rounded-xl transition-colors">
              <svg
                className="size-6 stroke-[#1e40af]"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 15V3" />
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
              </svg>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-[#1e3a8a]">
                  Download & Share
                </h3>
                <p className="text-sm text-slate-600 max-w-xs">
                  Download your resume in multiple formats or share it directly with employers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

        * {
            font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default Feature;