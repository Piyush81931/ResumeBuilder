import React, { useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Preview from "./pages/Preview";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumeAnalyze from "./pages/ResumeAnalyze"; 
import { useDispatch } from "react-redux";
import api from "./configues/api";
import { login, setLoading } from "./fetaures/authSlice";
import { Toaster } from 'react-hot-toast';
import JobMatching from "./pages/JobMatching";
import gsap from 'gsap';

// Theme Configuration
const theme = {
  bg: '#faedcd',
  text: '#99582a',
  primary: '#bb9457',
  secondary: '#d4a373',
  surface: '#f8f1de',
};

const App = () => {
  const dispatch = useDispatch();
  const [loaderFinished, setLoaderFinished] = useState(false);
  const loaderRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorFollowerRef = useRef(null);

  const getUserData = async () => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        const { data } = await api.get('/api/users/data', { 
          headers: { Authorization: token } 
        });
        if (data.user) {
          dispatch(login({ token, user: data.user }));
        }
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Loading Animation with GSAP
  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => setLoaderFinished(true)
    });

    tl.to('.loader-text', {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    })
    .to('.loader-text', {
      y: -50,
      opacity: 0,
      duration: 0.5,
      delay: 0.3,
      stagger: 0.1,
      ease: "power2.in"
    })
    .to(loaderRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: "expo.inOut"
    });
  }, []);

  // Custom Cursor Logic
  useEffect(() => {
    if (!loaderFinished) return;

    const cursor = cursorRef.current;
    const follower = cursorFollowerRef.current;
    
    if (!cursor || !follower) return;

    const moveCursor = (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      follower.animate({
        transform: `translate3d(${e.clientX - 12}px, ${e.clientY - 12}px, 0)`
      }, { duration: 800, fill: "forwards" });
    };

    const handleHover = () => {
      follower.classList.add('scale-[2.5]', 'opacity-30');
    };
    
    const handleLeave = () => {
      follower.classList.remove('scale-[2.5]', 'opacity-30');
    };

    window.addEventListener('mousemove', moveCursor);
    
    const attachListeners = () => {
      const hoverables = document.querySelectorAll('a, button, .hover-trigger');
      hoverables.forEach(el => {
        el.addEventListener('mouseenter', handleHover);
        el.addEventListener('mouseleave', handleLeave);
      });
    };

    const timer = setTimeout(attachListeners, 1000);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      clearTimeout(timer);
    };
  }, [loaderFinished]);

  return (
    <div 
      className="relative w-full min-h-screen selection:bg-[#bb9457] selection:text-[#99582a]"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <Toaster />
      
      {/* Custom Cursor */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[60] mix-blend-exclusion hidden md:block" 
        style={{ 
          marginTop: -6, 
          marginLeft: -6, 
          backgroundColor: theme.text 
        }} 
      />
      <div 
        ref={cursorFollowerRef} 
        className="fixed top-0 left-0 w-8 h-8 border rounded-full pointer-events-none z-[60] transition-transform ease-out hidden md:block mix-blend-exclusion" 
        style={{ borderColor: theme.text }} 
      />

      {/* Intro Loader */}
      <div 
        ref={loaderRef} 
        className="fixed inset-0 z-[100] flex items-center justify-center flex-col"
        style={{ backgroundColor: theme.text }}
      >
        <div className="overflow-hidden h-16 md:h-24">
          <h1 
            className="loader-text text-4xl md:text-7xl font-bold opacity-0 translate-y-10" 
            style={{ color: theme.secondary }}
          >
            Dream.
          </h1>
        </div>
        <div className="overflow-hidden h-16 md:h-24">
          <h1 
            className="loader-text text-4xl md:text-7xl font-bold opacity-0 translate-y-10" 
            style={{ color: theme.surface }}
          >
            Design.
          </h1>
        </div>
        <div className="overflow-hidden h-16 md:h-24">
          <h1 
            className="loader-text text-4xl md:text-7xl font-bold opacity-0 translate-y-10" 
            style={{ color: theme.primary }}
          >
            Deliver.
          </h1>
        </div>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
          <Route path="analyze/:resumeId" element={<ResumeAnalyze />} />
          <Route path="job-match/:resumeId" element={<JobMatching />} /> 
        </Route>
        <Route path="view/:resumeId" element={<Preview />} />
      </Routes>

      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Poppins', sans-serif;
        }

        ::-webkit-scrollbar {
          width: 8px;
          background: ${theme.bg};
        }
        ::-webkit-scrollbar-thumb {
          background: ${theme.secondary};
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${theme.primary};
        }
      `}</style>
    </div>
  );
};

export default App;