import { Code, Plus, Trash2 } from 'lucide-react'
import React, { useRef } from 'react'
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

const ProjectForm = ({data, onChange}) => {
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

    const addProject = ()=>{
      const newProject = {
        name: '',
        type: '',
        description:'',
      }
      onChange([...data,newProject])

      // GSAP: Animate the new item addition
      setTimeout(() => {
          const items = formRef.current.querySelectorAll('.project-item');
          if (items.length > 0) {
              gsap.from(items[items.length - 1], { 
                  opacity: 0, 
                  y: 10, 
                  duration: 0.3 
              });
          }
      }, 50);
    }

    const removeProject= (index, e)=>{
      const itemElement = e.currentTarget.closest('.project-item');
      
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

    const updateProject = (index, field, value)=>{
      const updated = [...data]
      updated[index] = {...updated[index], [field]:value}
      onChange(updated)
    }

    return (
      <div ref={formRef}>
        <div className="flex items-center justify-between">
          <div style={{ color: THEME.text }}>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              Projects
            </h3>
            <p className="text-sm" style={{ color: `${THEME.text}80` }}>
              Add your projects
            </p>
          </div>
          
          {/* Add Project Button (Themed & Animated) */}
          <button
            onClick={addProject}
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
            Add Project
          </button>
        </div>

        {/* Project List */}
        {data.length === 0 ? (
          <div className='text-center py-8 mt-6' style={{ color: `${THEME.text}80` }}>
            <Code className="w-12 h-12 mx-auto mb-3" style={{ color: `${THEME.border}80` }}/>
            <p>No projects added yet.</p>
            <p className="text-sm">Click "Add Project" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4 mt-6">
            {data.map((project,index)=>(
              <div key={index}
                className="project-item p-4 rounded-lg space-y-3 shadow-sm"
                style={{
                  border: `1px solid ${THEME.border}`,
                  backgroundColor: THEME.surface,
                  color: THEME.text,
                }}>
                
                <div className="flex items-center justify-between">
                  <h4>Project #{index+1}</h4>
                  {/* Trash Button (Themed) */}
                  <button 
                    onClick={(e)=>removeProject(index, e)}
                    className="transition-colors hover:scale-110"
                    style={{ color: '#EF4444' }}
                  >
                    <Trash2 className="size-4"/>
                  </button>
                </div>
                
                <div className="grid gap-3">
                  {/* Project Name */}
                  <input 
                    value={project.name||''}
                    onChange={(e)=>updateProject(index, "name",e.target.value)}
                    type="text" placeholder="Project Name"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />

                  {/* Project Type */}
                  <input 
                    value={project.type||''}
                    onChange={(e)=>updateProject(index, "type",e.target.value)}
                    type="text" placeholder="Project type (e.g., Personal, Academic, Open Source)"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />

                  {/* Description */}
                  <textarea
                    rows={4} 
                    value={project.description||''}
                    onChange={(e)=>updateProject(index, "description",e.target.value)}
                    placeholder='Describe your project (technologies used, impact, results...)'
                    className="w-full resize-none"
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
    )
}

export default ProjectForm