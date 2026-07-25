import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Wand2, TrendingUp, Award, Zap } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../configues/api";
import toast from "react-hot-toast";
import ModernTemplate from "../components/templates/ModernTemplate";
import ClassicTemplate from "../components/templates/ClassicTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";
import MinimalImageTemplate from "../components/templates/MinimalImageTemplate";
import ComparisonModal from "../components/ComparisonModal";

const THEME = {
  bg: '#faedcd',
  text: '#99582a',
  primary: '#bb9457',
  secondary: '#d4a373',
  surface: '#f8f1de',
  border: '#d4a373',
};

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

  const headerRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);

  // GSAP Animations
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gsap) {
      const gsap = window.gsap;
      
      // Header animation
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });

      // Panels slide in
      gsap.from(leftPanelRef.current, {
        x: -50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out"
      });

      gsap.from(rightPanelRef.current, {
        x: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out"
      });
    }
  }, []);

  useEffect(() => {
    // Load GSAP
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
        console.log("📊 Analysis Data being sent:", analysisData);
console.log("✅ Result from API:", result);
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
  // Apply selected improvements
const handleApplyImprovements = async (dataToApply, appliedSections) => {
  try {
    console.log("🎯 Received dataToApply:", dataToApply);
    
    // Ensure we have ALL required fields from the original resume
    const completeResumeData = {
      full_name: resumeData.full_name || "",
      profession: resumeData.profession || "",
      email: resumeData.email || "",
      phone: resumeData.phone || "",
      location: resumeData.location || "",
      professional_summary: dataToApply.professional_summary || resumeData.professional_summary || "",
      experience: dataToApply.experience || resumeData.experience || [],
      education: dataToApply.education || resumeData.education || [],
      skills: dataToApply.skills || resumeData.skills || [],
      project: dataToApply.project || resumeData.project || []
    };
    
    // Convert skills to array if it's a string
    if (typeof completeResumeData.skills === 'string') {
      completeResumeData.skills = completeResumeData.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }
    
    console.log("📦 Complete resume data being sent:", completeResumeData);

    const formData = new FormData();
    formData.append("resumeId", resumeId);
    formData.append("resumeData", JSON.stringify(completeResumeData));

    const { data } = await api.put(`api/resumes/update`, formData, {
      headers: { Authorization: token },
    });

    if (data.resume) {
      toast.success("✨ Resume improved successfully!");
      setShowComparisonModal(false);
      
      localStorage.setItem('changedSections', JSON.stringify(appliedSections));
      navigate(`/app/builder/${resumeId}`);
    }
  } catch (error) {
    console.log("❌ Error:", error);
    console.log("❌ Error response:", error.response?.data);
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
    <div className="min-h-screen" style={{ backgroundColor: THEME.bg }}>
      {/* Header */}
      <div ref={headerRef} className="border-t-2 border-b sticky top-0 z-10 backdrop-blur-sm" style={{ 
        backgroundColor: `${THEME.surface}f0`,
        borderColor: THEME.border 
      }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <AnimatedBackButton resumeId={resumeId} />
            
            <div className="flex items-center gap-3">
              <AnimatedButton
                onClick={analyzeResume}
                disabled={loadingAnalysis}
                icon={<Sparkles className="size-4" />}
                text={loadingAnalysis ? "Analyzing..." : "Re-analyze"}
                variant="secondary"
              />
              
              <AnimatedButton
                onClick={handleAutoFix}
                disabled={!analysisData || loadingImprovement}
                icon={<Wand2 className="size-4" />}
                text={loadingImprovement ? "Processing..." : "Auto-Fix Issues"}
                variant="primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Split Screen Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 pb-12">
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* LEFT: Resume Preview */}
          <div ref={leftPanelRef} className="rounded-2xl shadow-lg border-2" style={{
            backgroundColor: 'white',
            borderColor: THEME.border
          }}>
            <div className="px-6 py-4 border-b-2 rounded-t-2xl" style={{
              background: `linear-gradient(135deg, ${THEME.surface} 0%, ${THEME.bg} 100%)`,
              borderColor: THEME.border
            }}>
              <h2 className="text-lg font-semibold" style={{ color: THEME.text }}>Your Resume</h2>
              <p className="text-sm opacity-70" style={{ color: THEME.text }}>Preview of your current resume</p>
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
          <div ref={rightPanelRef} className="rounded-2xl shadow-lg border-2" style={{
            backgroundColor: THEME.surface,
            borderColor: THEME.border
          }}>
            <div className="px-6 py-4 border-b-2 rounded-t-2xl relative overflow-hidden" style={{
              background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.secondary} 100%)`,
              borderColor: THEME.border
            }}>
              <div className="relative z-10">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="size-5" />
                  AI Analysis
                </h2>
                <p className="text-sm text-white/90">Insights and recommendations</p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            </div>
            
            <div className="p-6">
              {loadingAnalysis ? (
                <AnalysisSkeleton />
              ) : analysisData ? (
                <AnalysisContent data={analysisData} />
              ) : (
                <div className="text-center py-12" style={{ color: THEME.text }}>
                  <Sparkles className="size-12 mx-auto mb-4 opacity-30" style={{ color: THEME.primary }} />
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

// Animated Back Button
const AnimatedBackButton = ({ resumeId }) => {
  const buttonRef = useRef(null);

  const handleMouseEnter = () => {
    if (window.gsap) {
      window.gsap.to(buttonRef.current, {
        x: -5,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (window.gsap) {
      window.gsap.to(buttonRef.current, {
        x: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  return (
    <Link
      to={`/app/builder/${resumeId}`}
      ref={buttonRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-flex gap-2 items-center px-4 py-2 rounded-lg transition-all font-medium"
      style={{
        color: THEME.text,
        backgroundColor: 'transparent'
      }}
    >
      <ArrowLeft className="size-4" />
      Back to Editor
    </Link>
  );
};

// Animated Button Component
const AnimatedButton = ({ onClick, disabled, icon, text, variant }) => {
  const buttonRef = useRef(null);

  const handleMouseEnter = () => {
    if (window.gsap && !disabled) {
      window.gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (window.gsap && !disabled) {
      window.gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const styles = variant === 'primary' 
    ? {
        background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.secondary} 100%)`,
        color: 'white'
      }
    : {
        backgroundColor: THEME.surface,
        color: THEME.text,
        border: `2px solid ${THEME.border}`
      };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all disabled:opacity-50 font-medium shadow-md"
      style={styles}
    >
      {icon}
      {text}
    </button>
  );
};

// Skeleton Loader for Resume Preview
const ResumePreviewSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-24 rounded" style={{ backgroundColor: THEME.border }}></div>
    <div className="space-y-3">
      <div className="h-4 rounded w-3/4" style={{ backgroundColor: THEME.border }}></div>
      <div className="h-4 rounded w-1/2" style={{ backgroundColor: THEME.border }}></div>
      <div className="h-4 rounded w-5/6" style={{ backgroundColor: THEME.border }}></div>
    </div>
    <div className="h-32 rounded" style={{ backgroundColor: THEME.border }}></div>
    <div className="space-y-3">
      <div className="h-4 rounded w-2/3" style={{ backgroundColor: THEME.border }}></div>
      <div className="h-4 rounded w-4/5" style={{ backgroundColor: THEME.border }}></div>
    </div>
  </div>
);

// Skeleton Loader for Analysis
const AnalysisSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 rounded-2xl" style={{ backgroundColor: THEME.border }}></div>
      <div className="flex-1 space-y-2">
        <div className="h-6 rounded w-1/3" style={{ backgroundColor: THEME.border }}></div>
        <div className="h-4 rounded w-2/3" style={{ backgroundColor: THEME.border }}></div>
      </div>
    </div>

    <div className="rounded-xl p-5 space-y-3" style={{ backgroundColor: THEME.bg }}>
      <div className="h-5 rounded w-1/4" style={{ backgroundColor: THEME.border }}></div>
      <div className="h-4 rounded w-full" style={{ backgroundColor: THEME.border }}></div>
      <div className="h-4 rounded w-5/6" style={{ backgroundColor: THEME.border }}></div>
    </div>

    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl p-5 space-y-3" style={{ backgroundColor: THEME.bg }}>
          <div className="flex justify-between">
            <div className="h-5 rounded w-1/3" style={{ backgroundColor: THEME.border }}></div>
            <div className="h-8 w-20 rounded-full" style={{ backgroundColor: THEME.border }}></div>
          </div>
          <div className="h-4 rounded w-full" style={{ backgroundColor: THEME.border }}></div>
        </div>
      ))}
    </div>
  </div>
);

// Analysis Content Component
const AnalysisContent = ({ data }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (window.gsap && contentRef.current) {
      const elements = contentRef.current.querySelectorAll('.animate-item');
      window.gsap.from(elements, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out"
      });
    }
  }, [data]);

  const getScoreColor = (score) => {
    if (score >= 90) return { bg: '#d4edda', text: '#155724', border: '#28a745' };
    if (score >= 75) return { bg: '#d1ecf1', text: '#0c5460', border: '#17a2b8' };
    if (score >= 60) return { bg: '#fff3cd', text: '#856404', border: '#ffc107' };
    return { bg: '#f8d7da', text: '#721c24', border: '#dc3545' };
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Strong';
    if (score >= 60) return 'Good';
    return 'Needs Work';
  };

  const overallColor = getScoreColor(data.overallScore);

  return (
    <div ref={contentRef} className="space-y-6">
      {/* Overall Score */}
      <div className="animate-item rounded-2xl p-6 border-2 shadow-lg" style={{
        backgroundColor: overallColor.bg,
        borderColor: overallColor.border
      }}>
        <div className="flex items-center gap-4">
          <ScoreCircle score={data.overallScore} color={overallColor} />
          <div>
            <h3 className="text-2xl font-bold mb-1" style={{ color: overallColor.text }}>
              {getScoreLabel(data.overallScore)}
            </h3>
            <p className="text-sm" style={{ color: THEME.text }}>{data.summary}</p>
          </div>
        </div>
      </div>

      {/* Critical Issues */}
      {data.criticalIssues && data.criticalIssues.length > 0 && (
        <IssueCard
          title="Critical Issues"
          icon="⚠️"
          items={data.criticalIssues}
          type="critical"
        />
      )}

      {/* Quick Wins */}
      {data.quickWins && data.quickWins.length > 0 && (
        <IssueCard
          title="Quick Wins"
          icon="✨"
          items={data.quickWins}
          type="wins"
        />
      )}

      {/* Section Scores */}
      <div className="space-y-4 animate-item">
        <h3 className="font-semibold text-lg flex items-center gap-2" style={{ color: THEME.text }}>
          <Award className="size-5" style={{ color: THEME.primary }} />
          Detailed Breakdown
        </h3>
        {data.sections?.map((section, i) => (
          <SectionCard key={i} section={section} index={i} />
        ))}
      </div>
    </div>
  );
};

// Score Circle Component
const ScoreCircle = ({ score, color }) => {
  const circleRef = useRef(null);

  useEffect(() => {
    if (window.gsap && circleRef.current) {
      window.gsap.from(circleRef.current, {
        scale: 0,
        rotation: -180,
        duration: 0.8,
        ease: "back.out(1.7)"
      });
    }
  }, []);

  return (
    <div
      ref={circleRef}
      className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-lg border-2"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        borderColor: color.border
      }}
    >
      <span className="text-3xl font-bold" style={{ color: color.text }}>{score}</span>
      <span className="text-xs font-medium" style={{ color: THEME.text }}>/ 100</span>
    </div>
  );
};

// Issue Card Component
const IssueCard = ({ title, icon, items, type }) => {
  const cardRef = useRef(null);

  const handleMouseEnter = () => {
    if (window.gsap) {
      window.gsap.to(cardRef.current, {
        y: -5,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (window.gsap) {
      window.gsap.to(cardRef.current, {
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const styles = type === 'critical'
    ? {
        bg: '#f8d7da',
        border: '#dc3545',
        text: '#721c24'
      }
    : {
        bg: '#d4edda',
        border: '#28a745',
        text: '#155724'
      };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="animate-item rounded-2xl p-5 shadow-md border-l-4"
      style={{
        backgroundColor: styles.bg,
        borderColor: styles.border
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold mb-3 text-lg" style={{ color: styles.text }}>{title}</h3>
          <div className="space-y-2">
            {items.map((item, i) => (
              <p key={i} className="text-sm leading-relaxed" style={{ color: styles.text }}>
                • {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Section Card Component
const SectionCard = ({ section, index }) => {
  const cardRef = useRef(null);

  const handleMouseEnter = () => {
    if (window.gsap) {
      window.gsap.to(cardRef.current, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (window.gsap) {
      window.gsap.to(cardRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return { bg: '#d4edda', text: '#155724', border: '#28a745' };
    if (score >= 75) return { bg: '#d1ecf1', text: '#0c5460', border: '#17a2b8' };
    if (score >= 60) return { bg: '#fff3cd', text: '#856404', border: '#ffc107' };
    return { bg: '#f8d7da', text: '#721c24', border: '#dc3545' };
  };

  const sectionColor = getScoreColor(section.score);

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="rounded-2xl p-5 shadow-md border-2 transition-all"
      style={{
        backgroundColor: 'white',
        borderColor: THEME.border
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-lg" style={{ color: THEME.text }}>{section.name}</h4>
        <div
          className="px-4 py-2 rounded-full font-bold text-lg border-2"
          style={{
            backgroundColor: sectionColor.bg,
            color: sectionColor.text,
            borderColor: sectionColor.border
          }}
        >
          {section.score}/100
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-3">
          <Zap className="size-5 mt-0.5" style={{ color: '#28a745' }} />
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase mb-1" style={{ color: '#28a745' }}>Strength</p>
            <p className="text-sm" style={{ color: THEME.text }}>{section.topStrength}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <TrendingUp className="size-5 mt-0.5" style={{ color: THEME.primary }} />
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase mb-1" style={{ color: THEME.primary }}>Improve</p>
            <p className="text-sm" style={{ color: THEME.text }}>{section.topImprovement}</p>
          </div>
        </div>

        {section.keywords && section.keywords.length > 0 && (
          <div className="pt-2">
            <p className="text-xs font-semibold uppercase mb-2" style={{ color: THEME.text }}>Key Terms</p>
            <div className="flex flex-wrap gap-2">
              {section.keywords.map((keyword, ki) => (
                <span
                  key={ki}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: THEME.bg,
                    color: THEME.text
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyze;