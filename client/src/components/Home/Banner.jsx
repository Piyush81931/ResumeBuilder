import React from "react";

const theme = {
  text: '#99582a',
  primary: '#bb9457',
  secondary: '#d4a373',
};

const Banner = () => {
  return (
    <div 
      className="w-full py-3 font-medium text-sm text-center border-b relative overflow-hidden group cursor-pointer"
      style={{ 
        backgroundColor: theme.secondary,
        color: theme.text,
        borderColor: 'rgba(153, 88, 42, 0.2)'
      }}
    >
      {/* Animated gradient background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(187,148,87,0.3)] to-transparent banner-shimmer" />
      
      <p className="relative z-10 transition-transform duration-300 group-hover:scale-105">
        <span 
          className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mr-2 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110"
          style={{ 
            backgroundColor: theme.primary,
            color: '#fff'
          }}
        >
          🎉 New
        </span>
        <span className="font-semibold hover-text-effect">AI Enhance, Resume Analyzer & Job Tailor</span>
        <span className="opacity-90"> - Transform your resume in seconds</span>
      </p>

      <style>{`
        @keyframes shimmer {
          0% { 
            transform: translateX(-100%); 
          }
          100% { 
            transform: translateX(100%); 
          }
        }
        
        .banner-shimmer {
          animation: shimmer 3s infinite;
        }
        
        .hover-text-effect {
          display: inline-block;
          transition: all 0.3s ease;
        }
        
        .hover-text-effect:hover {
          color: ${theme.primary};
          text-shadow: 0 2px 8px rgba(187, 148, 87, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Banner;