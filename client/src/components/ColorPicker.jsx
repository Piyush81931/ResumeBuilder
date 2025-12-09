import { Check, Palette } from "lucide-react";
import React, { useState } from "react";

// --- THEME DEFINITION ---
const THEME = {
  bg: '#faedcd',
  text: '#99582a', // Dark Brown
  primary: '#bb9457', // Medium Brown/Gold
  secondary: '#d4a373',
  surface: '#f8f1de', // Light Cream/White
  border: '#d4a373',
  softGreen: '#22c55e', 
};

const ColorPicker = ({selectedColor, onChange}) => {
  const colors = [
    { name: "Blue", value: "#3B82F6" },
    { name: "Indigo", value: "#6366F1" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Green", value: "#10B981" },
    { name: "Red", value: "#EF4444" },
    { name: "Orange", value: "#F97316" },
    { name: "Teal", value: "#14B8A6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Gray", value: "#6B7280" },
    { name: "Black", value: "#1F2937" },
  ];
  const[isOpen, setIsOpen] = useState(false)

  // Function to handle click outside the dropdown to close it
  const handleOutsideClick = (e) => {
      if (isOpen && !e.target.closest('.color-picker-container')) {
          setIsOpen(false);
      }
  };

  React.useEffect(() => {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
      };
  }, [isOpen]);

  return (
    <div className="relative color-picker-container">
      {/* Selector Button (Themed with Hover Transition) */}
      <button
        onClick={()=>setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm transition-all duration-200 px-3 py-2 rounded-lg 
                   hover:shadow-md" // Added subtle shadow on hover
        style={{
          color: THEME.text, 
          backgroundColor: THEME.surface, 
          border: `1px solid ${THEME.border}`,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${THEME.primary}30`; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = THEME.surface; }}
      >
        <Palette size={16}/><span className="max-sm:hidden">Accent</span>
      </button>

      {/* Dropdown Menu (Themed and Animated) */}
      {isOpen && (
        <div 
          className="grid grid-cols-4 w-60 gap-2 p-3 absolute top-full left-0 mt-2 z-30 
                     animate-fadeIn"
          style={{
            backgroundColor: THEME.surface,
            border: `1px solid ${THEME.border}`,
            borderRadius: '0.375rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
          }}
        >
          {
            colors.map((color)=>(
              <div key={color.value}
                className="relative cursor-pointer group flex flex-col items-center p-1"
                onClick={()=>{onChange(color.value); setIsOpen(false)} }>
                
                {/* Color Circle */}
                <div className="h-10 w-10 rounded-full border-2 
                  border-transparent group-hover:border-black/25
                  transition-colors flex items-center justify-center"
                  style={{backgroundColor: color.value}}>
                  
                  {/* Checkmark (Only appears if selected) */}
                  {
                    selectedColor === color.value && (
                      <Check className="size-4 text-white"/>
                    )
                  }
                </div>
                
                {/* Color Name */}
                <p className="text-xs mt-1 text-center" style={{ color: THEME.text }}>
                  {color.name}
                </p>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};

export default ColorPicker;