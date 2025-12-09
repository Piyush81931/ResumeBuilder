import { Check, Layout } from 'lucide-react'
import React, { useState } from 'react'

// --- THEME DEFINITION ---
const THEME = {
  bg: '#faedcd',
  text: '#99582a',
  primary: '#bb9457',
  secondary: '#d4a373',
  surface: '#f8f1de',
  border: '#d4a373',
  softGreen: '#22c55e', 
};

const TemplateSelector = ({selectedTemplate,onchange}) => {
    const [isOpen, setIsOpen] = useState(false)

    const templates = [
        {
            id: "classic",
            name: "Classic",
            preview:" A clean, traditional resume format with sections and professional typography"
        },
        {
            id: "modern",
            name: "Modern",
            preview:"Sleek design with strategic use of color and modern font choice"
        },
        {
            id: "minimal-image",
            name: "Minimal Image",
            preview:"Minimal design with single image and clean typography"
        },
        {
            id: "minimal",
            name: "Minimal",
            preview:"Ultra-clean design that put you content front and center"
        }
    ]
    
    // Function to handle click outside the dropdown to close it
    const handleOutsideClick = (e) => {
        if (isOpen && !e.target.closest('.template-selector-container')) {
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
    <div className='relative template-selector-container'>
      {/* Selector Button (Themed with Hover Transition) */}
      <button 
        onClick={()=>setIsOpen(!isOpen)}
        className='flex items-center text-sm gap-1 transition-all duration-200 px-3 py-2 rounded-lg 
                   hover:shadow-md' // Added subtle shadow on hover
        style={{
            color: THEME.text, 
            backgroundColor: THEME.surface, 
            border: `1px solid ${THEME.border}`,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            // Use CSS variables or a class to handle hover background effect more reliably
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${THEME.primary}30`; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = THEME.surface; }}
      >
        <Layout size={14}/>
        <span className='max-sm:hidden'>Template</span>
      </button>

      {/* Dropdown Menu (Themed) */}
      {
        isOpen && (
            <div 
                className='absolute top-full w-64 p-3 mt-2 space-y-3 z-30 right-0 md:right-auto'
                style={{
                    backgroundColor: THEME.surface,
                    border: `1px solid ${THEME.border}`,
                    borderRadius: '0.375rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                }}
            >
                {
                    templates.map((template)=>(
                        <div key={template.id}
                            onClick={()=>{onchange(template.id); setIsOpen(false)}}
                            className={`relative p-3 border rounded-md 
                            cursor-pointer transition-all hover:shadow-sm`}
                            style={{
                                backgroundColor: selectedTemplate === template.id ? 
                                    `${THEME.primary}20` : 'transparent',
                                borderColor: selectedTemplate === template.id ? 
                                    THEME.primary : THEME.border,
                                color: THEME.text,
                            }}
                        >
                            {selectedTemplate === template.id && (
                                <div className='absolute top-2 right-2'>
                                    <div 
                                        className='size-5 rounded-full flex items-center justify-center'
                                        style={{ backgroundColor: THEME.text }}
                                    >
                                        <Check className='w-3 h-3 text-white'/>
                                    </div>
                                </div>
                            )}
                            <div className='space-y-1'>
                                <h4 className='font-medium' style={{ color: THEME.text }}> 
                                    {template.name} 
                                </h4>
                                <div 
                                    className='mt-2 p-2 rounded text-xs italic'
                                    style={{
                                        backgroundColor: `${THEME.primary}10`,
                                        color: `${THEME.text}b0`,
                                    }}
                                >
                                    {template.preview}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        )
      }
    </div>
  )
}

export default TemplateSelector