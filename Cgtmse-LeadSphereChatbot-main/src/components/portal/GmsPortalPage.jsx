import React, { useState, useEffect, useRef } from 'react';
import {
  Eye,
  EyeOff,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Info,
  X,
  Mail,
  AlertCircle
} from 'lucide-react';

export default function GmsPortalPage({ onOpenChat }) {
  // Form states
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // UI interaction states
  const [activeSlide, setActiveSlide] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const canvasRef = useRef(null);

  // Generate random captcha string
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  // Draw captcha on canvas with wavy noise lines
  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !captchaCode) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, width, height);

    // Random noise lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random()*100)}, ${Math.floor(Math.random()*100)}, ${Math.floor(Math.random()*180)}, 0.4)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height
      );
      ctx.stroke();
    }

    // Noise dots
    for (let i = 0; i < 35; i++) {
      ctx.fillStyle = `rgba(100, 116, 139, ${Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Text characters with slight rotation & offset
    ctx.font = 'bold 22px monospace';
    const charSpacing = width / (captchaCode.length + 1);
    for (let i = 0; i < captchaCode.length; i++) {
      ctx.save();
      const x = (i + 0.7) * charSpacing;
      const y = height / 2 + 7;
      const angle = (Math.random() - 0.5) * 0.4;
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = '#1e293b';
      ctx.fillText(captchaCode[i], -7, 0);
      ctx.restore();
    }
  }, [captchaCode]);

  // Slideshow auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      showToast('Please enter your User ID / Email.');
      return;
    }
    if (!password) {
      showToast('Please enter your Password.');
      return;
    }
    if (captchaInput.toUpperCase() !== captchaCode) {
      showToast('Invalid Captcha. Please enter the characters shown in the image.');
      generateCaptcha();
      return;
    }
    if (!agreeTerms) {
      showToast('Please accept the Terms and Conditions of CGTMSE.');
      return;
    }

    showToast('Demo Portal Notice: Authentication is simulated. To get real assistance with CGTMSE schemes, guarantee covers, or portal navigation, click "Ask CGTMSE" on the bottom right!');
    if (onOpenChat) {
      setTimeout(() => onOpenChat(), 1000);
    }
  };

  const handleExistingMLI = () => {
    showToast('Demo Portal: MLI onboarding is simulated. For questions on MLI registration, use the Ask CGTMSE chatbot on the bottom right.');
    if (onOpenChat) {
      setTimeout(() => onOpenChat(), 1000);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f8f9fa] flex flex-col lg:flex-row overflow-x-hidden font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-start gap-3 max-w-md p-4 bg-white border border-blue-200 rounded-xl shadow-2xl animate-fade-in">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-xs text-slate-700 leading-relaxed">
            {toastMessage}
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* LEFT HERO / SLIDER SECTION (GMS Portal Clone)            */}
      {/* ======================================================== */}
      <div className="relative w-full lg:w-[50%] xl:w-[52%] bg-[#182a65] text-white flex flex-col justify-between p-8 sm:p-12 lg:p-16 min-h-[520px] lg:min-h-screen overflow-hidden">
        
        {/* Background SVG illustration layer */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 lg:opacity-60 bg-no-repeat bg-cover bg-center"
          style={{
            backgroundImage: "url('/assets/img/Slider-image-1.svg')",
            mixBlendMode: 'screen'
          }}
        />

        {/* Subtle decorative radiant glow */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Tagline */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wider uppercase bg-white/10 text-blue-200 border border-white/15 backdrop-blur-sm">
              Official Portal
            </span>
            <span className="text-xs text-blue-200/80 hidden sm:inline">
              Ministry of MSME & SIDBI
            </span>
          </div>
          <div className="text-xs text-blue-300 font-medium tracking-wide">
            GMS Portal
          </div>
        </div>

        {/* Middle Content: Title and Feature Bullets */}
        <div className="relative z-10 my-auto py-10 max-w-xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight mb-8">
            Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)
          </h1>

          <div className="space-y-6">
            {/* Feature 1 */}
            <div className="flex items-center gap-4 group transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition backdrop-blur-md shadow-inner">
                <img 
                  src="/assets/img/icon-providing-credit.svg" 
                  alt="Credit Facilities" 
                  className="w-7 h-7 object-contain drop-shadow"
                />
              </div>
              <div>
                <p className="text-sm sm:text-base font-semibold text-white/95 leading-snug">
                  Providing Credit Guarantee For Credit Facilities
                </p>
                <p className="text-xs text-blue-200/70 mt-0.5">
                  Extending vital financial backing across eligible MSE sectors
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-4 group transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition backdrop-blur-md shadow-inner">
                <img 
                  src="/assets/img/Icon-security-fingerprint.svg" 
                  alt="No Collateral" 
                  className="w-7 h-7 object-contain drop-shadow"
                />
              </div>
              <div>
                <p className="text-sm sm:text-base font-semibold text-white/95 leading-snug">
                  No Collateral Security / Third Party Guarantee
                </p>
                <p className="text-xs text-blue-200/70 mt-0.5">
                  Facilitating pure merit-based financing for emerging enterprises
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-4 group transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition backdrop-blur-md shadow-inner">
                <img 
                  src="/assets/img/guaantee_coverage.svg" 
                  alt="Guarantee Coverage" 
                  className="w-7 h-7 object-contain drop-shadow"
                />
              </div>
              <div>
                <p className="text-sm sm:text-base font-semibold text-white/95 leading-snug">
                  Guarantee Coverage Up To ₹5 Crore
                </p>
                <p className="text-xs text-blue-200/70 mt-0.5">
                  Enhanced coverage thresholds tailored for modern businesses
                </p>
              </div>
            </div>
          </div>

          {/* Carousel navigation dots */}
          <div className="flex items-center gap-2 mt-10">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeSlide === idx 
                    ? 'w-7 bg-white shadow' 
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer info in Hero */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-blue-200/70">
          <div>Joint initiative of Ministry of MSME, Govt. of India & SIDBI</div>
          <div className="font-mono text-[11px]">v2.6 GMS Live</div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* RIGHT LOGIN PANEL SECTION                                */}
      {/* ======================================================== */}
      <div className="w-full lg:w-[50%] xl:w-[48%] flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-white">
        <div className="w-full max-w-[430px] my-auto">
          
          {/* Logo & Portal Branding */}
          <div className="mb-8">
            <a 
              href="https://cgtmse.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block"
              title="CGTMSE Official Website"
            >
              <img 
                src="/assets/img/cgtmse-new-logo.png" 
                alt="CGTMSE Logo" 
                className="h-14 sm:h-16 w-auto object-contain transition-transform hover:scale-105"
              />
            </a>
            
            <div className="mt-5">
              <h2 className="text-2xl font-bold text-[#182a65] tracking-tight">
                Login
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Login to your account
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            
            {/* User ID / Email Input */}
            <div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="User ID / Email"
                  autoComplete="username"
                  className="w-full h-11 pl-3.5 pr-10 text-sm bg-white text-slate-800 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#182a65]/20 focus:border-[#182a65] transition placeholder:text-slate-400 font-normal"
                />
                <div className="absolute right-3 pointer-events-none text-slate-400">
                  <img 
                    src="/assets/img/user.svg" 
                    alt="User" 
                    className="w-4 h-4 opacity-60" 
                  />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="w-full h-11 pl-3.5 pr-16 text-sm bg-white text-slate-800 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#182a65]/20 focus:border-[#182a65] transition placeholder:text-slate-400 font-normal"
                />
                <div className="absolute right-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <img 
                    src="/assets/img/password.svg" 
                    alt="Password" 
                    className="w-4 h-4 opacity-60 pointer-events-none" 
                  />
                </div>
              </div>

              {/* Forgot password link */}
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-medium text-[#182a65] hover:text-blue-700 hover:underline transition"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Captcha Section */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-3">
                <div className="border border-slate-300 rounded-md overflow-hidden bg-slate-100 flex-shrink-0 shadow-inner">
                  <canvas 
                    ref={canvasRef} 
                    width={150} 
                    height={40} 
                    className="block cursor-pointer select-none"
                    onClick={generateCaptcha}
                    title="Click to refresh captcha"
                  />
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="p-2 text-slate-500 hover:text-[#182a65] hover:bg-slate-100 rounded-md border border-slate-200 transition"
                  title="Reload Captcha"
                  aria-label="Reload Captcha"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              <div>
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Enter captcha here"
                  maxLength={6}
                  autoComplete="off"
                  className="w-full h-10 px-3.5 text-sm bg-white text-slate-800 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#182a65]/20 focus:border-[#182a65] transition placeholder:text-slate-400 font-mono tracking-wider uppercase"
                />
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#182a65] focus:ring-[#182a65]"
                />
                <span>
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTermsModal(true);
                    }}
                    className="text-blue-600 font-medium underline hover:text-blue-800"
                  >
                    terms and conditions
                  </button>{' '}
                  of CGTMSE
                </span>
              </label>
            </div>

            {/* Support Emails Link */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowEmailModal(true)}
                className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1 font-medium transition"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>E-mail IDs for queries</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 space-y-2.5">
              <button
                type="submit"
                className="w-full h-11 bg-[#182a65] hover:bg-[#111f4d] active:bg-[#0c1638] text-white text-sm font-semibold rounded-md shadow transition flex items-center justify-center tracking-wide"
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={handleExistingMLI}
                className="w-full h-11 bg-white hover:bg-slate-50 text-[#182a65] border border-[#182a65] text-sm font-semibold rounded-md transition flex items-center justify-center tracking-wide"
              >
                Sign up as existing MLI user
              </button>
            </div>
          </form>

          {/* Quick AI Assistant Trigger Prompt Box */}
          <div className="mt-8 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl flex items-start gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center flex-shrink-0 shadow">
              <span className="text-xs">✨</span>
            </div>
            <div className="flex-1 text-xs">
              <p className="font-semibold text-slate-800">
                Need help with GMS or Schemes?
              </p>
              <p className="text-slate-600 mt-0.5">
                Our generative AI assistant is available 24/7 at the bottom-right corner.
              </p>
              {onOpenChat && (
                <button
                  type="button"
                  onClick={onOpenChat}
                  className="mt-1.5 text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1"
                >
                  Open AI Assistant &rarr;
                </button>
              )}
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="mt-8 text-center text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} CGTMSE. All rights reserved. | Government of India
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: Official Email IDs for Queries                    */}
      {/* ======================================================== */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#182a65] flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#182a65]">
                CGTMSE Query & Support Desk
              </h3>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Official email channels for Member Lending Institutions (MLIs) and borrowers:
            </p>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="p-3 bg-slate-50 flex justify-between font-semibold text-slate-700">
                <span>Department / Area</span>
                <span>Email Address</span>
              </div>
              <div className="p-3 flex justify-between items-center hover:bg-slate-50">
                <span className="font-medium text-slate-700">General Scheme Queries</span>
                <span className="font-mono text-blue-600 select-all">cgtmse[at]cgtmse[dot]in</span>
              </div>
              <div className="p-3 flex justify-between items-center hover:bg-slate-50">
                <span className="font-medium text-slate-700">Claim Settlement Desk</span>
                <span className="font-mono text-blue-600 select-all">claim[at]cgtmse[dot]in</span>
              </div>
              <div className="p-3 flex justify-between items-center hover:bg-slate-50">
                <span className="font-medium text-slate-700">Export Credit Guarantee</span>
                <span className="font-mono text-blue-600 select-all">exportcredit[at]cgtmse[dot]in</span>
              </div>
              <div className="p-3 flex justify-between items-center hover:bg-slate-50">
                <span className="font-medium text-slate-700">Audit & Inspection Desk</span>
                <span className="font-mono text-blue-600 select-all">audit[at]cgtmse[dot]in</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 bg-[#182a65] text-white text-xs font-medium rounded-lg hover:bg-[#111f4d]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: Terms and Conditions                              */}
      {/* ======================================================== */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-[#182a65]">
                CGTMSE Terms & Conditions
              </h3>
            </div>

            <div className="text-xs text-slate-600 space-y-3 max-h-80 overflow-y-auto pr-2 leading-relaxed">
              <p>
                <strong>1. Guarantee Coverage:</strong> Credit facilities sanctioned by Member Lending Institutions (MLIs) to eligible Micro and Small Enterprises are governed by the operational guidelines and circulars issued by CGTMSE from time to time.
              </p>
              <p>
                <strong>2. User Authentication:</strong> Authorized users of MLIs must safeguard login credentials and adhere to the security directives, periodic password resets, and session protocols of the Guarantee Management System (GMS).
              </p>
              <p>
                <strong>3. Regulatory Compliance:</strong> Guarantee applications and claim submissions must conform to the norms outlined by the Reserve Bank of India (RBI) and CGTMSE.
              </p>
              <p>
                <strong>4. AI Assistance:</strong> The integrated virtual assistant provides conversational guidance based on official documentation. Inquiries may be logged for quality assurance.
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setAgreeTerms(true);
                  setShowTermsModal(false);
                }}
                className="px-4 py-2 bg-[#182a65] text-white text-xs font-medium rounded-lg hover:bg-[#111f4d]"
              >
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: Forgot Password                                   */}
      {/* ======================================================== */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-[#182a65]">
                Reset GMS Password
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              For Member Lending Institutions (MLIs), password resets are coordinated through your registered Head Office / Nodal Officer or via official CGTMSE support at <span className="font-mono text-blue-600">cgtmse[at]cgtmse[dot]in</span>.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
              <strong>Tip:</strong> You can also ask our AI Assistant in the bottom right corner for step-by-step guidance on unlocking accounts or resetting passwords!
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 bg-[#182a65] text-white text-xs font-medium rounded-lg hover:bg-[#111f4d]"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
