import React from "react";
import { useNavigate } from "react-router-dom";
import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import MinimalImageTemplate from "./templates/MinimalImageTemplate";
import { Sparkles } from "lucide-react";

const ResumePreview = ({ data, accentColor, template, classes = "" }) => {
  const navigate = useNavigate();

  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} accentColor={accentColor} />;
      case "minimal":
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      case "minimal-image":
        return (
          <MinimalImageTemplate data={data} accentColor={accentColor} />
        );
      default:
      case "classic":
        return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  };

  const handleAnalyzeClick = () => {
    // Navigate to the analysis page
    navigate(`/app/analyze/${data._id}`);
  };

  return (
    <div className="w-full bg-gray-100">
       {/* Analyze Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAnalyzeClick}
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          <Sparkles className="size-4" />
           AI Analyze
        </button>
      </div>
      {/* Resume Block */}
      <div
        id="resume-preview"
        className={`border border-gray-200 print:shadow-none print:border-none ${classes}`}
      >
        {renderTemplate()}
      </div>

      {/* Print CSS */}
      <style jsx>
        {`
          @page {
            size: letter;
            margin: 0;
          }
          @media print {
            html,
            body {
              width: 8.5in;
              height: 11in;
              overflow: hidden;
            }
            body * {
              visibility: hidden;
            }
            #resume-preview,
            #resume-preview * {
              visibility: visible;
            }
            #resume-preview {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              margin: 0;
              padding: 0;
              border: none !important;
              box-shadow: none !important;
            }
          }
        `}
      </style>
           
    </div>
  );
};

export default ResumePreview;