import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from 'react-redux'
import api from "../configues/api";
import toast from "react-hot-toast";

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

const ExperienceForm = ({ data, onChange }) => {
  const {token} = useSelector(state=>state.auth)
  const [genratingIndex, setGenratingIndex] = useState(-1)
  
  const addExperience = ()=>{
    const newExperience = {
      company: '',
      position: '',
      start_date:'',
      end_date:'',
      description: '',
      is_current: false
    }
    onChange([...data,newExperience])
  }
  
  const removeExperience = (index)=>{
    const updated = data.filter((_,i)=>i !== index)
    onChange(updated)
  }
  
  const updateExperience = (index, field, value)=>{
    const updated = [...data]
    updated[index] = {...updated[index], [field]:value}
    onChange(updated)
  }
  
  const genrateDiscription = async (index)=>{
    setGenratingIndex(index)
    const experience = data[index]
    const prompt = `enhance the job description ${experience.description} for the position of ${experience.position} at ${experience.company}`
    try{
      const {data} = await api.post('/api/ai/enhance-job-desc',{userContent:prompt},{headers:{Authorization:token}})
      updateExperience(index,'description',data.enhancedContent)
    } catch (error) {
      toast.error(error?.response?.data?.message||error.message)
    }
    finally{
      setGenratingIndex(-1)
    }
  }

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div style={{ color: THEME.text }}>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            Professional Experience
          </h3>
          <p className="text-sm" style={{ color: `${THEME.text}80` }}>
            Add your job experience
          </p>
        </div>
        
        {/* Add Experience Button (Themed & Animated) */}
        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-3 py-1 rounded transition-all duration-200 hover:shadow-md"
          style={{
            backgroundColor: `${THEME.primary}40`, // Light primary background
            color: THEME.text, // Dark Brown text/icon
            border: `1px solid ${THEME.primary}`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${THEME.primary}60`; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${THEME.primary}40`; }}
        >
          <Plus className="size-4" />
          Add Experience
        </button>
      </div>
      
      {/* Empty State (Themed) */}
      {data.length === 0 ? (
        <div className='text-center py-8' style={{ color: `${THEME.text}80` }}>
          <Briefcase className="w-12 h-12 mx-auto mb-3" style={{ color: `${THEME.border}80` }}/>
          <p>No work experience added yet.</p>
          <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      ) :(
        <div className="space-y-4">
          {data.map((experience,index)=>(
            <div key={index}
              className="p-4 rounded-lg space-y-3 shadow-sm"
              style={{
                border: `1px solid ${THEME.border}`,
                backgroundColor: THEME.surface,
                color: THEME.text,
              }}>
              
              <div className="flex items-center justify-between">
                <h4>Experience #{index+1}</h4>
                {/* Trash Button (Themed) */}
                <button 
                  onClick={()=>removeExperience(index)}
                  className="transition-colors hover:scale-110"
                  style={{ color: '#EF4444' }} // Red for danger action
                >
                  <Trash2 className="size-4"/>
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-3">
                {/* Company Name */}
                <input 
                  value={experience.company||''}
                  onChange={(e)=>updateExperience(index, "company",e.target.value)}
                  type="text" placeholder="Company Name"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                {/* Job Title */}
                <input 
                  value={experience.position||''}
                  onChange={(e)=>updateExperience(index, "position",e.target.value)}
                  type="text" placeholder="Job Title"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                {/* Start Date */}
                <input 
                  value={experience.start_date||''}
                  onChange={(e)=>updateExperience(index, "start_date",e.target.value)}
                  type="month"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                {/* End Date */}
                <input 
                  value={experience.end_date||''}
                  onChange={(e)=>updateExperience(index, "end_date",e.target.value)}
                  type="month" disabled={experience.is_current}
                  className="disabled:opacity-60"
                  style={{...inputStyle, backgroundColor: experience.is_current ? `${THEME.surface}a0` : inputStyle.backgroundColor}}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              
              {/* Current Job Checkbox (Themed) */}
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" checked={experience.is_current || false} 
                  onChange={(e)=>updateExperience(index,'is_current',e.target.checked ? true : false)}
                  style={{
                    color: THEME.primary, // Primary color for checkmark
                    borderColor: THEME.border,
                  }}
                  className="rounded text-current focus:ring-0" // Using text-current to inherit inline color
                />
                <span className="text-sm" style={{ color: THEME.text }}>Currently working here</span>
              </label>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium" style={{ color: THEME.text }}>Job Description</label>
                  
                  {/* AI Enhance Button (Themed & Animated) */}
                  <button
                    onClick={()=>genrateDiscription(index)}
                    disabled={genratingIndex === index || !experience.position || !experience.company}
                    className="flex items-center gap-1 px-2 py-1 text-xs rounded transition-all duration-200 
                               disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm"
                    style={{
                      backgroundColor: `${THEME.primary}20`,
                      color: THEME.text,
                      border: `1px solid ${THEME.primary}`,
                    }}
                    onMouseEnter={(e) => { 
                      if (genratingIndex !== index) {
                        e.currentTarget.style.backgroundColor = `${THEME.primary}40`;
                      }
                    }}
                    onMouseLeave={(e) => { 
                      if (genratingIndex !== index) {
                        e.currentTarget.style.backgroundColor = `${THEME.primary}20`;
                      }
                    }}
                  >
                    {genratingIndex === index ? (
                      <Loader2 className="size-4 animate-spin"/>
                    ) : (
                      <Sparkles className="w-3 h-3"/>
                    )}
                    Enhance with AI
                  </button>
                </div>
                
                {/* Textarea (Themed) */}
                <textarea rows={4} 
                  value={experience.description||''}
                  onChange={(e)=>updateExperience(index,'description',e.target.value)}
                  className="w-full text-sm resize-none"
                  placeholder="Describe your key responsibilities and achievements..."
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;