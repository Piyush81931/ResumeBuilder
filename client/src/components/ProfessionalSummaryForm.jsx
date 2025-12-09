import { Loader2, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../configues/api'
import toast from 'react-hot-toast'

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

const ProfessionalSummaryForm = ({data, onChange, setResumeData}) => {
  const {token} = useSelector(state=>state.auth)
  const [isGenrating, setIsGenrating] = useState(false)
  
  const genrateSummary = async ()=>{
    try {
      setIsGenrating(true)
      const prompt = `enhance my professional summary "${data}`
      // NOTE: DO NOT CHANGE BACKEND LOGIC OR ERROR HANDLING
      const response = await api.post('/api/ai/enhance-pro-sum',{userContent:prompt},{headers:{Authorization:token}})
      setResumeData(prev=>({...prev,professional_summary:response.data.enhanceContent}))
    } catch (error) {
      toast.error(error?.response?.data?.message||error.message)
    }
    finally{
      setIsGenrating(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div style={{color: THEME.text}}>
          <h3 className='flex items-center gap-2 text-lg font-semibold'>
            Professional Summary
          </h3>
          <p className='text-sm' style={{color: `${THEME.text}80`}}>
            Add summary for your resume here
          </p>
        </div>

        {/* AI Enhance Button (Themed and Animated) */}
        <button
          disabled={isGenrating}
          onClick={genrateSummary}
          className='group relative flex items-center gap-2 px-3 py-1 rounded transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm overflow-hidden'
          style={{
            backgroundColor: `${THEME.primary}20`, // Light primary background
            color: THEME.text, // Dark Brown text/icon
            border: `1px solid ${THEME.primary}`,
          }}
          onMouseEnter={(e) => { 
            if (!isGenrating) {
              e.currentTarget.style.backgroundColor = `${THEME.primary}40`; // Darker shade on hover
            }
          }}
          onMouseLeave={(e) => { 
            if (!isGenrating) {
              e.currentTarget.style.backgroundColor = `${THEME.primary}20`; // Revert on mouse leave
            }
          }}
        >
          {isGenrating ? (
            <Loader2 className='size-4 animate-spin'/>
          ) : (
            <Sparkles className='size-4'/>
          )}
          {isGenrating ? 'Enhancing...' : 'AI Enhance'}
        </button>
      </div>
      
      {/* Textarea (Themed) */}
      <div className='mt-6'>
        <textarea rows={7} value={data || ''}
          onChange={(e)=>onChange(e.target.value)}
          className='w-full p-3 px-4 mt-2 border text-sm resize-none outline-none transition-colors'
          style={{
            borderColor: THEME.border,
            borderRadius: '0.5rem',
            color: THEME.text,
            backgroundColor: THEME.surface,
            // Custom focus ring using themed colors
          }}
          // Note: Tailwind classes like focus:ring focus:ring-blue-500 are replaced by inline styles for consistency
          onFocus={(e) => {
            e.target.style.borderColor = THEME.primary;
            e.target.style.boxShadow = `0 0 0 3px ${THEME.primary}40`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = THEME.border;
            e.target.style.boxShadow = 'none';
          }}
          placeholder="Write a compelling professional summary that highlights yourkey strengths and career objectives..."/>
        
        {/* Tip Text (Themed) */}
        <p className='text-xs max-w-4/5 mx-auto text-center' style={{color: `${THEME.text}80`}}>
          Tip: Keep it concise (3-4 sentences) and focus on your most relevant 
          achievements and skills
        </p>
      </div>
    </div>
  )
}

export default ProfessionalSummaryForm