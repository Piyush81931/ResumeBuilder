import React, { useState } from 'react';
import { X, Check, RefreshCw, ArrowRight } from 'lucide-react';

const ComparisonModal = ({ originalData, improvedData, changes, onApply, onClose, loading }) => {
  const [selectedChanges, setSelectedChanges] = useState(
    changes.filter(c => c.hasChanges).reduce((acc, change) => {
      acc[change.section] = true; // Accept all by default
      return acc;
    }, {})
  );

  const toggleChange = (section) => {
    setSelectedChanges(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleApply = () => {
    // Build the data to apply based on selected changes
    const dataToApply = {};
    const appliedSections = [];
    
    Object.keys(selectedChanges).forEach(section => {
      if (selectedChanges[section]) {
        const key = section.toLowerCase().replace(/ /g, '_');
        dataToApply[key] = improvedData[key];
        appliedSections.push(key);
      }
    });

    // Pass both data and which sections were changed
    onApply(dataToApply, appliedSections);
  };

  const renderComparison = (section, original, improved) => {
    const isSelected = selectedChanges[section];
    const change = changes.find(c => c.section === section);
    
    if (!change?.hasChanges) return null;

    return (
      <div key={section} className="border-2 border-gray-200 rounded-xl overflow-hidden">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-5 py-3 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-800">{section}</h3>
            <p className="text-xs text-gray-600 mt-0.5">{change.reason}</p>
          </div>
          <button
            onClick={() => toggleChange(section)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              isSelected
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            {isSelected ? (
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4" /> Accept
              </span>
            ) : (
              'Reject'
            )}
          </button>
        </div>

        {/* Comparison Content */}
        <div className="grid md:grid-cols-2 divide-x divide-gray-200">
          {/* Original */}
          <div className="p-4 bg-red-50/30">
            <p className="text-xs font-semibold text-red-700 uppercase mb-2">Original</p>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {typeof original === 'string' ? original : JSON.stringify(original, null, 2)}
            </div>
          </div>

          {/* Improved */}
          <div className="p-4 bg-green-50/30">
            <p className="text-xs font-semibold text-green-700 uppercase mb-2">Improved</p>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {typeof improved === 'string' ? improved : JSON.stringify(improved, null, 2)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const acceptedCount = Object.values(selectedChanges).filter(Boolean).length;
  const totalChanges = changes.filter(c => c.hasChanges).length;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <RefreshCw className="w-6 h-6" />
              Review Auto-Fix Improvements
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {acceptedCount} of {totalChanges} improvements selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">AI is improving your resume...</p>
            </div>
          ) : (
            <>
              {/* Professional Summary */}
              {renderComparison(
                'Professional Summary',
                originalData.professional_summary,
                improvedData.professional_summary
              )}

              {/* Experience */}
              {originalData.experience?.length > 0 && improvedData.experience?.length > 0 && 
               renderComparison(
                'Experience',
                originalData.experience,
                improvedData.experience
              )}

              {/* Education */}
              {originalData.education?.length > 0 && improvedData.education?.length > 0 && 
               renderComparison(
                'Education',
                originalData.education,
                improvedData.education
              )}

              {/* Skills */}
              {originalData.skills?.length > 0 && improvedData.skills?.length > 0 && 
               renderComparison(
                'Skills',
                originalData.skills,
                improvedData.skills
              )}

              {/* Projects */}
              {originalData.project?.length > 0 && improvedData.project?.length > 0 && 
               renderComparison(
                'Projects',
                originalData.project,
                improvedData.project
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className="border-t bg-gray-50 px-6 py-4 flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={acceptedCount === 0}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Apply {acceptedCount} Change{acceptedCount !== 1 ? 's' : ''}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonModal;