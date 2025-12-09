import { Plus, Sparkles, X } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'

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

const SkillsForm = ({data, onChange}) => {
    const [newSkill, setNewSkill] = useState('')
    const skillsContainerRef = useRef(null);
    const formRef = useRef(null);

    // Initial Load Animation
    useEffect(() => {
        gsap.fromTo(formRef.current, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
    }, []);

    // Common input field styling logic
    const inputStyle = {
        backgroundColor: THEME.surface,
        borderColor: THEME.border,
        color: THEME.text,
        borderWidth: '1px',
        borderRadius: '0.5rem', // rounded-lg
        padding: '0.5rem 0.75rem', // px-3 py-2
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    };

    const handleFocus = (e) => {
        e.target.style.borderColor = THEME.primary;
        e.target.style.boxShadow = `0 0 0 3px ${THEME.primary}40`;
    };

    const handleBlur = (e) => {
        e.target.style.borderColor = THEME.border;
        e.target.style.boxShadow = 'none';
    };

    const addSkill = ()=>{
        const trimmedSkill = newSkill.trim();
        if(trimmedSkill && !data.includes(trimmedSkill)){
            
            // Add skill to the data array
            onChange([...data, trimmedSkill])
            setNewSkill('')

            // GSAP: Animate the new skill chip appearing
            // We animate the last child added to the container (if the container exists)
            const skills = skillsContainerRef.current?.children;
            if (skills && skills.length > 0) {
                 const newSkillElement = skills[skills.length - 1];
                 gsap.from(newSkillElement, { 
                     opacity: 0, 
                     scale: 0.8, 
                     y: -10, 
                     duration: 0.3,
                     ease: "back.out(1.7)"
                 });
            }
        }
    }

    const removeSkill = (indexToRemove, e)=>{
        const chipElement = e.currentTarget.closest('span');
        
        // GSAP: Animate the skill chip disappearing
        gsap.to(chipElement, {
            opacity: 0,
            scale: 0.5,
            duration: 0.3,
            onComplete: () => {
                // Only remove from DOM (via state update) after animation completes
                onChange(data.filter((_,index)=>index!==indexToRemove))
            }
        });
    }

    const handleKeyPress = (e)=>{
        if(e.key === 'Enter'){
            e.preventDefault();
            addSkill(); 
        }
    }

    return (
        <div className='space-y-4' ref={formRef}>
            {/* Header (Themed) */}
            <div style={{ color: THEME.text }}>
                <h3 className='font items-center gap-2 text-lg font-semibold'>Skills</h3>
                <p className='text-sm' style={{ color: `${THEME.text}80` }}>Add your technical and soft skills</p>
            </div>

            {/* Input & Add Button */}
            <div className='flex gap-2'>
                <input 
                    type="text" 
                    placeholder='Enter a skill (e.g., Javascript, Project Management)' 
                    onChange={(e)=>setNewSkill(e.target.value)}
                    value={newSkill}
                    onKeyDown={handleKeyPress}
                    className='flex-1 text-sm'
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                
                {/* Add Button (Themed & Animated) */}
                <button
                    onClick={addSkill}
                    disabled={!newSkill.trim()}
                    className='flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-200 
                                disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md'
                    style={{
                        backgroundColor: THEME.primary, 
                        color: THEME.surface, // Light text for contrast
                    }}
                    onMouseEnter={(e) => { 
                        if (newSkill.trim()) {
                            e.currentTarget.style.backgroundColor = THEME.text; // Darker on hover
                        }
                    }}
                    onMouseLeave={(e) => { 
                        e.currentTarget.style.backgroundColor = THEME.primary; // Revert on mouse leave
                    }}
                >
                    <Plus className='size-4'/>Add
                </button>
            </div>

            {/* Skill Tags Display */}
            {data.length > 0 ? (
                <div className='flex flex-wrap gap-2' ref={skillsContainerRef}>
                    {data.map((skill,index)=>(
                        <span key={index}
                            className='flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all duration-300'
                            style={{
                                backgroundColor: `${THEME.primary}40`, // Light primary background
                                color: THEME.text, // Dark text
                                border: `1px solid ${THEME.primary}`,
                            }}
                        >
                            {skill}
                            <button 
                                onClick={(e)=>removeSkill(index, e)}
                                className='ml-1 rounded-full p-0.5 transition-colors hover:bg-opacity-80'
                                style={{
                                    backgroundColor: `${THEME.primary}60`, // Slightly darker background for remove button
                                    color: THEME.text
                                }}
                            >
                                <X className='w-3 h-3'/>
                            </button>
                        </span>
                    ))}
                </div>
            ):(
                /* Empty State (Themed) */
                <div className='text-center py-6' style={{ color: `${THEME.text}80` }}>
                    <Sparkles className='w-10 h-10 mx-auto mb-2' style={{ color: `${THEME.border}80` }}/>
                    <p>No skill added yet</p>
                    <p className='text-sm'>Add your technical and soft skills above</p>
                </div>
            )}
            
            {/* Tip Box (Themed) */}
            <div className='rounded-lg p-3' style={{ backgroundColor: `${THEME.primary}10`, border: `1px solid ${THEME.border}` }}>
                <p className='text-sm' style={{ color: THEME.text }}>
                    <strong>Tip: </strong>
                    Add 8-12 relevant skills. Include both technical skills (programming languages, tools) and soft skills (leadership, communication).
                </p>
            </div>
        </div>
    )
}

export default SkillsForm