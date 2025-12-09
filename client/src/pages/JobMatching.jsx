import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configues/api";
import toast from "react-hot-toast";
import { 
  ArrowLeftIcon, 
  Target, 
  Sparkles, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Key,
  RefreshCw,
  X
} from "lucide-react";

// --- CUSTOM THEME DEFINITION ---
const THEME = {
  bg: '#faedcd',    // Creamy main background
  text: '#99582a',  // Dark brown/warm primary text
  primary: '#bb9457', // Primary accent (Muted Gold/Brown)
  secondary: '#d4a373', // Secondary accent (Lighter Tan)
  surface: '#f8f1de', // Lighter surface/card background
  border: '#d4a373',  // Border color
  
  // Standardizing status colors using Tailwind shades for utility and visibility
  success: { bg: '#e6ffed', text: '#22c55e', border: '#22c55e' },  // Green-50, Green-600
  warning: { bg: '#fffbe5', text: '#f59e0b', border: '#f59e0b' },  // Amber-50, Amber-600
  danger: { bg: '#ffe5e5', text: '#ef4444', border: '#ef4444' },   // Red-50, Red-600
  info: { bg: '#eef2ff', text: '#4f46e5', border: '#4f46e5' },    // Indigo/Blue for neutral info
};

const JobMatching = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  
  const [resumeData, setResumeData] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showComparison, setShowComparison] = useState(false); // Retained but not used in this file's JSX

  // Load resume data (LOGIC UNCHANGED)
  useEffect(() => {
    const loadResume = async () => {
      try {
        const { data } = await api.get(`api/resumes/get/${resumeId}`, {
          headers: { Authorization: token },
        });
        if (data.resume) {
          setResumeData(data.resume);
          document.title = `Job Match - ${data.resume.title}`;
        }
      } catch (error) {
        console.log(error.message);
        toast.error("Failed to load resume");
      }
    };
    loadResume();
  }, [resumeId, token]);

  // Analyze job match (LOGIC UNCHANGED)
  const handleAnalyze = async () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      toast.error("Please enter a complete job description (at least 50 characters)");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post(
        `/api/ai/job-match/${resumeId}`,
        { jobDescription },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        setAnalysisResult(data);
        toast.success("Analysis complete!");
      } else {
        toast.error(data.message || "Analysis failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to analyze job match. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Apply tailored resume (LOGIC UNCHANGED)
  const handleApplyTailoring = async () => {
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(analysisResult.analysis.tailoredSections));

      const { data } = await api.put(`api/resumes/update`, formData, {
        headers: { Authorization: token },
      });

      if (data.resume) {
        toast.success("✨ Resume tailored successfully!");
        
        // Store job-tailored flag
        localStorage.setItem('jobTailored', 'true');
        
        // Redirect to builder
        navigate(`/app/builder/${resumeId}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to apply changes.");
    }
  };

  // Helper function for score color (STYLES ADJUSTED)
  const getScoreColor = (score) => {
    // Using THEME colors, with primary as the 'Good Match' color
    if (score >= 80) return `text-green-600 bg-green-50 border-green-500`; // Green for Excellent
    if (score >= 60) return `text-[${THEME.primary}] bg-[${THEME.surface}] border-[${THEME.primary}]`; // Primary/Surface for Good
    if (score >= 40) return `text-amber-600 bg-amber-50 border-amber-500`; // Amber for Fair
    return `text-red-600 bg-red-50 border-red-500`; // Red for Needs Improvement
  };

  // Helper function for priority color (STYLES ADJUSTED)
  const getPriorityColor = (priority) => {
    if (priority === "CRITICAL") return `bg-[${THEME.danger.bg}] text-[${THEME.danger.text}] border-[${THEME.danger.border}]`;
    if (priority === "HIGH") return `bg-[${THEME.warning.bg}] text-[${THEME.warning.text}] border-[${THEME.warning.border}]`;
    return `bg-[${THEME.info.bg}] text-[${THEME.info.text}] border-[${THEME.info.border}]`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: THEME.bg }}>
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10" style={{ borderBottomColor: THEME.border }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link
              to={`/app/builder/${resumeId}`}
              className="inline-flex gap-2 items-center font-medium transition-all"
              style={{ color: THEME.text }}
            >
              <ArrowLeftIcon className="size-4" />
              Back to Editor
            </Link>
            
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" style={{ color: THEME.primary }} />
              <h1 className="text-lg font-semibold" style={{ color: THEME.text }}>Job Matching</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Job Description Input */}
        {!analysisResult && (
          <div className="rounded-xl shadow-lg p-8" style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}` }}>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: THEME.bg, border: `2px solid ${THEME.primary}` }}>
                  <Sparkles className="w-8 h-8" style={{ color: THEME.primary }} />
                </div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: THEME.text }}>
                  Tailor Your Resume for This Job
                </h2>
                <p className="text-gray-600">
                  Paste the job description below and let AI analyze how well your resume matches
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: THEME.text }}>
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the complete job description here..."
                    className="w-full h-64 px-4 py-3 border-2 rounded-lg transition-all resize-none"
                    style={{ borderColor: THEME.border, focusBorderColor: THEME.primary, focusRingColor: THEME.secondary, backgroundColor: THEME.bg }}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {jobDescription.length} characters (minimum 50 required)
                  </p>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={loading || jobDescription.trim().length < 50}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 text-white rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: THEME.primary, hoverBackgroundColor: THEME.secondary }}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5" />
                      Analyze Job Match
                    </>
                  )}
                </button>
            </div>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            
            {/* Match Score Overview */}
            <div className="rounded-xl shadow-lg p-8" style={{ backgroundColor: THEME.surface, border: `2px solid ${THEME.primary}` }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: THEME.text }}>Match Analysis</h3>
                  <p className="text-gray-600">How well your resume matches this job</p>
                </div>
                <button
                  onClick={() => setAnalysisResult(null)}
                  className="hover:opacity-75 transition p-1 rounded-full"
                  style={{ color: THEME.text }}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-8 grid md:grid-cols-2 gap-8">
                {/* Current Score */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Current Match</p>
                  <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-4 ${getScoreColor(analysisResult.analysis.matchScore)}`}>
                    <span className="text-4xl font-bold">{analysisResult.analysis.matchScore}%</span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-gray-700">
                    {analysisResult.analysis.matchScore >= 80 ? "Excellent Match!" :
                     analysisResult.analysis.matchScore >= 60 ? "Good Match" :
                     analysisResult.analysis.matchScore >= 40 ? "Fair Match" : "Needs Improvement"}
                  </p>
                </div>

                {/* Potential Score */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">After Tailoring</p>
                  <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-4 ${getScoreColor(analysisResult.analysis.newMatchScore)}`}>
                    <span className="text-4xl font-bold">{analysisResult.analysis.newMatchScore}%</span>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-medium text-green-600">
                      +{analysisResult.analysis.newMatchScore - analysisResult.analysis.matchScore}% improvement
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowComparison(!showComparison)}
                className="mt-8 w-full px-6 py-3 bg-white border-2 rounded-xl font-semibold hover:opacity-90 transition-all"
                style={{ color: THEME.primary, borderColor: THEME.primary, backgroundColor: THEME.bg }}
              >
                {showComparison ? "Hide" : "View"} Detailed Comparison
              </button>
            </div>

            {/* Detailed Analysis */}
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Strong Matches */}
              <div className="bg-white rounded-xl shadow-sm border-2 p-6" style={{ borderColor: THEME.success.border }}>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6" style={{ color: THEME.success.text }} />
                  <h4 className="text-lg font-semibold" style={{ color: THEME.text }}>
                    Strong Matches ({analysisResult.analysis.strongMatches?.length || 0})
                  </h4>
                </div>
                <div className="space-y-3">
                  {analysisResult.analysis.strongMatches?.map((match, i) => (
                    <div key={i} className="rounded-lg p-3" style={{ backgroundColor: THEME.success.bg }}>
                      <p className="font-semibold text-sm" style={{ color: THEME.success.text }}>{match.skill}</p>
                      <p className="text-xs mt-1" style={{ color: THEME.success.text }}>{match.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weak Matches */}
              <div className="bg-white rounded-xl shadow-sm border-2 p-6" style={{ borderColor: THEME.warning.border }}>
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6" style={{ color: THEME.warning.text }} />
                  <h4 className="text-lg font-semibold" style={{ color: THEME.text }}>
                    Needs Emphasis ({analysisResult.analysis.weakMatches?.length || 0})
                  </h4>
                </div>
                <div className="space-y-3">
                  {analysisResult.analysis.weakMatches?.map((match, i) => (
                    <div key={i} className="rounded-lg p-3" style={{ backgroundColor: THEME.warning.bg }}>
                      <p className="font-semibold text-sm" style={{ color: THEME.warning.text }}>{match.skill}</p>
                      <p className="text-xs mt-1" style={{ color: THEME.warning.text }}>💡 {match.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="bg-white rounded-xl shadow-sm border-2 p-6" style={{ borderColor: THEME.danger.border }}>
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="w-6 h-6" style={{ color: THEME.danger.text }} />
                  <h4 className="text-lg font-semibold" style={{ color: THEME.text }}>
                    Missing Skills ({analysisResult.analysis.missingSkills?.length || 0})
                  </h4>
                </div>
                <div className="space-y-3">
                  {analysisResult.analysis.missingSkills?.map((skill, i) => (
                    <div key={i} className="rounded-lg p-3" style={{ backgroundColor: THEME.danger.bg }}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm" style={{ color: THEME.danger.text }}>{skill.skill}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(skill.priority)}`}>
                          {skill.priority}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: THEME.danger.text }}>❓ {skill.question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Missing Keywords */}
            {analysisResult.analysis.missingKeywords?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6" style={{ borderColor: THEME.border }}>
                <div className="flex items-center gap-3 mb-4">
                  <Key className="w-6 h-6" style={{ color: THEME.primary }} />
                  <h4 className="text-lg font-semibold" style={{ color: THEME.text }}>
                    Missing ATS Keywords ({analysisResult.analysis.missingKeywords.length})
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.analysis.missingKeywords.map((keyword, i) => (
                    <span key={i} className="px-4 py-2 rounded-full text-sm font-medium border" style={{ backgroundColor: THEME.bg, color: THEME.text, borderColor: THEME.border }}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Improvement Tips */}
            {analysisResult.analysis.improvementTips?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6" style={{ borderColor: THEME.border }}>
                <h4 className="text-lg font-semibold mb-4" style={{ color: THEME.text }}>💡 Quick Tips</h4>
                <ul className="space-y-2">
                  {analysisResult.analysis.improvementTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="mt-1" style={{ color: THEME.primary }}>•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Apply Button */}
            <div className="sticky bottom-4 rounded-xl shadow-lg border p-6" style={{ backgroundColor: THEME.surface, borderColor: THEME.border }}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold" style={{ color: THEME.text }}>Ready to tailor your resume?</h4>
                  <p className="text-sm text-gray-600">AI will enhance your resume with job-specific keywords</p>
                </div>
                <button
                  onClick={handleApplyTailoring}
                  className="flex items-center gap-2 px-8 py-3 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:opacity-90"
                  style={{ backgroundColor: THEME.primary }}
                >
                  <Sparkles className="w-5 h-5" />
                  Apply Tailoring
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default JobMatching;