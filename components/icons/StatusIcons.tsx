import React from 'react';

export const WifiOffIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.5 10.657a8.96 8.96 0 0 0-3.957.941m8.887 2.016a5.21 5.21 0 0 0-2.887-.514m-2.2 2.2a2.25 2.25 0 0 0 3.111 0M2.25 5.568a15.753 15.753 0 0 1 17.568 1.942m-15.01 2.977a11.97 11.97 0 0 1 9.697 1.25" />
    </svg>
);

export const CloudOfflineIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.25-10.5a4.25 4.25 0 1 1 8.5 0 4.25 4.25 0 0 1-8.5 0Z" />
    </svg>
);
