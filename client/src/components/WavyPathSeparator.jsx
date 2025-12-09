import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin (although only mouse events are used here, 
// it's good practice to keep the registration if the original code included it)
gsap.registerPlugin(ScrollTrigger);

// --- THEME DEFINITION ---
// Reusing your provided theme structure for borderColor
const THEME = {
  // Ensure border color is defined, assuming 'THEME.border' is the intended color.
  border: '#d4a373',
};

const WavyPathSeparator = () => {
    // Refs for the SVG path and the container div
    const containerRef = useRef(null);
    const pathRef = useRef(null);
    
    // Define the fixed SVG dimensions
    const SVG_WIDTH = 450;
    const SVG_HEIGHT = 80;

    // Define the path strings based on the original logic
    const initialPath = `M 10 ${SVG_HEIGHT / 2} Q ${SVG_WIDTH / 2} ${SVG_HEIGHT / 2} ${SVG_WIDTH - 10} ${SVG_HEIGHT / 2}`;
    const finalPath = initialPath; // The resting state is the straight line

    // State to hold the current path, mostly for initial render setup
    const [currentPath, setCurrentPath] = useState(initialPath);
    
    // ------------------------------------------------------------------
    // 1. Mouse Move Handler (Waving Effect)
    // ------------------------------------------------------------------
    const handleMouseMove = (event) => {
        // Get the container's position relative to the viewport
        const rect = containerRef.current.getBoundingClientRect();
        
        // Calculate mouse position relative to the container (like the original event.x/y)
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Construct the new quadratic Bézier curve path
        const newPath = `M 10 ${SVG_HEIGHT / 2} Q ${mouseX} ${mouseY} ${SVG_WIDTH - 10} ${SVG_HEIGHT / 2}`;
        
        // GSAP animation to smoothly change the path 'd' attribute
        gsap.to(pathRef.current, {
            duration: 0.5,
            attr: {
                d: newPath
            },
            ease: "power3.out"
        });
    };

    // ------------------------------------------------------------------
    // 2. Mouse Leave Handler (Snapping Back)
    // ------------------------------------------------------------------
    const handleMouseLeave = () => {
        // GSAP animation to snap the path back to the straight line
        gsap.to(pathRef.current, {
            duration: 1,
            attr: {
                d: finalPath
            },
            ease: "elastic.out(1,0.3)"
        });
    };
    
    // ------------------------------------------------------------------
    // 3. Effect for cleanup (React practice)
    // ------------------------------------------------------------------
    useEffect(() => {
        const container = containerRef.current;
        
        if (container) {
            // Attach event listeners using the ref
            container.addEventListener("mousemove", handleMouseMove);
            container.addEventListener("mouseleave", handleMouseLeave);
        }

        // Cleanup function to remove event listeners when component unmounts
        return () => {
            if (container) {
                container.removeEventListener("mousemove", handleMouseMove);
                container.removeEventListener("mouseleave", handleMouseLeave);
            }
        };
    }, []); // Empty dependency array ensures this runs once on mount/unmount


    return (
        <div 
            ref={containerRef} 
            // Setting container dimensions and background to match the original setup
            className="sm:w-[350px] w-full flex items-center relative" 
            style={{ 
                // Ensure the container is the size of the SVG
                // width: `${SVG_WIDTH}px`, 
                height: `${SVG_HEIGHT}px`,
                // Center the container if possible, matching the original <hr> intent
                // margin: '10px auto', // my-8 corresponds to margin-y: 2rem or 32px
            }}
        >
             <svg width={SVG_WIDTH} height={SVG_HEIGHT} style={{ display: 'block' }}>
                 <path 
                    ref={pathRef}
                    d={currentPath} 
                    fill="transparent" 
                    stroke="white" // Original stroke color
                    strokeWidth="3"
                    // Optionally set stroke color using THEME.border to match <hr>
                    style={{ stroke: THEME.border }}
                />
            </svg>
        </div>
    );
};
export default WavyPathSeparator;