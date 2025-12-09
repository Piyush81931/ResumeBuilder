import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import MinimalTemplate from "./templates/MinimalTemplate"; 
import MinimalImageTemplate from "./templates/MinimalImageTemplate"; 
import { Sparkles, Target } from "lucide-react";
import gsap from 'gsap';

// --- THEME DEFINITION (Matching previous components) ---
const THEME = {
  bg: '#faedcd',
  text: '#99582a', // Dark Brown
  primary: '#bb9457', // Medium Brown/Gold
  surface: '#f8f1de', // Light Cream/White
  border: '#d4a373',
};

// --- Custom Button Component with GSAP Animation ---
const AnimatedActionButton = ({ children, onClick, icon: Icon, primaryText, iconColor, style, innerRef }) => {
    const buttonRef = useRef(null);
    const backgroundRef = useRef(null);
    
    // GSAP Background Wipe Setup
    useEffect(() => {
        const button = buttonRef.current;
        const bg = backgroundRef.current;

        if (!button || !bg) return;
        
        // Initial state: Background wipe layer is set to 0 width/scale
        gsap.set(bg, { scaleX: 0, transformOrigin: "left" });

        const tl = gsap.timeline({ paused: true });

        // Tween 1: Scale the button up slightly
        tl.to(button, { scale: 1.05, duration: 0.3, ease: "power2.out" }, 0);

        // Tween 2: Wipe the background layer from left to right
        tl.to(bg, { 
            scaleX: 1, 
            duration: 0.4, 
            ease: "power2.out" 
        }, 0); 
        
        button.addEventListener('mouseenter', () => tl.play());
        button.addEventListener('mouseleave', () => tl.reverse());
    }, []);

    return (
        <button
            ref={buttonRef}
            onClick={onClick}
            className="group relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg 
                       transition-all duration-300 transform overflow-hidden"
            style={{ 
                ...style,
                backgroundColor: THEME.primary, // Base color
                color: THEME.text, // Text color for contrast
                boxShadow: `0 2px 8px rgba(153, 88, 42, 0.2)`,
            }}
        >
            {/* Animated Background Wipe Layer */}
            <span 
                ref={backgroundRef}
                className="absolute inset-0 z-0"
                style={{
                    backgroundColor: THEME.text, // Dark brown wipe color
                }}
            ></span>

            {/* Content (Text and Icon) */}
            <div className="relative z-10 flex items-center gap-2 transition-colors duration-300">
                <Icon className="size-4" style={{ color: iconColor || THEME.text }}/>
                <span className="group-hover:text-white transition-colors duration-300">
                    {primaryText}
                </span>
            </div>
        </button>
    );
};


const ResumePreview = ({ data, accentColor, template, classes = "" }) => {
  const navigate = useNavigate();
  const { classId } = useSelector((state) => state.auth);

  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} accentColor={accentColor} />;
      case "minimal":
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      case "minimal-image":
        return (
          <MinimalImageTemplate data={data} accentColor={accentColor} />
        );
      default:
      case "classic":
        return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  };

  const handleAnalyzeClick = () => {
    navigate(`/app/analyze/${data._id}`);
  };

  const handleJobMatchClick = () => {
    navigate(`/app/job-match/${data._id}`);
  };

  return (
    <div className="w-full bg-gray-100">

      {/* Action Buttons (Themed and GSAP-Animated) */}
      <div className="flex justify-end gap-3 mb-4">
        
        {/* Tailor for Job Button */}
        <AnimatedActionButton
          onClick={handleJobMatchClick}
          icon={Target}
          primaryText="Tailor for Job"
          // When the button is wiped with THEME.text (dark brown), the icon should be light
          iconColor={THEME.surface} 
        />
        
        {/* Analyze Resume Button */}
        <AnimatedActionButton
          onClick={handleAnalyzeClick}
          icon={Sparkles}
          primaryText="Analyze Resume"
          // When the button is wiped with THEME.text (dark brown), the icon should be light
          iconColor={THEME.surface}
        />
      </div>

      {/* Resume Block */}
      <div
        id={`resume-preview ${classId}`}
        className={`border border-gray-200 print:shadow-none print:border-none ${classes}`}
      >
        {renderTemplate()}
      </div>

      {/* Print CSS (Kept as is) */}
      <style jsx>
        {`
          @page {
            size: letter;
            margin: 0;
          }
          @media print {
            html,
            body {
              width: 8.5in;
              height: 11in;
              overflow: hidden;
            }
            body * {
              visibility: hidden;
            }
            #resume-preview,
            #resume-preview * {
              visibility: visible;
            }
            #resume-preview {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              margin: 0;
              padding: 0;
              border: none !important;
              box-shadow: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ResumePreview;