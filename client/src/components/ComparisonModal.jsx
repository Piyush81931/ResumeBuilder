import React, { useState } from "react";
import { X, Check, RefreshCw, ArrowRight } from "lucide-react";

// --- CUSTOM THEME DEFINITION ---
const THEME = {
  bg: "#faedcd", // Creamy background
  text: "#99582a", // Dark brown/warm text
  primary: "#bb9457", // Primary accent (Muted Gold/Brown)
  secondary: "#d4a373", // Secondary accent (Lighter Tan)
  surface: "#f8f1de", // Lighter surface/card background
  border: "#d4a373", // Border color // Standardizing success/failure colors for context consistency
  success: "#22c55e",
  danger: "#ef4444",
};

const ComparisonModal = ({
  originalData,
  improvedData,
  changes,
  onApply,
  onClose,
  loading,
}) => {
  const [selectedChanges, setSelectedChanges] = useState(
    changes
      .filter((c) => c.hasChanges)
      .reduce((acc, change) => {
        acc[change.section] = true; // Accept all by default
        return acc;
      }, {})
  );

  const toggleChange = (section) => {
    setSelectedChanges((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleApply = () => {
  const dataToApply = { ...originalData };  // Start with ALL data!
  const appliedSections = [];
  
  Object.keys(selectedChanges).forEach((section) => {
    if (selectedChanges[section]) {
      const key = section.toLowerCase().replace(/ /g, "_");
      dataToApply[key] = improvedData[key];  // Only replace selected parts
      appliedSections.push(key);
    }
  });
   console.log("📤 Sending dataToApply:", dataToApply);
  console.log("📤 Sending appliedSections:", appliedSections);
  onApply(dataToApply, appliedSections);
};

  const renderComparison = (section, original, improved) => {
    const isSelected = selectedChanges[section];
    const change = changes.find((c) => c.section === section);
    if (!change?.hasChanges) return null; // Helper for converting non-string content (like arrays of objects) to readable JSON

    const displayContent = (content) =>
      typeof content === "string" ? content : JSON.stringify(content, null, 2);

    return (
      <div
        key={section}
        className="border-2 rounded-xl overflow-hidden"
        style={{ borderColor: THEME.border }}
      >
                {/* Section Header */}       {" "}
        <div
          className="px-5 py-3 border-b flex justify-between items-center"
          style={{
            backgroundColor: THEME.surface,
            borderBottomColor: THEME.border,
          }}
        >
                   {" "}
          <div>
                       {" "}
            <h3 className="font-semibold" style={{ color: THEME.text }}>
              {section}
            </h3>
                       {" "}
            <p className="text-xs text-gray-600 mt-0.5">{change.reason}</p>     
               {" "}
          </div>
                   {" "}
          <button
            onClick={() => toggleChange(section)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-md ${
              isSelected
                ? "text-white" // Use custom primary color for selected state
                : "bg-gray-300 text-gray-700 hover:bg-gray-400" // Neutral for rejected state
            }`}
            style={{ backgroundColor: isSelected ? THEME.primary : undefined }}
          >
                       {" "}
            {isSelected ? (
              <span className="flex items-center gap-1">
                                <Check className="w-4 h-4" /> Accept        {" "}
              </span>
            ) : (
              "Reject"
            )}
                     {" "}
          </button>
                 {" "}
        </div>
                {/* Comparison Content */}       {" "}
        <div className="grid md:grid-cols-1 divide-x divide-gray-200">
                    {/* Original - Danger Color */}         {" "}
          <div className="p-4" style={{ backgroundColor: "#ffe6e6" }}>
            {" "}
            {/* Light Red background for contrast/warning */}           {" "}
            <p
              className="text-xs font-semibold uppercase mb-2"
              style={{ color: THEME.danger }}
            >
              Original (To be replaced)
            </p>
                       {" "}
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
                            {displayContent(original)}           {" "}
            </div>
                     {" "}
          </div>
                    {/* Improved - Success Color */}         {" "}
          <div className="p-4" style={{ backgroundColor: "#e6fff5" }}>
            {" "}
            {/* Light Green background for contrast/success */}           {" "}
            <p
              className="text-xs font-semibold uppercase mb-2"
              style={{ color: THEME.success }}
            >
              Improved (AI Suggestion)
            </p>
                       {" "}
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
                            {displayContent(improved)}           {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
    );
  };

  const acceptedCount = Object.values(selectedChanges).filter(Boolean).length;
  const totalChanges = changes.filter((c) => c.hasChanges).length;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           {" "}
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}       {" "}
        <div
          className="px-6 py-4 text-white flex justify-between items-center"
          style={{ backgroundColor: THEME.primary }}
        >
                   {" "}
          <div>
                       {" "}
            <h2
              className="text-2xl font-bold flex items-center gap-2"
              style={{ color: THEME.surface }}
            >
                            <RefreshCw className="w-6 h-6" />             
              Review Auto-Fix Improvements            {" "}
            </h2>
                       {" "}
            <p className="text-sm mt-1" style={{ color: THEME.surface }}>
                            {acceptedCount} of {totalChanges} improvements
              selected            {" "}
            </p>
                     {" "}
          </div>
                   {" "}
          <button
            onClick={onClose}
            className="rounded-full p-2 transition"
            style={{ color: THEME.surface, backgroundColor: THEME.secondary }}
          >
                        <X className="w-6 h-6" />         {" "}
          </button>
                 {" "}
        </div>
                {/* Content */}       {" "}
        <div
          className="flex-1 overflow-y-auto p-6 space-y-4"
          style={{ backgroundColor: THEME.bg }}
        >
                   {" "}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
                           {" "}
              <RefreshCw
                className="w-12 h-12 animate-spin mb-4"
                style={{ color: THEME.primary }}
              />
                           {" "}
              <p className="text-gray-600">AI is improving your resume...</p>   
                     {" "}
            </div>
          ) : (
            <>
                            {/* Professional Summary */}             {" "}
              {renderComparison(
                "Professional Summary",
                originalData.professional_summary,
                improvedData.professional_summary
              )}
                            {/* Experience */}             {" "}
              {originalData.experience?.length > 0 &&
                improvedData.experience?.length > 0 &&
                renderComparison(
                  "Experience",
                  originalData.experience,
                  improvedData.experience
                )}
                            {/* Education */}             {" "}
              {originalData.education?.length > 0 &&
                improvedData.education?.length > 0 &&
                renderComparison(
                  "Education",
                  originalData.education,
                  improvedData.education
                )}
                            {/* Skills */}             {" "}
              {originalData.skills?.length > 0 &&
                improvedData.skills?.length > 0 &&
                renderComparison(
                  "Skills",
                  originalData.skills,
                  improvedData.skills
                )}
                            {/* Projects */}             {" "}
              {originalData.project?.length > 0 &&
                improvedData.project?.length > 0 &&
                renderComparison(
                  "Projects",
                  originalData.project,
                  improvedData.project
                )}
                         {" "}
            </>
          )}
                 {" "}
        </div>
                {/* Footer */}       {" "}
        {!loading && (
          <div
            className="border-t px-6 py-4 flex justify-between items-center"
            style={{
              backgroundColor: THEME.surface,
              borderColor: THEME.border,
            }}
          >
                       {" "}
            <button
              onClick={onClose}
              className="px-6 py-2 border-2 rounded-lg font-semibold transition"
              style={{
                borderColor: THEME.secondary,
                color: THEME.text,
                backgroundColor: THEME.bg,
              }}
            >
                            Cancel            {" "}
            </button>
                       {" "}
            <button
              onClick={handleApply}
              disabled={acceptedCount === 0}
              className="px-8 py-3 text-white rounded-xl font-semibold transition-all shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ backgroundColor: THEME.primary }}
            >
                            Apply {acceptedCount} Change
              {acceptedCount !== 1 ? "s" : ""}
                            <ArrowRight className="w-5 h-5" />           {" "}
            </button>
                     {" "}
          </div>
        )}
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default ComparisonModal;
