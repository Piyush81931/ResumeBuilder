import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import gsap from "gsap";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2Icon,
  Sparkles,
  User,
  X,
} from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";
import { useSelector } from "react-redux";
import api from "../configues/api";
import toast from "react-hot-toast";

// --- THEME DEFINITION ---
const THEME = {
  bg: '#faedcd',
  text: '#99582a',
  primary: '#bb9457',
  secondary: '#d4a373',
  surface: '#f8f1de',
  border: '#d4a373',
  softGreen: '#22c55e', // Standard green for success
};

// Component Start
const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token, classId } = useSelector((state) => state.auth);
  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: THEME.primary, 
    public: false,
  });
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [changedSections, setChangedSections] = useState([]);

  const bannerRef = useRef(null);
  const sectionsRef = useRef({});

  // Removed button refs (saveButtonRef, downloadButtonRef, etc.)
  // Removed useButtonAnimation hook

  const sections = [
    { id: "personal", name: "Personal Info", icon: User, key: "personal_info" },
    { id: "summary", name: "Summary", icon: FileText, key: "professional_summary" },
    { id: "experience", name: "Experience", icon: Briefcase, key: "experience" },
    { id: "education", name: "Education", icon: GraduationCap, key: "education" },
    { id: "project", name: "Project", icon: FolderIcon, key: "project" },
    { id: "skills", name: "Skills", icon: Sparkles, key: "skills" },
  ];

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get(`api/resumes/get/${resumeId}`, {
        headers: { Authorization: token },
      });
      if (data.resume) {
        setResumeData(data.resume);
        document.title = data.resume.title;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const activeSection = sections[activeSectionIndex];

  const changeResumeVisibilty = async () => {
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append(
        "resumeData",
        JSON.stringify({ public: !resumeData.public })
      );
      const { data } = await api.put(`api/resumes/update`, formData, {
        headers: { Authorization: token },
      });
      setResumeData({ ...resumeData, public: !resumeData.public });
      toast.success(data.message);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const handleShare = () => {
    const frontedUrl = window.location.href.split("/app/")[0];
    const resumeUrl = frontedUrl + "/view/" + resumeId;
    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: "My Resume" });
    } else {
      alert("share not supported on this browser.");
    }
  };

  const downloadResume = () => {
    window.print();
  };

  const saveResume = async () => {
    try {
      let updateResumeData = structuredClone(resumeData);
      if (typeof resumeData.personal_info.image === "object") {
        delete updateResumeData.personal_info.image;
      }

      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(updateResumeData));
      removeBackground && formData.append("removeBackground", "yes");
      typeof resumeData.personal_info.image === "object" &&
        formData.append("image", resumeData.personal_info.image);
      const { data } = await api.put(`api/resumes/update`, formData, {
        headers: { Authorization: token },
      });
      setResumeData(data.resume);
      toast.success(data.message);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const isSectionChanged = (sectionKey) => {
    return changedSections.includes(sectionKey);
  };

  const dismissBanner = () => {
    gsap.to(bannerRef.current, {
      y: -100,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        setShowSuccessBanner(false);
        localStorage.removeItem('changedSections');
        setChangedSections([]);
      }
    });
  };

  // Check for auto-fix changes on mount
  useEffect(() => {
    loadExistingResume();
    
    // Check if returning from auto-fix
    const changed = localStorage.getItem('changedSections');
    if (changed) {
      const parsedChanges = JSON.parse(changed);
      setChangedSections(parsedChanges);
      setShowSuccessBanner(true);

      // Animate banner entrance
      setTimeout(() => {
        if (bannerRef.current) {
          gsap.fromTo(bannerRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
          );
        }
      }, 300);

      // Animate section highlights with stagger
      setTimeout(() => {
        parsedChanges.forEach((sectionKey, index) => {
          const section = sections.find(s => s.key === sectionKey);
          if (section && sectionsRef.current[section.id]) {
            gsap.fromTo(sectionsRef.current[section.id],
              { 
                boxShadow: "0 0 0px rgba(153, 88, 42, 0)", 
                scale: 1
              },
              {
                boxShadow: `0 0 20px ${THEME.text}80`, 
                scale: 1.02,
                duration: 0.6,
                delay: index * 0.15,
                ease: "power2.out",
                yoyo: true,
                repeat: 2,
                onComplete: () => {
                  gsap.to(sectionsRef.current[section.id], {
                    boxShadow: "0 0 0px rgba(153, 88, 42, 0)",
                    scale: 1,
                    duration: 0.8
                  });
                }
              }
            );
          }
        });

        // Find first changed section and scroll to it
        if (parsedChanges.length > 0) {
          const firstChangedSection = sections.find(s => s.key === parsedChanges[0]);
          if (firstChangedSection) {
            const sectionIndex = sections.findIndex(s => s.id === firstChangedSection.id);
            setTimeout(() => {
              setActiveSectionIndex(sectionIndex);
            }, 800);
          }
        }
      }, 600);

      // Auto-dismiss banner after 5 seconds
      setTimeout(() => {
        if (bannerRef.current) {
          dismissBanner();
        }
      }, 5000);
    }
  }, []);

  return (
    <div style={{ backgroundColor: THEME.bg }}>
      {/* Success Banner (Themed Gradient) */}
      {showSuccessBanner && (
        <div
          ref={bannerRef}
          className="fixed top-0 left-0 right-0 z-50 px-4 py-3 shadow-xl"
          style={{ 
            opacity: 0, 
            backgroundColor: THEME.text, // Dark Brown background
            color: THEME.surface
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5" style={{ color: THEME.primary }} />
              <div>
                <p className="font-semibold" style={{ color: THEME.surface }}>AI Auto-Fix Applied Successfully!</p>
                <p className="text-sm" style={{ color: THEME.secondary }}>
                  {changedSections.length} section{changedSections.length !== 1 ? 's' : ''} improved
                </p>
              </div>
            </div>
            <button
              onClick={dismissBanner}
              className="rounded-full p-1.5 transition hover:bg-white/20"
              style={{ color: THEME.surface }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Header and Back Link (Themed) */}
      <div className="max-w-7xl mx-auto px-4 py-6" style={{ marginTop: showSuccessBanner ? '60px' : '0' }}>
        <Link
          to="/app"
          className="inline-flex gap-2 items-center text-sm font-medium transition-all hover:scale-[1.02] hover:underline"
          style={{ color: THEME.text }}
        >
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* left panel-form (Themed Container) */}
          <div className="relative lg:col-span-5 rounded-xl overflow-hidden shadow-2xl" 
               style={{ backgroundColor: THEME.surface }}
          >
            <div className="p-6 pt-1">
              {/* progress bar */}
              <hr 
                className="absolute left-0 right-0 top-0 border-t-2" 
                style={{ borderColor: THEME.border }} 
              />
              <hr
                className="absolute top-0 left-0 h-1 border-none transition-all duration-500"
                style={{
                  backgroundColor: THEME.primary,
                  width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                }}
              />

              {/* section navigation (Themed) */}
              <div className="flex justify-between items-center mb-6 py-3 border-b"
                   style={{ borderColor: THEME.border }}
              >
                <div className="flex items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onchange={(template) =>
                      setResumeData((prev) => ({ ...prev, template }))
                    }
                  />
                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) =>
                      setResumeData((prev) => ({
                        ...prev,
                        accent_color: color,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center">
                  {/* Previous Button (Themed & CSS Animated) */}
                  <button
                    className={`flex items-center gap-1 p-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.05] hover:shadow-md ${
                      activeSectionIndex === 0 ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                    disabled={activeSectionIndex === 0}
                    onClick={() =>
                      setActiveSectionIndex((prevIndex) =>
                        Math.max(prevIndex - 1, 0)
                      )
                    }
                    style={{ color: THEME.text, backgroundColor: `${THEME.primary}20` }}
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </button>
                  {/* Next Button (Themed & CSS Animated) */}
                  <button
                    className={`flex items-center gap-1 p-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.05] hover:shadow-md ${
                      activeSectionIndex === sections.length - 1 ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                    disabled={activeSectionIndex === sections.length - 1}
                    onClick={() =>
                      setActiveSectionIndex((prevIndex) =>
                        Math.min(prevIndex + 1, sections.length - 1)
                      )
                    }
                    style={{ color: THEME.text, backgroundColor: `${THEME.primary}20` }}
                  >
                    Next <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* form content with refs for animation and AI update banners */}
              <div className="space-y-6" style={{ color: THEME.text }}>
                {sections.map(section => (
                    <div key={section.id} ref={el => sectionsRef.current[section.id] = el}>
                        {activeSection.id === section.id && (
                            <>
                                {/* AI Update Banner (Themed) */}
                                {isSectionChanged(section.key) && (
                                    <div className="mb-4 px-4 py-3 border-l-4 rounded shadow-sm"
                                         style={{ 
                                            backgroundColor: `${THEME.softGreen}10`,
                                            borderColor: THEME.softGreen,
                                         }}>
                                        <p className="text-sm font-bold" style={{ color: THEME.text }}>
                                            <Sparkles className="w-4 h-4 inline mr-2" style={{ color: THEME.softGreen }}/> 
                                            UPDATED BY AI
                                        </p>
                                        <p className="text-xs" style={{ color: THEME.text }}>
                                            The AI has refined this section for impact. Please review.
                                        </p>
                                    </div>
                                )}
                                
                                {/* Render the correct form component */}
                                {section.id === "personal" && (
                                    <PersonalInfoForm
                                        data={resumeData.personal_info}
                                        onChange={(data) => setResumeData((prev) => ({ ...prev, personal_info: data }))}
                                        removeBackground={removeBackground}
                                        setRemoveBackground={setRemoveBackground}
                                    />
                                )}
                                {section.id === "summary" && (
                                    <ProfessionalSummaryForm
                                        data={resumeData.professional_summary}
                                        setResumeData={setResumeData}
                                        onChange={(data) => setResumeData((prev) => ({ ...prev, professional_summary: data }))}
                                    />
                                )}
                                {section.id === "experience" && (
                                    <ExperienceForm
                                        data={resumeData.experience}
                                        onChange={(data) => setResumeData((prev) => ({ ...prev, experience: data }))}
                                    />
                                )}
                                {section.id === "education" && (
                                    <EducationForm
                                        data={resumeData.education}
                                        onChange={(data) => setResumeData((prev) => ({ ...prev, education: data }))}
                                    />
                                )}
                                {section.id === "project" && (
                                    <ProjectForm
                                        data={resumeData.project}
                                        onChange={(data) => setResumeData((prev) => ({ ...prev, project: data }))}
                                    />
                                )}
                                {section.id === "skills" && (
                                    <SkillsForm
                                        data={resumeData.skills}
                                        onChange={(data) => setResumeData((prev) => ({ ...prev, skills: data }))}
                                    />
                                )}
                            </>
                        )}
                    </div>
                ))}
              </div>

              {/* Save Button (Themed & CSS Animated) */}
              <button
                // Removed ref
                onClick={() => {
                  toast.promise(saveResume(), { loading: "saving..." });
                }}
                className="flex items-center justify-center font-bold transition-all duration-300 rounded-full px-8 py-3 mt-8 text-sm shadow-lg hover:scale-[1.02] hover:shadow-xl"
                style={{ 
                    backgroundColor: THEME.primary, 
                    color: THEME.surface,
                }}
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* right panel-preview */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
              {/* action buttons (Themed & CSS Animated) */}
              <div className="absolute top-[-40px] right-0 flex items-center justify-end gap-3 z-20">
                
                {/* Share Button (Themed & CSS Animated) */}
                {resumeData.public && (
                  <button
                    // Removed ref
                    onClick={handleShare}
                    className="flex items-center p-2 px-4 gap-2 text-xs font-semibold rounded-full transition-all duration-300 shadow-md hover:scale-[1.05] hover:shadow-lg"
                    style={{ 
                        backgroundColor: THEME.secondary, 
                        color: THEME.text,
                    }}
                  >
                    <Share2Icon className="size-4" />
                    Share
                  </button>
                )}
                
                {/* Visibility Button (Themed & CSS Animated) */}
                <button
                  // Removed ref
                  onClick={changeResumeVisibilty}
                  className="flex items-center p-2 px-4 gap-2 text-xs font-semibold rounded-full transition-all duration-300 shadow-md hover:scale-[1.05] hover:shadow-lg"
                  style={{ 
                    backgroundColor: resumeData.public ? THEME.primary : THEME.text, 
                    color: THEME.surface,
                  }}
                >
                  {resumeData.public ? (
                    <EyeIcon className="size-4" />
                  ) : (
                    <EyeOffIcon className="size-4" />
                  )}
                  {resumeData.public ? "Public" : "Private"}
                </button>
                
                {/* Download Button (Themed & CSS Animated) */}
                <button
                  // Removed ref
                  onClick={downloadResume}
                  className="flex items-center p-2 px-4 gap-2 text-xs font-semibold rounded-full transition-all duration-300 shadow-md hover:scale-[1.05] hover:shadow-lg"
                  style={{ 
                    backgroundColor: THEME.text, 
                    color: THEME.surface,
                  }}
                >
                  <DownloadIcon className="size-4" /> Download
                </button>
              </div>
            </div>

            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;