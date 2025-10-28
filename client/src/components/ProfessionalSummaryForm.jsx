import { Loader2, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../configues/api'
import toast from 'react-hot-toast'
const ProfessionalSummaryForm = ({data, onChange, setResumeData}) => {
  const {token} = useSelector(state=>state.auth)
  const [isGenrating, setIsGenrating] = useState(false)
  const genrateSummary = async ()=>{
    try {
      setIsGenrating(true)
      const prompt = `enhance my professional summary "${data}`
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
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold'>
                Professional Summary</h3>
            <p className='text-gray-500 text-sm'>
                Add summary for your resume here</p>
        </div>
        <button
        disabled={isGenrating}
        onClick={genrateSummary}
         className='flex items-center gap-2 px-3 py-1 bg-purple-100
        text-purple-700 rounded hover:bg-purple-200 transition-all
        disabled:opacity-50'>
          {isGenrating ? (<Loader2 className='size-4 animate-spin'/>):(<Sparkles className='size-4'/>)}
          {isGenrating ? 'Enhancing...':'AI Enhance'}

        </button>
      </div>
      <div className='mt-6'>
        <textarea rows={7} value={data || ''}
        onChange={(e)=>onChange(e.target.value)}
        className='w-full p-3 px-4 mt-2 border text-sm border-gray-300
        rounded-lg focus:ring focus:ring-blue-500 
        focus:border-blue-500 outline-none transition-colors resize-none'
        placeholder="Write a compelling professional summary that highlights yourkey strengths and career objectives..."/>
        <p className='text-xs text-gray-500 max-w-4/5 mx-auto text-center '>
            Tip: Keep it concise (3-4 sentences) and focus on your most relevant 
            achievements and skills
        </p>
      </div>
    </div>
  )
}

export default ProfessionalSummaryForm
