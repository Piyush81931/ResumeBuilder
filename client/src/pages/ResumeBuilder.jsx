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

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);
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
    accent_color: "#3B82F6",
    public: false,
  });
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [changedSections, setChangedSections] = useState([]);
  
  const bannerRef = useRef(null);
  const sectionsRef = useRef({});

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

  const downlaodResume = () => {
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
                boxShadow: "0 0 0px rgba(34, 197, 94, 0)",
                scale: 1
              },
              {
                boxShadow: "0 0 20px rgba(34, 197, 94, 0.6)",
                scale: 1.02,
                duration: 0.6,
                delay: index * 0.15,
                ease: "power2.out",
                yoyo: true,
                repeat: 2,
                onComplete: () => {
                  gsap.to(sectionsRef.current[section.id], {
                    boxShadow: "0 0 0px rgba(34, 197, 94, 0)",
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
    <div>
      {/* Success Banner */}
      {showSuccessBanner && (
        <div
          ref={bannerRef}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 shadow-lg"
          style={{ opacity: 0 }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5" />
              <div>
                <p className="font-semibold">Auto-Fix Applied Successfully!</p>
                <p className="text-sm text-green-100">
                  {changedSections.length} section{changedSections.length !== 1 ? 's' : ''} improved
                </p>
              </div>
            </div>
            <button
              onClick={dismissBanner}
              className="text-white hover:bg-white/20 rounded-full p-1.5 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6" style={{ marginTop: showSuccessBanner ? '60px' : '0' }}>
        <Link
          to="/app"
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* left panel-form */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
              {/* progress bar using activeSectionIndex */}
              <hr className="absolute left-0 right-0 top-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 border-none transition-all duration-2000"
                style={{
                  width: `${
                    (activeSectionIndex * 100) / (sections.length - 1)
                  }%`,
                }}
              />

              {/* section navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
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
                  {activeSectionIndex !== 0 && (
                    <button
                      className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                      disabled={activeSectionIndex === 0}
                      onClick={() =>
                        setActiveSectionIndex((prevIndex) =>
                          Math.max(prevIndex - 1, 0)
                        )
                      }
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </button>
                  )}
                  <button
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${
                      activeSectionIndex === sections.length - 1 &&
                      "opacity-50"
                    }`}
                    disabled={activeSectionIndex === sections.length - 1}
                    onClick={() =>
                      setActiveSectionIndex((prevIndex) =>
                        Math.min(prevIndex + 1, sections.length - 1)
                      )
                    }
                  >
                    Next <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* form content with refs for animation */}
              <div className="space-y-6">
                <div ref={el => sectionsRef.current['personal'] = el}>
                  {activeSection.id === "personal" && (
                    <>
                      {isSectionChanged('personal_info') && (
                        <div className="mb-3 px-3 py-2 bg-green-50 border-l-4 border-green-500 rounded">
                          <p className="text-xs font-semibold text-green-700">✓ UPDATED BY AI</p>
                        </div>
                      )}
                      <PersonalInfoForm
                        data={resumeData.personal_info}
                        onChange={(data) => {
                          setResumeData((prev) => ({
                            ...prev,
                            personal_info: data,
                          }));
                        }}
                        removeBackground={removeBackground}
                        setRemoveBackground={setRemoveBackground}
                      />
                    </>
                  )}
                </div>

                <div ref={el => sectionsRef.current['summary'] = el}>
                  {activeSection.id === "summary" && (
                    <>
                      {isSectionChanged('professional_summary') && (
                        <div className="mb-3 px-3 py-2 bg-green-50 border-l-4 border-green-500 rounded">
                          <p className="text-xs font-semibold text-green-700">✓ UPDATED BY AI</p>
                        </div>
                      )}
                      <ProfessionalSummaryForm
                        data={resumeData.professional_summary}
                        setResumeData={setResumeData}
                        onChange={(data) =>
                          setResumeData((prev) => ({
                            ...prev,
                            professional_summary: data,
                          }))
                        }
                      />
                    </>
                  )}
                </div>

                <div ref={el => sectionsRef.current['experience'] = el}>
                  {activeSection.id === "experience" && (
                    <>
                      {isSectionChanged('experience') && (
                        <div className="mb-3 px-3 py-2 bg-green-50 border-l-4 border-green-500 rounded">
                          <p className="text-xs font-semibold text-green-700">✓ UPDATED BY AI</p>
                        </div>
                      )}
                      <ExperienceForm
                        data={resumeData.experience}
                        onChange={(data) =>
                          setResumeData((prev) => ({ ...prev, experience: data }))
                        }
                      />
                    </>
                  )}
                </div>

                <div ref={el => sectionsRef.current['education'] = el}>
                  {activeSection.id === "education" && (
                    <>
                      {isSectionChanged('education') && (
                        <div className="mb-3 px-3 py-2 bg-green-50 border-l-4 border-green-500 rounded">
                          <p className="text-xs font-semibold text-green-700">✓ UPDATED BY AI</p>
                        </div>
                      )}
                      <EducationForm
                        data={resumeData.education}
                        onChange={(data) =>
                          setResumeData((prev) => ({ ...prev, education: data }))
                        }
                      />
                    </>
                  )}
                </div>

                <div ref={el => sectionsRef.current['project'] = el}>
                  {activeSection.id === "project" && (
                    <>
                      {isSectionChanged('project') && (
                        <div className="mb-3 px-3 py-2 bg-green-50 border-l-4 border-green-500 rounded">
                          <p className="text-xs font-semibold text-green-700">✓ UPDATED BY AI</p>
                        </div>
                      )}
                      <ProjectForm
                        data={resumeData.project}
                        onChange={(data) =>
                          setResumeData((prev) => ({ ...prev, project: data }))
                        }
                      />
                    </>
                  )}
                </div>

                <div ref={el => sectionsRef.current['skills'] = el}>
                  {activeSection.id === "skills" && (
                    <>
                      {isSectionChanged('skills') && (
                        <div className="mb-3 px-3 py-2 bg-green-50 border-l-4 border-green-500 rounded">
                          <p className="text-xs font-semibold text-green-700">✓ UPDATED BY AI</p>
                        </div>
                      )}
                      <SkillsForm
                        data={resumeData.skills}
                        onChange={(data) =>
                          setResumeData((prev) => ({ ...prev, skills: data }))
                        }
                      />
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  toast.promise(saveResume(), { loading: "saving..." });
                }}
                className="bg-gradient-to-br from-blue-100 to-blue-200 ring-blue-300 text-blue-600 ring hover:ring-blue-400 transition-all rounded-md px-6 py-2 mt-6 text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* right panel-preview */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
              {/* buttons */}
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                {resumeData.public && (
                  <button
                    onClick={handleShare}
                    className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors"
                  >
                    <Share2Icon className="size-4" />
                    Share
                  </button>
                )}
                <button
                  onClick={changeResumeVisibilty}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-lg ring-purple-300 hover:ring transition-colors"
                >
                  {resumeData.public ? (
                    <EyeIcon className="size-4" />
                  ) : (
                    <EyeOffIcon className="size-4" />
                  )}
                  {resumeData.public ? "Public" : "Private"}
                </button>
                <button
                  onClick={downlaodResume}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors"
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