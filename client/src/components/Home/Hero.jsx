import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Hero = () => {
  const{user} = useSelector(state=>state.auth)
  const [menuOpen, setMenuOpen] = useState(false);

  // Refs for navbar animation
  const logoRef = useRef(null);
  const navItemsRef = useRef([]);
  const navButtonsRef = useRef([]);

  // Refs for hero section animation
  const avatarsRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaButtonsRef = useRef([]);
  const trustTextRef = useRef(null);
  const logosRef = useRef([]);

  useEffect(() => {
    // Navbar animations
    // Logo animation - appears first
    if (logoRef.current) {
      logoRef.current.animate(
        [
          { opacity: 0, transform: "translateY(-20px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 600,
          delay: 100,
          easing: "ease-out",
          fill: "forwards",
        }
      );
    }

    // Nav items animation - one by one
    navItemsRef.current.forEach((item, index) => {
      if (item) {
        item.animate(
          [
            { opacity: 0, transform: "translateY(-20px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 500,
            delay: 300 + index * 100,
            easing: "ease-out",
            fill: "forwards",
          }
        );
      }
    });

    // Nav buttons animation
    navButtonsRef.current.forEach((button, index) => {
      if (button) {
        button.animate(
          [
            { opacity: 0, transform: "translateY(-20px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 500,
            delay: 700 + index * 100,
            easing: "ease-out",
            fill: "forwards",
          }
        );
      }
    });

    // Hero section animations - start after navbar completes (around 900ms)
    const heroStartDelay = 1000;

    // Avatars + Stars
    if (avatarsRef.current) {
      avatarsRef.current.animate(
        [
          { opacity: 0, transform: "translateY(30px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 700,
          delay: heroStartDelay,
          easing: "ease-out",
          fill: "forwards",
        }
      );
    }

    // Main heading
    if (headingRef.current) {
      headingRef.current.animate(
        [
          { opacity: 0, transform: "translateY(30px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 700,
          delay: heroStartDelay + 200,
          easing: "ease-out",
          fill: "forwards",
        }
      );
    }

    // Subtitle text
    if (subtitleRef.current) {
      subtitleRef.current.animate(
        [
          { opacity: 0, transform: "translateY(30px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 700,
          delay: heroStartDelay + 400,
          easing: "ease-out",
          fill: "forwards",
        }
      );
    }

    // CTA Buttons
    ctaButtonsRef.current.forEach((button, index) => {
      if (button) {
        button.animate(
          [
            { opacity: 0, transform: "translateY(30px) scale(0.9)" },
            { opacity: 1, transform: "translateY(0) scale(1)" },
          ],
          {
            duration: 600,
            delay: heroStartDelay + 600 + index * 100,
            easing: "ease-out",
            fill: "forwards",
          }
        );
      }
    });

    // Trust text
    if (trustTextRef.current) {
      trustTextRef.current.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 600,
        delay: heroStartDelay + 900,
        easing: "ease-out",
        fill: "forwards",
      });
    }

    // Company logos - staggered
    logosRef.current.forEach((logo, index) => {
      if (logo) {
        logo.animate(
          [
            { opacity: 0, transform: "translateY(20px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 500,
            delay: heroStartDelay + 1100 + index * 80,
            easing: "ease-out",
            fill: "forwards",
          }
        );
      }
    });
  }, []);

  const logos = [
    "https://saasly.prebuiltui.com/assets/companies-logo/instagram.svg",
    "https://saasly.prebuiltui.com/assets/companies-logo/framer.svg",
    "https://saasly.prebuiltui.com/assets/companies-logo/microsoft.svg",
    "https://saasly.prebuiltui.com/assets/companies-logo/huawei.svg",
    "https://saasly.prebuiltui.com/assets/companies-logo/walmart.svg",
  ];

  return (
    <>
      <div className="min-h-screen pb-20">
        {/* Navbar */}
        <nav className="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm">
          <a href="/" ref={logoRef} style={{ opacity: 0 }}>
            <img src="/logo.svg" alt="logo" />
          </a>

          <div className="hidden md:flex items-center gap-8 transition duration-500 text-slate-800">
            <a
              href="#"
              className="hover:text-[#2563eb] transition"
              ref={(el) => (navItemsRef.current[0] = el)}
              style={{ opacity: 0 }}
            >
              Home
            </a>
            <a
              href="#features"
              className="hover:text-[#2563eb] transition"
              ref={(el) => (navItemsRef.current[1] = el)}
              style={{ opacity: 0 }}
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="hover:text-[#2563eb] transition"
              ref={(el) => (navItemsRef.current[2] = el)}
              style={{ opacity: 0 }}
            >
              Testimonials
            </a>
            <a
              href="#contact"
              className="hover:text-[#2563eb] transition"
              ref={(el) => (navItemsRef.current[3] = el)}
              style={{ opacity: 0 }}
            >
              Contact
            </a>
          </div>

          <div className="flex gap-2">
            <Link
              to="/app?state=register"
              className="hidden md:block px-6 py-2 bg-[#1e40af] hover:bg-[#2563eb] active:scale-95 transition-all rounded-full text-white"
              ref={(el) => (navButtonsRef.current[0] = el)}
              style={{ opacity: 0 }}
              hidden={user}
            >
              Get started
            </Link>
            <Link
              to="/app?state=login"
              className="hidden md:block px-6 py-2 border active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900"
              ref={(el) => (navButtonsRef.current[1] = el)}
              style={{ opacity: 0 }}
              hidden={user}
            >
              Login
            </Link>
            <Link to='/app' className="hidden md:block px-8 py-2 bg-blue-500 
            hover:bg-blue-700 active:scale-95 transition-all rounded-full text-white"
            hidden={!user}>
              Dashboard
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden active:scale-90 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="lucide lucide-menu"
            >
              <path d="M4 5h16M4 12h16M4 19h16" />
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 z-[100] bg-black/40 text-black backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <a href="#" className="text-white">
            Home
          </a>
          <a href="#features" className="text-white">
            Features
          </a>
          <a href="#testimonials" className="text-white">
            Testimonials
          </a>
          <a href="#contact" className="text-white">
            Contact
          </a>
          <button
            onClick={() => setMenuOpen(false)}
            className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-[#1e40af] hover:bg-[#2563eb] transition text-white rounded-md flex"
          >
            X
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative flex flex-col items-center justify-center text-sm px-4 md:px-16 lg:px-24 xl:px-40 text-black">
          <div className="absolute top-28 xl:top-10 -z-10 left-1/4 size-72 sm:size-96 xl:size-120 2xl:size-132 bg-[#3b82f6] blur-[100px] opacity-30"></div>

          {/* Avatars + Stars */}
          <div
            className="flex items-center mt-24"
            ref={avatarsRef}
            style={{ opacity: 0 }}
          >
            <div className="flex -space-x-3 pr-3">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200"
                alt="user3"
                className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[1]"
              />
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
                alt="user1"
                className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-2"
              />
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
                alt="user2"
                className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[3]"
              />
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200"
                alt="user3"
                className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[4]"
              />
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="user5"
                className="size-8 rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[5]"
              />
            </div>

            <div>
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-star text-transparent fill-[#2563eb]"
                      aria-hidden="true"
                    >
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                    </svg>
                  ))}
              </div>
              <p className="text-sm text-gray-700">Used by 10,000+ users</p>
            </div>
          </div>

          {/* Headline + CTA */}
          <h1
            className="text-5xl md:text-6xl font-semibold max-w-5xl text-center mt-4 md:leading-[70px]"
            ref={headingRef}
            style={{ opacity: 0 }}
          >
            Land your dream job with an{" "}
            <span className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent text-nowrap">
              AI-powered
            </span>{" "}
            resume.
          </h1>

          <p
            className="max-w-md text-center text-base my-7"
            ref={subtitleRef}
            style={{ opacity: 0 }}
          >
            Credit, edit and download professional resumes with AI-powered
            assistance
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <a
              href="/app"
              className="bg-[#1e40af] hover:bg-[#2563eb] text-white rounded-full px-9 h-12 m-1 ring-offset-2 ring-1 ring-[#3b82f6] flex items-center transition-colors"
              ref={(el) => (ctaButtonsRef.current[0] = el)}
              style={{ opacity: 0 }}
            >
              Get started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-right ml-1 size-4"
                aria-hidden="true"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </a>
            <button
              className="flex items-center gap-2 border border-slate-400 hover:bg-[#e0f2fe] transition rounded-full px-7 h-12 text-slate-700"
              ref={(el) => (ctaButtonsRef.current[1] = el)}
              style={{ opacity: 0 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-video size-5"
                aria-hidden="true"
              >
                <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
                <rect x="2" y="6" width="14" height="12" rx="2"></rect>
              </svg>
              <span>Try demo</span>
            </button>
          </div>

          <p
            className="py-6 text-slate-600 mt-14"
            ref={trustTextRef}
            style={{ opacity: 0 }}
          >
            Trusting by leading brands, including
          </p>

          <div
            className="flex flex-wrap justify-between max-sm:justify-center gap-6 max-w-3xl w-full mx-auto py-4"
            id="logo-container"
          >
            {logos.map((logo, index) => (
              <img
                key={index}
                src={logo}
                alt="logo"
                className="h-6 w-auto max-w-xs"
              />
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

          * {
              font-family: 'Poppins', sans-serif;
          }
        `}
      </style>
    </>
  );
};

export default Hero;
