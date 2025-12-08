import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, Sparkles, Wand2 } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../configues/api";
import toast from "react-hot-toast";
import ModernTemplate from "../components/templates/ModernTemplate";
import ClassicTemplate from "../components/templates/ClassicTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";
import MinimalImageTemplate from "../components/templates/MinimalImageTemplate";
import ComparisonModal from "../components/ComparisonModal";

const ResumeAnalyze = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  
  const [resumeData, setResumeData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loadingResume, setLoadingResume] = useState(true);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [improvementData, setImprovementData] = useState(null);
  const [loadingImprovement, setLoadingImprovement] = useState(false);

  // Load resume data
  const loadResume = async () => {
    try {
      setLoadingResume(true);
      const { data } = await api.get(`api/resumes/get/${resumeId}`, {
        headers: { Authorization: token },
      });
      if (data.resume) {
        setResumeData(data.resume);
        document.title = `Analyzing: ${data.resume.title}`;
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to load resume");
    } finally {
      setLoadingResume(false);
    }
  };

  // Analyze resume
  const analyzeResume = async () => {
    try {
      setLoadingAnalysis(true);
      const { data: result } = await api.post(
        `/api/ai/analyze/${resumeId}`,
        {},
        { headers: { Authorization: token } }
      );
      
      if (result.success) {
        setAnalysisData(result.analysis);
      } else {
        toast.error(result.message || "Analysis failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // Render template based on selection
  const renderTemplate = () => {
    if (!resumeData) return null;
    
    switch (resumeData.template) {
      case "modern":
        return <ModernTemplate data={resumeData} accentColor={resumeData.accent_color} />;
      case "minimal":
        return <MinimalTemplate data={resumeData} accentColor={resumeData.accent_color} />;
      case "minimal-image":
        return <MinimalImageTemplate data={resumeData} accentColor={resumeData.accent_color} />;
      default:
      case "classic":
        return <ClassicTemplate data={resumeData} accentColor={resumeData.accent_color} />;
    }
  };

  // Auto-Fix: Get AI improvements
  const handleAutoFix = async () => {
    try {
      setLoadingImprovement(true);
      setShowComparisonModal(true);

      const { data: result } = await api.post(
        `/api/ai/improve/${resumeId}`,
        { analysisData },
        { headers: { Authorization: token } }
      );

      if (result.success) {
        setImprovementData(result);
      } else {
        toast.error(result.message || "Failed to generate improvements");
        setShowComparisonModal(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate improvements. Please try again.");
      setShowComparisonModal(false);
    } finally {
      setLoadingImprovement(false);
    }
  };

  // Apply selected improvements
  const handleApplyImprovements = async (dataToApply, appliedSections) => {
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(dataToApply));

      const { data } = await api.put(`api/resumes/update`, formData, {
        headers: { Authorization: token },
      });

      if (data.resume) {
        toast.success("✨ Resume improved successfully!");
        setShowComparisonModal(false);
        
        // Store which sections were changed in localStorage for animation
        localStorage.setItem('changedSections', JSON.stringify(appliedSections));
        
        // Redirect back to builder
        navigate(`/app/builder/${resumeId}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to apply improvements.");
    }
  };

  useEffect(() => {
    loadResume();
  }, []);

  useEffect(() => {
    if (resumeData) {
      analyzeResume();
    }
  }, [resumeData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link
              to={`/app/builder/${resumeId}`}
              className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
            >
              <ArrowLeftIcon className="size-4" />
              Back to Editor
            </Link>
            
            <div className="flex items-center gap-3">
              <button
                onClick={analyzeResume}
                disabled={loadingAnalysis}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                <Sparkles className="size-4" />
                {loadingAnalysis ? "Analyzing..." : "Re-analyze"}
              </button>
              
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                onClick={handleAutoFix}
                disabled={!analysisData || loadingImprovement}
              >
                <Wand2 className="size-4" />
                {loadingImprovement ? "Processing..." : "Auto-Fix Issues"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Split Screen Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 pb-12">
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* LEFT: Resume Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Your Resume</h2>
              <p className="text-sm text-gray-600">Preview of your current resume</p>
            </div>
            
            <div className="p-6">
              {loadingResume ? (
                <ResumePreviewSkeleton />
              ) : (
                <div className="bg-white border border-gray-200 shadow-sm">
                  {renderTemplate()}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Analysis Results */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">AI Analysis</h2>
              <p className="text-sm text-gray-600">Insights and recommendations</p>
            </div>
            
            <div className="p-6">
              {loadingAnalysis ? (
                <AnalysisSkeleton />
              ) : analysisData ? (
                <AnalysisContent data={analysisData} />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Sparkles className="size-12 mx-auto mb-4 text-gray-300" />
                  <p>Click "Analyze" to get AI insights</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Comparison Modal */}
      {showComparisonModal && improvementData && (
        <ComparisonModal
          originalData={improvementData.originalData}
          improvedData={improvementData.improvements.improved}
          changes={improvementData.improvements.changes}
          onApply={handleApplyImprovements}
          onClose={() => setShowComparisonModal(false)}
          loading={loadingImprovement}
        />
      )}
    </div>
  );
};

// Skeleton Loader for Resume Preview
const ResumePreviewSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-24 bg-gray-200 rounded"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    <div className="h-32 bg-gray-200 rounded"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
    </div>
  </div>
);

// Skeleton Loader for Analysis
const AnalysisSkeleton = () => (
  <div className="animate-pulse space-y-6">
    {/* Overall Score Skeleton */}
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 bg-gray-200 rounded-2xl"></div>
      <div className="flex-1 space-y-2">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>

    {/* Critical Issues Skeleton */}
    <div className="bg-gray-100 rounded-xl p-5 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>

    {/* Quick Wins Skeleton */}
    <div className="bg-gray-100 rounded-xl p-5 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
    </div>

    {/* Sections Skeleton */}
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-100 rounded-xl p-5 space-y-3">
          <div className="flex justify-between">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      ))}
    </div>
  </div>
);

// Analysis Content Component
const AnalysisContent = ({ data }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-500' };
    if (score >= 75) return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-500' };
    if (score >= 60) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-500' };
    return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-500' };
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Strong';
    if (score >= 60) return 'Good';
    return 'Needs Work';
  };

  const overallColor = getScoreColor(data.overallScore);

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className={`${overallColor.bg} border-2 ${overallColor.border} rounded-xl p-6`}>
        <div className="flex items-center gap-4">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-white/90 to-white/70 flex flex-col items-center justify-center shadow-lg border-2 ${overallColor.border}`}>
            <span className={`text-3xl font-bold ${overallColor.text}`}>{data.overallScore}</span>
            <span className="text-xs font-medium text-gray-600">/ 100</span>
          </div>
          <div>
            <h3 className={`text-2xl font-bold ${overallColor.text} mb-1`}>
              {getScoreLabel(data.overallScore)}
            </h3>
            <p className="text-sm text-gray-600">{data.summary}</p>
          </div>
        </div>
      </div>

      {/* Critical Issues */}
      {data.criticalIssues && data.criticalIssues.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-3 text-lg">Critical Issues</h3>
              <div className="space-y-2">
                {data.criticalIssues.map((issue, i) => (
                  <p key={i} className="text-red-800 text-sm leading-relaxed">• {issue}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Wins */}
      {data.quickWins && data.quickWins.length > 0 && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-900 mb-3 text-lg">Quick Wins</h3>
              <div className="space-y-2">
                {data.quickWins.map((win, i) => (
                  <p key={i} className="text-emerald-800 text-sm leading-relaxed">• {win}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Scores */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
          <span className="text-xl">📊</span>
          Detailed Breakdown
        </h3>
        {data.sections?.map((section, i) => {
          const sectionColor = getScoreColor(section.score);
          return (
            <div key={i} className="bg-white border-2 border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 text-lg">{section.name}</h4>
                <div className={`${sectionColor.bg} ${sectionColor.text} px-4 py-2 rounded-full font-bold text-lg border-2 ${sectionColor.border}`}>
                  {section.score}/100
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="text-green-600 text-lg mt-0.5">✓</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-green-700 uppercase mb-1">Strength</p>
                    <p className="text-sm text-gray-700">{section.topStrength}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <span className="text-blue-600 text-lg mt-0.5">→</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-blue-700 uppercase mb-1">Improve</p>
                    <p className="text-sm text-gray-700">{section.topImprovement}</p>
                  </div>
                </div>

                {section.keywords && section.keywords.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Key Terms</p>
                    <div className="flex flex-wrap gap-2">
                      {section.keywords.map((keyword, ki) => (
                        <span key={ki} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResumeAnalyze;