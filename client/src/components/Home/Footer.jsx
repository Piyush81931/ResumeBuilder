import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full  bg-gradient-to-r from-white via-blue-500/60 to-white 
                         text-white  mt-40">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/20 pb-6">
          {/* Logo and description */}
          <div className="md:max-w-md text-white">
            <img src="/logo.svg" alt="logo" />
            <p className="mt-6 text-sm text-black max-w-md">
              Build professional AI-powered resumes effortlessly with our AI Resume Builder. 
              Customize templates, highlight key skills, and land your dream job faster.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex items-start md:justify-end gap-20 text-white">
            <div>
              <h2 className="font-semibold mb-5 text-[#031f7a]">Company</h2>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="/" className="text-gray-700 hover:text-[#0d0d0e] transition">Home</a>
                </li>
                <li>
                  <a href="/about" className="text-gray-700 hover:text-[#060708] transition">About</a>
                </li>
                <li>
                  <a href="/features" className="text-gray-700 hover:text-[#0d0e0f] transition">Features</a>
                </li>
                <li>
                  <a href="/pricing" className="text-gray-700 hover:text-[#04070e] transition">Pricing</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-semibold mb-5 text-gray-700">Contact</h2>
              <div className="text-sm space-y-2">
                <p className="text-gray-700">support@airesumebuilder.com</p>
                <p className="text-gray-700">+91-12345-67890</p>
                <p className="text-gray-700">Gurgaon, Haryana, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4 text-gray-600">
          <p className="text-center md:text-left text-sm">
            Helping every professional create a standout resume with AI-powered efficiency.
          </p>
          <div className="flex gap-4">
            {/* Social icons */}
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#3b82f6] transition">LinkedIn</a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#3b82f6] transition">Facebook</a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#3b82f6] transition">Instagram</a>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#3b82f6] transition">YouTube</a>
          </div>
        </div>

        <p className="pt-4 text-center text-xs md:text-sm text-gray-600 pb-5">
          © 2025 AI Resume Builder. All Rights Reserved.
        </p>
      </footer>
    </>
  );
};

export default Footer;
