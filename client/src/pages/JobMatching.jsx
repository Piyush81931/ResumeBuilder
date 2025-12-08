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
  RefreshCw
} from "lucide-react";

const JobMatching = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  
  const [resumeData, setResumeData] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  // Load resume data
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

  // Analyze job match
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

  // Apply tailored resume
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

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-500";
    if (score >= 60) return "text-blue-600 bg-blue-50 border-blue-500";
    if (score >= 40) return "text-amber-600 bg-amber-50 border-amber-500";
    return "text-red-600 bg-red-50 border-red-500";
  };

  const getPriorityColor = (priority) => {
    if (priority === "CRITICAL") return "bg-red-100 text-red-700 border-red-500";
    if (priority === "HIGH") return "bg-orange-100 text-orange-700 border-orange-500";
    return "bg-blue-100 text-blue-700 border-blue-500";
  };

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
            
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              <h1 className="text-lg font-semibold text-gray-800">Job Matching</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Job Description Input */}
        {!analysisResult && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Tailor Your Resume for This Job
                </h2>
                <p className="text-gray-600">
                  Paste the job description below and let AI analyze how well your resume matches
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the complete job description here...

Example:
Senior Software Engineer at Google

Requirements:
- 5+ years of experience with React and Node.js
- Strong problem-solving skills
- Experience with AWS and Docker
..."
                    className="w-full h-64 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {jobDescription.length} characters (minimum 50 required)
                  </p>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={loading || jobDescription.trim().length < 50}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-sm border-2 border-purple-200 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Match Analysis</h3>
                  <p className="text-gray-600">How well your resume matches this job</p>
                </div>
                <button
                  onClick={() => setAnalysisResult(null)}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <XCircle className="w-6 h-6" />
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
                className="mt-8 w-full px-6 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all"
              >
                {showComparison ? "Hide" : "View"} Detailed Comparison
              </button>
            </div>

            {/* Detailed Analysis */}
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Strong Matches */}
              <div className="bg-white rounded-xl shadow-sm border-2 border-green-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h4 className="text-lg font-semibold text-gray-800">
                    Strong Matches ({analysisResult.analysis.strongMatches?.length || 0})
                  </h4>
                </div>
                <div className="space-y-3">
                  {analysisResult.analysis.strongMatches?.map((match, i) => (
                    <div key={i} className="bg-green-50 rounded-lg p-3">
                      <p className="font-semibold text-green-800 text-sm">{match.skill}</p>
                      <p className="text-xs text-green-700 mt-1">{match.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weak Matches */}
              <div className="bg-white rounded-xl shadow-sm border-2 border-amber-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                  <h4 className="text-lg font-semibold text-gray-800">
                    Needs Emphasis ({analysisResult.analysis.weakMatches?.length || 0})
                  </h4>
                </div>
                <div className="space-y-3">
                  {analysisResult.analysis.weakMatches?.map((match, i) => (
                    <div key={i} className="bg-amber-50 rounded-lg p-3">
                      <p className="font-semibold text-amber-800 text-sm">{match.skill}</p>
                      <p className="text-xs text-amber-700 mt-1">💡 {match.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="bg-white rounded-xl shadow-sm border-2 border-red-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <h4 className="text-lg font-semibold text-gray-800">
                    Missing Skills ({analysisResult.analysis.missingSkills?.length || 0})
                  </h4>
                </div>
                <div className="space-y-3">
                  {analysisResult.analysis.missingSkills?.map((skill, i) => (
                    <div key={i} className="bg-red-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-red-800 text-sm">{skill.skill}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(skill.priority)}`}>
                          {skill.priority}
                        </span>
                      </div>
                      <p className="text-xs text-red-700">❓ {skill.question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Missing Keywords */}
            {analysisResult.analysis.missingKeywords?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Key className="w-6 h-6 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-800">
                    Missing ATS Keywords ({analysisResult.analysis.missingKeywords.length})
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.analysis.missingKeywords.map((keyword, i) => (
                    <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Improvement Tips */}
            {analysisResult.analysis.improvementTips?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">💡 Quick Tips</h4>
                <ul className="space-y-2">
                  {analysisResult.analysis.improvementTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Apply Button */}
            <div className="sticky bottom-4 bg-white rounded-xl shadow-lg border-2 border-purple-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">Ready to tailor your resume?</h4>
                  <p className="text-sm text-gray-600">AI will enhance your resume with job-specific keywords</p>
                </div>
                <button
                  onClick={handleApplyTailoring}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
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