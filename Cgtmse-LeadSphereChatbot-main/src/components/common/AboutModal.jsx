import React, { useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, BookOpen, Building2 } from 'lucide-react';
import Logo from './Logo';

export default function AboutModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div 
        className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-[#141416] text-zinc-900 dark:text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X size={18} strokeWidth={1.8} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <Logo size={36} />
          <div>
            <h2 id="about-modal-title" className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              About CGTMSE Assist
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Guidance for Micro & Small Enterprises and Lending Banks
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3.5 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <h3 className="flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100 mb-1 text-xs">
              <ShieldCheck size={15} strokeWidth={1.7} className="text-blue-600 dark:text-blue-400" />
              Statutory Trust Mandate
            </h3>
            <p className="text-xs leading-normal text-zinc-600 dark:text-zinc-400">
              <strong>Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)</strong> was jointly set up by the Ministry of MSME, Government of India, and SIDBI to provide collateral-free credit guarantee facilities up to ₹500 lakh for Micro and Small Enterprises.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <h3 className="flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100 mb-2 text-xs">
              <BookOpen size={15} strokeWidth={1.7} className="text-blue-600 dark:text-blue-400" />
              Government Portals
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a 
                  href="https://www.cgtmse.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
                >
                  <Building2 size={13} strokeWidth={1.6} />
                  <span>CGTMSE Portal (cgtmse.in)</span>
                  <ExternalLink size={11} strokeWidth={1.6} />
                </a>
              </li>
              <li>
                <a 
                  href="https://msme.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
                >
                  <Building2 size={13} strokeWidth={1.6} />
                  <span>Ministry of MSME, Govt of India (msme.gov.in)</span>
                  <ExternalLink size={11} strokeWidth={1.6} />
                </a>
              </li>
              <li>
                <a 
                  href="https://udyamregistration.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
                >
                  <Building2 size={13} strokeWidth={1.6} />
                  <span>Udyam Registration Portal</span>
                  <ExternalLink size={11} strokeWidth={1.6} />
                </a>
              </li>
            </ul>
          </div>

          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
            <strong>Advisory Note:</strong> Information is synthesized from indexed circulars and guidelines. Guarantee sanction, AGF rates, and claim settlements remain subject to formal credit appraisal by your Member Lending Institution (MLI).
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-100 px-3.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
