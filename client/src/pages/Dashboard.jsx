import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import React, { useEffect, useState, useRef, useMemo } from "react"; // ADDED useMemo
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../configues/api";
import pdfToText from "react-pdftotext";

// --- GSAP IMPORTS ---
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WavyPathSeparator from "../components/WavyPathSeparator";
gsap.registerPlugin(ScrollTrigger);

// --- THEME DEFINITION ---
const THEME = {
  bg: '#faedcd',
  text: '#99582a',
  primary: '#bb9457',
  secondary: '#d4a373',
  surface: '#f8f1de',
  border: '#d4a373',
};

const Dashboard = () => {
  // ----------------------------------------------------------------
  // 🚫 BACKEND/LOGIC CODE (LEFT UNCHANGED) 🚫
  // ----------------------------------------------------------------
  const { user, token } = useSelector((state) => state.auth);
  const colors = [
    "#6b3e2e", 
    "#4a6d4d", 
    "#99754f", 
    "#856a5c", 
    "#b4927f", 
  ];
  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loadAllResumes = async () => {
    // ... (implementation unchanged) ...
    try {
      const { data } = await api.get("/api/users/resumes", {
        headers: { Authorization: token },
      });
      setAllResumes(data.resumes);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  const createResume = async (event) => {
    // ... (implementation unchanged) ...
    try {
      event.preventDefault();
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        { headers: { Authorization: token } }
      );
      setAllResumes([...allResumes, data.resume]);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  const uploadResume = async (event) => {
    // ... (implementation unchanged) ...
    event.preventDefault();
    setIsLoading(true);
    try {
      const resumeText = await pdfToText(resume);
      const { data } = await api.post(
        `/api/ai/upload-resume`,
        { title, resumeText },
        { headers: { Authorization: token } }
      );
      setTitle("");
      setResume(null);
      setShowUploadResume(false);
      await loadAllResumes();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
    setIsLoading(false);
  };
  const editTitle = async (event) => {
    // ... (implementation unchanged) ...
    try {
      event.preventDefault();
      const { data } = await api.put(
        `/api/resumes/update`,
        { resumeId: editResumeId, resumeData: { title } },
        { headers: { Authorization: token } }
      );
      setAllResumes(
        allResumes.map((resume) =>
          resume._id === editResumeId ? { ...resume, title } : resume
        )
      );
      setTitle("");
      setEditResumeId("");
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  const deleteResume = async (resumeId) => {
    // ... (implementation unchanged) ...
    try {
      const confirm = window.confirm(
        "Are you sure you want delete this resume"
      );
      if (confirm) {
        const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, {
          headers: { Authorization: token },
        });
        setAllResumes(allResumes.filter((resume) => resume._id !== resumeId));
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);
  // ----------------------------------------------------------------

  // --- GSAP REFS and EFFECTS (UNCHANGED) ---
  const headlineRef = useRef(null);
  const ctaContainerRef = useRef(null);
  const resumeGridRef = useRef(null);
  const allCardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Page Load Animation (Headline)
      if (headlineRef.current) {
        gsap.set(headlineRef.current.children, { y: 100, opacity: 0 }); 

        gsap.timeline({ delay: 0.2 })
          .to(headlineRef.current.children, {
            y: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 1.2,
            ease: "power4.out",
          });
      }

      // 2. CTA Buttons Fade In
      if (ctaContainerRef.current) {
            gsap.set(ctaContainerRef.current.children, { opacity: 0, y: 20 });
            
            gsap.to(ctaContainerRef.current.children, {
              opacity: 1, 
              y: 0,
              stagger: 0.1,
              duration: 1,
              ease: "power2.out",
              delay: 0.5, 
            });
      }

      // 3. Scroll Animation (Resume Grid)
      if (allCardsRef.current.length > 0) {
        gsap.set(allCardsRef.current, { opacity: 0, y: 60 }); 

        gsap.to(allCardsRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: resumeGridRef.current,
            start: "top 85%", 
            toggleActions: "play none none none",
          },
        });
      }
    });

    return () => ctx.revert();
  }, [allResumes]);

  // ----------------------------------------------------------------
  // --- UI/UX COMPONENTS (UNCHANGED) ---
  // ----------------------------------------------------------------

  // Utility component for consistent Modal styling and animations
  const ThemedModal = ({ children, onClose }) => {
    // ... (ThemedModal implementation unchanged) ...
    const contentRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }
      );
      gsap.from(contentRef.current, {
        scale: 0.95,
        opacity: 0,
        y: 10,
        duration: 0.3,
        ease: "power2.out",
      });
    }, []);

    const handleClose = () => {
      gsap.to(contentRef.current, {
        scale: 0.95,
        opacity: 0,
        y: -10,
        duration: 0.2,
      });
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: onClose,
      });
    };

    return (
      <div
        ref={modalRef}
        onClick={handleClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300"
      >
        <div
          ref={contentRef}
          onClick={(e) => e.stopPropagation()}
          className="relative shadow-2xl rounded-xl w-full max-w-sm p-6 transform transition-all"
          style={{
            backgroundColor: THEME.surface,
            border: `2px solid ${THEME.secondary}`,
            color: THEME.text,
          }}
        >
          {children}
          <XIcon
            className="absolute top-4 right-4 cursor-pointer transition-colors hover:scale-110"
            style={{ color: THEME.text }}
            onClick={handleClose}
          />
        </div>
      </div>
    );
  };

  // 1. CTA Buttons (Create/Upload) matching Hero's CTA style
  const ThemedCtaButton = ({ onClick, icon: Icon, title, isPrimary = true }) => {
    // ... (ThemedCtaButton implementation unchanged) ...
    const buttonRef = useRef(null);
    const colorVariant = isPrimary ? THEME.primary : THEME.secondary;

    const onEnter = () => {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        boxShadow: `0 8px 20px -5px ${colorVariant}90`,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(buttonRef.current, {
        scale: 1,
        boxShadow: "none",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    return (
      <button
        ref={buttonRef}
        onClick={onClick}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="group relative w-full sm:max-w-44 h-52 flex flex-col items-center justify-center rounded-xl gap-3 border transition-all cursor-pointer overflow-hidden shadow-md"
        style={{
          backgroundColor: THEME.surface,
          borderColor: colorVariant + "60",
          color: THEME.text,
        }}
      >
        {/* ... (rest of ThemedCtaButton content unchanged) ... */}
        <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center mb-1 transition-all duration-300 group-hover:scale-110"
            style={{ backgroundColor: colorVariant }}
        >
          <Icon
            className="size-8"
            style={{ color: THEME.surface }}
          />
        </div>
        <p className="text-base font-semibold">
          {title}
        </p>
        <div 
            className="absolute inset-0 translate-y-[101%] transition-transform duration-300 group-hover:translate-y-0 opacity-50"
            style={{ backgroundColor: colorVariant === THEME.primary ? THEME.text : THEME.primary }}
        />
      </button>
    );
  };

  // 2. Resume Card (UNCHANGED)
  const ThemedResumeCard = React.forwardRef(({
    // ... (ThemedResumeCard implementation unchanged) ...
    resume,
    basecolor,
    navigate,
    deleteResume,
    setEditResumeId,
    setTitle,
  }, ref) => {
    const onEnter = () => {
      gsap.to(ref.current, { scale: 1.03, duration: 0.2, boxShadow: `0 5px 15px -3px ${basecolor}80` });
    };

    const onLeave = () => {
      gsap.to(ref.current, { scale: 1, duration: 0.2, boxShadow: "none" });
    };

    return (
      <div
        ref={ref}
        onClick={() => navigate(`/app/builder/${resume._id}`)}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="relative w-full h-52 flex flex-col items-center justify-center rounded-xl gap-3 border transition-all cursor-pointer group shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${basecolor}10, ${basecolor}40)`,
          borderColor: basecolor + "40",
          color: THEME.text,
        }}
      >
        <FilePenLineIcon
          className="size-8 transition-all"
          style={{ color: basecolor }}
        />
        <p
          className="text-base font-semibold px-2 text-center break-words"
          style={{ color: basecolor }}
        >
          {resume.title}
        </p>
        <p
          className="absolute bottom-3 text-xs px-2 text-center"
          style={{ color: basecolor + "90" }}
        >
          Updated on {new Date(resume.updatedAt).toLocaleDateString()}
        </p>
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 flex items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <TrashIcon
            onClick={() => deleteResume(resume._id)}
            className="size-7 p-1.5 rounded transition-colors hover:bg-white/70"
            style={{ color: THEME.text }}
          />
          <PencilIcon
            onClick={() => {
              setEditResumeId(resume._id);
              setTitle(resume.title);
            }}
            className="size-7 p-1.5 rounded transition-colors hover:bg-white/70"
            style={{ color: THEME.text }}
          />
        </div>
      </div>
    );
  });
  ThemedResumeCard.displayName = 'ThemedResumeCard';


  // 3. Reusable Action Button (UNCHANGED)
  const ThemedActionButton = ({ children, disabled = false, ...props }) => {
    const buttonRef = useRef(null);
    // ... (ThemedActionButton implementation unchanged) ...

    const onEnter = () => {
        if (!disabled) {
            gsap.to(buttonRef.current, { scale: 1.01, duration: 0.2 });
        }
    };

    const onLeave = () => {
        if (!disabled) {
            gsap.to(buttonRef.current, { scale: 1, duration: 0.2 });
        }
    };

    return (
      <button
        ref={buttonRef}
        disabled={disabled}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="group relative flex items-center justify-center gap-2 w-full py-3 rounded-full font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-md"
        style={{
          backgroundColor: THEME.primary,
          color: '#fff',
        }}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <div 
            className="absolute inset-0 translate-y-[101%] transition-transform duration-300 group-hover:translate-y-0"
            style={{ backgroundColor: THEME.text }}
        />
      </button>
    );
  };

  // 4. Reusable Input Field (UNCHANGED, but is the target of the fix)
  const ThemedInput = ({ ...props }) => (
    <input
      type="text"
      className="w-full px-4 py-3 rounded-lg transition-all duration-200"
      style={{
        backgroundColor: THEME.surface, 
        color: THEME.text,
        border: `1px solid ${THEME.secondary}`,
        outline: "none",
      }}
      onFocus={(e) => {
        e.target.style.border = `1px solid ${THEME.primary}`;
        e.target.style.boxShadow = `0 0 0 2px ${THEME.primary}50`;
      }}
      onBlur={(e) => {
        e.target.style.border = `1px solid ${THEME.secondary}`;
        e.target.style.boxShadow = "none";
      }}
      required
      {...props}
    />
  );

  // ----------------------------------------------------------------
  // --- MEMOIZED MODAL CONTENT (THE FIX) ---
  // ----------------------------------------------------------------

  // 1. Memoized Create Resume Form
  const CreateResumeModalContent = useMemo(() => (
    <ThemedModal
      onClose={() => {
        setShowCreateResume(false);
        setTitle("");
      }}
    >
      <form onSubmit={createResume} className="flex flex-col gap-4">
        <h2 className="font-bold text-xl mb-2" style={{ color: THEME.text }}>
          Create a Resume
        </h2>
        <ThemedInput
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          placeholder="Enter resume title"
          autoFocus // Added for immediate focus on modal open
        />
        <ThemedActionButton>Start Building</ThemedActionButton>
      </form>
    </ThemedModal>
  ), [title, createResume]); // title must be a dependency as it's passed as a prop

  // 2. Memoized Upload Resume Form
  const UploadResumeModalContent = useMemo(() => (
    <ThemedModal
      onClose={() => {
        setShowUploadResume(false);
        setTitle("");
        setResume(null);
      }}
    >
      <form onSubmit={uploadResume} className="flex flex-col gap-4">
        <h2 className="font-bold text-xl mb-2" style={{ color: THEME.text }}>
          Upload Existing Resume
        </h2>
        <ThemedInput
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          placeholder="Enter resume title"
          autoFocus // Added for immediate focus on modal open
        />
        <div>
          {/* ... (File upload label/input unchanged) ... */}
          <label
            htmlFor="resume-input"
            className="block text-sm font-medium mb-2"
            style={{ color: THEME.text }}
          >
            Select resume file
          </label>
          <label
            htmlFor="resume-input"
            className="flex flex-col items-center justify-center gap-2 rounded-md p-4 py-10 my-1 cursor-pointer transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: THEME.surface,
              border: `2px dashed ${THEME.secondary}`,
              color: THEME.secondary,
            }}
          >
            {resume ? (
              <p style={{ color: THEME.text, fontWeight: "bold" }}>
                {resume.name}
              </p>
            ) : (
              <>
                <UploadCloudIcon className="size-14 stroke-1" />
                <p>Upload .pdf resume</p>
              </>
            )}
          </label>
          <input
            type="file"
            id="resume-input"
            accept=".pdf"
            hidden
            onChange={(e) => setResume(e.target.files[0])}
          />
        </div>

        <ThemedActionButton disabled={isLoading}>
          {isLoading && (
            <LoaderCircleIcon className="animate-spin size-4" />
          )}
          {isLoading ? "Uploading..." : "Upload and Analyze"}
        </ThemedActionButton>
      </form>
    </ThemedModal>
  ), [title, resume, uploadResume, isLoading]); // Include all state/props used inside the memo

  // 3. Memoized Edit Title Form
  const EditTitleModalContent = useMemo(() => (
    <ThemedModal
      onClose={() => {
        setEditResumeId("");
        setTitle("");
      }}
    >
      <form onSubmit={editTitle} className="flex flex-col gap-4">
        <h2 className="font-bold text-xl mb-2" style={{ color: THEME.text }}>
          Edit Resume Title
        </h2>
        <ThemedInput
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          placeholder="Enter new title"
          autoFocus // Added for immediate focus on modal open
        />
        <ThemedActionButton>Save New Title</ThemedActionButton>
      </form>
    </ThemedModal>
  ), [title, editTitle]);


  // ----------------------------------------------------------------
  // --- MAIN RENDER (Using Memoized Content) ---
  // ----------------------------------------------------------------

  return (
    <div style={{ backgroundColor: THEME.bg, minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* WELCOME HEADLINE */}
        <div className="overflow-hidden mb-8">
            <h1
                ref={headlineRef}
                className="text-4xl md:text-5xl font-serif font-bold flex flex-wrap"
                style={{ color: THEME.text }}
            >
                <span className="inline-block mr-2 hero-line">Welcome,</span>
                <span className="inline-block mr-2 hero-line" style={{ color: THEME.primary }}>{user?.name || "User"}</span>
                <span className="inline-block hero-line">!</span>
            </h1>
        </div>
        
        <h2 className="text-xl font-medium mb-10" style={{ color: THEME.text, opacity: 0.8 }}>
            Manage your AI-enhanced resumes and start tailoring for your next role.
        </h2>

        {/* CTA BUTTONS */}
        <div ref={ctaContainerRef} className="flex flex-wrap gap-6 mb-12">
          <ThemedCtaButton
            onClick={() => setShowCreateResume(true)}
            icon={PlusIcon}
            title="Create New Resume"
            isPrimary={true}
          />
          <ThemedCtaButton
            onClick={() => setShowUploadResume(true)}
            icon={UploadCloudIcon}
            title="Upload Existing PDF"
            isPrimary={false}
          />
        </div>

        <WavyPathSeparator />

        {/* RESUME GRID */}
        <div ref={resumeGridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {allResumes.length > 0 ? (
            allResumes.map((resume, index) => {
              const basecolor = colors[index % colors.length];

              const cardRefCallback = (el) => {
                  if (el) {
                      allCardsRef.current[index] = el;
                  } else {
                      allCardsRef.current.splice(index, 1);
                  }
              };

              return (
                <ThemedResumeCard
                  key={resume._id}
                  resume={resume}
                  basecolor={basecolor}
                  navigate={navigate}
                  deleteResume={deleteResume}
                  setEditResumeId={setEditResumeId}
                  setTitle={setTitle}
                  ref={cardRefCallback} 
                />
              );
            })
          ) : (
            <p className="text-lg font-medium" style={{ color: THEME.text }}>
                No resumes found. Start by creating or uploading one!
            </p>
          )}
        </div>

        {/* --- MODALS (Render Memoized Content) --- */}

        {/* Create Resume Modal */}
        {showCreateResume && CreateResumeModalContent}

        {/* Upload Resume Modal */}
        {showUploadResume && UploadResumeModalContent}

        {/* Edit Title Modal */}
        {editResumeId && EditTitleModalContent}
      </div>
    </div>
  );
};

export default Dashboard;