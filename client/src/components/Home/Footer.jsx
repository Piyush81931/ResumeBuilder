import React, { useEffect, useRef } from "react";
import { Sparkles, Mail, Phone, MapPin, Linkedin, Facebook, Instagram, Youtube } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const theme = {
  bg: '#faedcd',
  text: '#99582a',
  primary: '#bb9457',
  secondary: '#d4a373',
  surface: '#f8f1de',
};

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Footer sections fade in
      gsap.from('.footer-section', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      // Social icons hover animation
      gsap.utils.toArray('.social-icon').forEach(icon => {
        icon.addEventListener('mouseenter', () => {
          gsap.to(icon, {
            scale: 1.2,
            rotate: 5,
            duration: 0.3,
            ease: "back.out(1.7)"
          });
        });
        
        icon.addEventListener('mouseleave', () => {
          gsap.to(icon, {
            scale: 1,
            rotate: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });

      // Decorative line animation
      gsap.from('.footer-divider', {
        scaleX: 0,
        duration: 1.2,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: '.footer-divider',
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      });

    }, footerRef);

    return () => ctx.revert();
  }, []);

  const footerLinks = {
    company: [
      { name: "Home", href: "/" },
      { name: "Features", href: "#features" },
      { name: "Testimonials", href: "#testimonials" },
      { name: "Pricing", href: "#pricing" }
    ],
    resources: [
      { name: "Templates", href: "/templates" },
      { name: "Blog", href: "/blog" },
      { name: "Help Center", href: "/help" },
      { name: "Career Tips", href: "/tips" }
    ]
  };

  const socialLinks = [
    { icon: <Linkedin size={20} />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Facebook size={20} />, href: "https://facebook.com", label: "Facebook" },
    { icon: <Instagram size={20} />, href: "https://instagram.com", label: "Instagram" },
    { icon: <Youtube size={20} />, href: "https://youtube.com", label: "YouTube" }
  ];

  return (
    <footer 
      ref={footerRef}
      className="relative pt-20 pb-8 px-6 md:px-16 lg:px-24 xl:px-40 mt-32 overflow-hidden"
      style={{ backgroundColor: theme.text }}
    >
      {/* Decorative Background Elements */}
      <div 
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: theme.primary }}
      />
      <div 
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: theme.secondary }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="footer-section lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.primary }}
              >
                <Sparkles size={20} color="#fff" />
              </div>
              <span 
                className="text-2xl font-bold tracking-tight"
                style={{ color: theme.bg }}
              >
                ResumAI
              </span>
            </div>
            <p 
              className="text-sm leading-relaxed max-w-md mb-6 opacity-80"
              style={{ color: theme.bg }}
            >
              Build professional AI-powered resumes effortlessly. Customize templates, 
              enhance content with AI, analyze your resume, and tailor it to any job. 
              Land your dream job faster.
            </p>
            
            {/* Newsletter */}
            <div className="flex gap-2 max-w-md">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  backgroundColor: theme.surface,
                  color: theme.text,
                  border: `1px solid ${theme.secondary}`
                }}
              />
              <button 
                className="px-6 py-2 rounded-lg font-semibold text-sm hover-trigger transition-all hover:scale-105"
                style={{ backgroundColor: theme.primary, color: '#fff' }}
              >
                Subscribe
              </button>
            </div>
          </div>

          {/* Company Links */}
          <div className="footer-section">
            <h3 
              className="text-lg font-bold mb-4"
              style={{ color: theme.secondary }}
            >
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <a 
                    href={link.href}
                    className="text-sm opacity-80 hover:opacity-100 transition-opacity hover-trigger"
                    style={{ color: theme.bg }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="footer-section">
            <h3 
              className="text-lg font-bold mb-4"
              style={{ color: theme.secondary }}
            >
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, i) => (
                <li key={i}>
                  <a 
                    href={link.href}
                    className="text-sm opacity-80 hover:opacity-100 transition-opacity hover-trigger"
                    style={{ color: theme.bg }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="footer-section grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: theme.primary }}
            >
              <Mail size={18} color="#fff" />
            </div>
            <div>
              <p className="text-xs opacity-60" style={{ color: theme.bg }}>Email</p>
              <p className="text-sm font-medium" style={{ color: theme.bg }}>support@resumai.com</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: theme.primary }}
            >
              <Phone size={18} color="#fff" />
            </div>
            <div>
              <p className="text-xs opacity-60" style={{ color: theme.bg }}>Phone</p>
              <p className="text-sm font-medium" style={{ color: theme.bg }}>+91-12345-67890</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: theme.primary }}
            >
              <MapPin size={18} color="#fff" />
            </div>
            <div>
              <p className="text-xs opacity-60" style={{ color: theme.bg }}>Location</p>
              <p className="text-sm font-medium" style={{ color: theme.bg }}>Gurgaon, India</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div 
          className="footer-divider h-px mb-8 origin-left"
          style={{ backgroundColor: theme.secondary, opacity: 0.3 }}
        />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p 
            className="text-sm opacity-70 text-center md:text-left"
            style={{ color: theme.bg }}
          >
            © 2025 ResumAI. All Rights Reserved. Helping professionals worldwide.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon w-10 h-10 rounded-lg flex items-center justify-center hover-trigger transition-all"
                style={{ 
                  backgroundColor: theme.surface,
                  color: theme.text
                }}
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex items-center justify-center gap-6 mt-8 text-xs opacity-60" style={{ color: theme.bg }}>
          <a href="/privacy" className="hover:opacity-100 transition-opacity hover-trigger">Privacy Policy</a>
          <span>•</span>
          <a href="/terms" className="hover:opacity-100 transition-opacity hover-trigger">Terms of Service</a>
          <span>•</span>
          <a href="/cookies" className="hover:opacity-100 transition-opacity hover-trigger">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;