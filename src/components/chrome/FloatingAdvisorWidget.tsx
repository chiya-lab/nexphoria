'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizClient from '@/app/quiz/QuizClient';

export default function FloatingAdvisorWidget() {
  const [isOpen, setIsOpen] = useState(false);

  // Open with custom event (could also be triggered by Alt+K or similar)
  useEffect(() => {
    const handleOpenAdvisor = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-advisor', handleOpenAdvisor);
    return () => window.removeEventListener('open-advisor', handleOpenAdvisor);
  }, []);

  // Focus trap? Not needed for now.

  // Body scroll lock when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button — Bio doc icon (abstract) */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open Protocol Advisor"
        className="fixed bottom-8 right-3 sm:right-8 z-50 flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#B8A44C]/50 bg-[#B8A44C]/5 hover:bg-[#B8A44C]/10 transition-all duration-200"
        style={{ color: '#B8A44C' }}
      >
        {/* Abstract bio-doc/molecule icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M12 8v4m0 4v4" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 12h4m4 0h4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </button>

      {/* Modal / Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[50] flex items-end justify-center pt-4 pb-4 pr-4 pl-4 sm:pt-6 sm:pb-6 sm:pr-6 sm:pl-6"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
          >
            {/* Panel content */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Protocol Advisor"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E5E5E5',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#E5E5E5' }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M12 8v4m0 4v4" stroke="currentColor" strokeWidth="2"/>
                      <path d="M8 12h4m4 0h4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[#1A1A1A]">Protocol Advisor</span>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1 rounded hover:bg-[#F5F5F5]"
                  aria-label="Close"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Quiz Client */}
              <div className="p-4">
                <QuizClient />
              </div>

              {/* Footer hint */}
              <div className="mt-4 px-4 py-2 text-xs text-center border-t" style={{ borderColor: '#F0F0F0', color: '#999999' }}>
                Press ESC to close • Alt+K to open
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}