import { GraduationCap, Plus, Trash2 } from 'lucide-react'
import React, { useRef, useEffect } from 'react'
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

const EducationForm = ({ data, onChange }) => {
  const formRef = useRef(null);

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

  const addEducation = ()=>{
    const newEducation = {
      institution: '',
      degree: '',
      field:'',
      graduation_date:'',
      gpa: '',
    }
    onChange([...data,newEducation])
    
    // GSAP: Animate the new item addition
    // Schedule animation for the next render cycle
    setTimeout(() => {
        const items = formRef.current.querySelectorAll('.education-item');
        if (items.length > 0) {
            gsap.from(items[items.length - 1], { 
                opacity: 0, 
                y: 10, 
                duration: 0.3 
            });
        }
    }, 50);
  }

  const removeEducation = (index, e)=>{
    const itemElement = e.currentTarget.closest('.education-item');
    
    // GSAP: Animate the item disappearing
    gsap.to(itemElement, {
      opacity: 0,
      scaleY: 0.5,
      height: 0,
      duration: 0.3,
      onComplete: () => {
        // Only remove from DOM (via state update) after animation completes
        const updated = data.filter((_,i)=>i !== index)
        onChange(updated)
      }
    });
  }

  const updateEducation = (index, field, value)=>{
    const updated = [...data]
    updated[index] = {...updated[index], [field]:value}
    onChange(updated)
  }

  return (
    <div className="space-y-6" ref={formRef}>
      <div className="flex items-center justify-between">
        <div style={{ color: THEME.text }}>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            Education
          </h3>
          <p className="text-sm" style={{ color: `${THEME.text}80` }}>
            Add your education details
          </p>
        </div>
        
        {/* Add Education Button (Themed & Animated) */}
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1 rounded transition-all duration-200 hover:shadow-md"
          style={{
            backgroundColor: `${THEME.primary}40`,
            color: THEME.text,
            border: `1px solid ${THEME.primary}`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${THEME.primary}60`; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${THEME.primary}40`; }}
        >
          <Plus className="size-4" />
          Add Education
        </button>
      </div>
      
      {/* Empty State (Themed) */}
      {data.length === 0 ? (
        <div className='text-center py-8' style={{ color: `${THEME.text}80` }}>
          <GraduationCap className="w-12 h-12 mx-auto mb-3" style={{ color: `${THEME.border}80` }}/>
          <p>No education added yet.</p>
          <p className="text-sm">Click "Add Education" to get started.</p>
        </div>
      ) :(
        <div className="space-y-4">
          {data.map((education,index)=>(
            <div key={index}
              className="education-item p-4 rounded-lg space-y-3 shadow-sm"
              style={{
                border: `1px solid ${THEME.border}`,
                backgroundColor: THEME.surface,
                color: THEME.text,
              }}>
              
              <div className="flex items-center justify-between">
                <h4>Education #{index+1}</h4>
                {/* Trash Button (Themed) */}
                <button 
                  onClick={(e)=>removeEducation(index, e)}
                  className="transition-colors hover:scale-110"
                  style={{ color: '#EF4444' }}
                >
                  <Trash2 className="size-4"/>
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-3">
                {/* Institution Name */}
                <input 
                  value={education.institution||''}
                  onChange={(e)=>updateEducation(index, "institution",e.target.value)}
                  type="text" placeholder="Institution Name"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                {/* Degree */}
                <input 
                  value={education.degree||''}
                  onChange={(e)=>updateEducation(index, "degree",e.target.value)}
                  type="text" placeholder="Degree (e.g., Bachelor's)"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                {/* Field of Study */}
                <input 
                  value={education.field||''}
                  onChange={(e)=>updateEducation(index, "field",e.target.value)}
                  type="text" placeholder='Field of study'
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                {/* Graduation Date */}
                <input 
                  value={education.graduation_date||''}
                  onChange={(e)=>updateEducation(index, "graduation_date",e.target.value)}
                  type="month"
                  className="disabled:opacity-60"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              
              {/* GPA */}
              <input 
                value={education.gpa||''}
                onChange={(e)=>updateEducation(index, "gpa",e.target.value)}
                type="text" placeholder='GPA (optional)'
                style={{...inputStyle, width: 'calc(50% - 6px)'}} // Match half-width input style
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EducationForm