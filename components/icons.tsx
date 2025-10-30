
import React from 'react';

export const UploadIcon = ({ className }: { className?: string }) => (
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
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const SparklesIcon = ({ className }: { className?: string }) => (
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
    className={className}
  >
    <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

export const DownloadIcon = ({ className }: { className?: string }) => (
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
        className={className}
    >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

export const RedoIcon = ({ className }: { className?: string }) => (
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
        className={className}
    >
        <path d="M21 7v6h-6" />
        <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l-3 2.7" />
    </svg>
);

export const ChevronLeftIcon = ({ className }: { className?: string }) => (
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
        className={className}
    >
        <path d="m15 18-6-6 6-6" />
    </svg>
);

export const PersonIcon = ({ className }: { className?: string }) => (
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
        className={className}
    >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export const PeopleIcon = ({ className }: { className?: string }) => (
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
        className={className}
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

// Angle Icons
const AngleIconBase: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="3" width="26" height="26" rx="2" />
        {children}
    </svg>
);

export const ExtremeLongShotIcon = ({ className }: { className?: string }) => (
    <AngleIconBase className={className}><circle cx="16" cy="18" r="1.5" /><path d="M16 20v4" /></AngleIconBase>
);
export const LongShotIcon = ({ className }: { className?: string }) => (
    <AngleIconBase className={className}><circle cx="16" cy="14" r="2" /><path d="M16 16v8" /></AngleIconBase>
);
export const MediumLongShotIcon = ({ className }: { className?: string }) => (
    <AngleIconBase className={className}><circle cx="16" cy="12" r="2.5" /><path d="M16 14.5v10" /></AngleIconBase>
);
export const MediumShotIcon = ({ className }: { className?: string }) => (
    <AngleIconBase className={className}><circle cx="16" cy="13" r="3" /><path d="M12 26h8v-10h-8z" /></AngleIconBase>
);
export const MediumCloseUpIcon = ({ className }: { className?: string }) => (
    <AngleIconBase className={className}><circle cx="16" cy="15" r="4" /><path d="M9 26h14v-7H9z" /></AngleIconBase>
);
export const CloseUpIcon = ({ className }: { className?: string }) => (
    <AngleIconBase className={className}><circle cx="16" cy="16" r="6" /></AngleIconBase>
);
export const ExtremeCloseUpIcon = ({ className }: { className?: string }) => (
    <AngleIconBase className={className}><circle cx="16" cy="16" r="9" /></AngleIconBase>
);
export const HighAngleShotIcon = ({ className }: { className?: string }) => (
    <AngleIconBase className={className}><circle cx="16" cy="14" r="3" /><path d="m13 26 3-8 3 8" /><path d="M10 4h12" /></AngleIconBase>
);
export const LowAngleShotIcon = ({ className }: { className?: string }) => (
    <AngleIconBase className={className}><circle cx="16" cy="12" r="3" /><path d="m13 22 3 6 3-6" /><path d="M10 28h12" /></AngleIconBase>
);
export const BirdsEyeViewIcon = ({ className }: { className?: string }) => (
    <AngleIconBase className={className}><circle cx="16" cy="16" r="3" /><path d="M16 10v-3m0 18v-3m-6-6H7m18 0h-3" /></AngleIconBase>
);
export const WormsEyeViewIcon = ({ className }: { className?: string }) => (
    <AngleIconBase className={className}><path d="M12 20s2-4 4-4 4 4 4 4" /><path d="M12 28h8" /></AngleIconBase>
);
