import React from 'react'
import ModernTemplate from './templates/ModernTemplate'
import ClassicTemplate from './templates/ClassicTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'

const ResumePreview = ({data, accentColor, template, classes=""}) => {
    const renderTemplate = ()=>{
        switch (template) {
            case "modern":
                return <ModernTemplate data={data} accentColor={accentColor}/>;
            case "minimal":
                return <MinimalTemplate data={data} accentColor={accentColor}/>;    
             case "minimal-image":
                return <MinimalImageTemplate data={data} accentColor={accentColor}/>;
            default:
                 case "classic":
                return <ClassicTemplate data={data} accentColor={accentColor}/>;
        }
    }
  return (
    <div className='w-full bg-gray-100'>
      <div id='resume-preview' className={'border border-gray-200 print:shadow-none print:border-none' + classes}>
            {renderTemplate()}
      </div>
      <style jsx>
        {`
        @page{
            size:letter;
            margin:0;
        }
        @media print{
            html,body{
                width:8.5in;
                height:11in;
                overflow:hidden;
            }
            body * {
                visibilty: hidden;
            }
            #resume-preview #resume-preview * {
                visibilty: visible;
            }
            #resume-preview{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: auto;
                margin: 0;
                padding: 0;
                box-shadow: none !important;
                border: none !important;
            }
        }
        `}
      </style>
    </div>
  )
}

export default ResumePreview
