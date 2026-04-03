import React, { useState, useEffect, useRef } from 'react';
import type { FontSize } from '../types';
import { ArrowLeftIcon, ArrowRightIcon, HomeIcon, PlusIcon, MinusIcon, DocumentDuplicateIcon, QueueListIcon } from './icons';
import { useSettingsContext } from '../contexts/SettingsContext';

interface ToolboxProps {
    isAudioPlayerVisible: boolean;
}

const FONT_SIZES: FontSize[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

const Toolbox: React.FC<ToolboxProps> = ({
    isAudioPlayerVisible,
}) => {
    const [isShown, setIsShown] = useState(true);
    const lastScrollY = useRef(0);
    const { fontSize, setFontSize, browsingMode, setBrowsingMode } = useSettingsContext();

    // Effect to handle toolbox visibility on scroll
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollThreshold = 20;

            // Do nothing if scroll change is insignificant
            if (Math.abs(currentScrollY - lastScrollY.current) < scrollThreshold) {
                return;
            }
            
            if (currentScrollY < 100) { // Always show near the top
                setIsShown(true);
            } else if (currentScrollY > lastScrollY.current) { // Scrolling down
                setIsShown(false);
            } else { // Scrolling up
                setIsShown(true);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleIncreaseFont = () => {
        const currentIndex = FONT_SIZES.indexOf(fontSize);
        if (currentIndex < FONT_SIZES.length - 1) {
            setFontSize(FONT_SIZES[currentIndex + 1]);
        }
    };

    const handleDecreaseFont = () => {
        const currentIndex = FONT_SIZES.indexOf(fontSize);
        if (currentIndex > 0) {
            setFontSize(FONT_SIZES[currentIndex - 1]);
        }
    };
    
    const ToolButton: React.FC<{ onClick: () => void; label: string; children: React.ReactNode; isActive?: boolean; disabled?: boolean }> = ({ onClick, label, children, isActive, disabled }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            title={label}
            className={`p-3 rounded-full transition-colors ${isActive ? 'bg-surface-active text-primary-text-strong' : 'text-text-muted hover:bg-surface-hover'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    );

    return (
        <div className={`fixed left-1/2 -translate-x-1/2 z-20 transition-all duration-300 ${isAudioPlayerVisible ? 'bottom-28' : 'bottom-8'}`}>
            <div className={`relative flex items-center gap-1 bg-surface/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-border-default transition-all duration-300 ${
                isShown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
            }`}>
                
                {/* Navigation Group */}
                <ToolButton onClick={() => window.history.back()} label="الخلف"><ArrowRightIcon className="w-5 h-5" /></ToolButton>
                <ToolButton onClick={() => window.location.hash = '#/'} label="الرئيسية"><HomeIcon className="w-5 h-5" /></ToolButton>
                <ToolButton onClick={() => window.history.forward()} label="الأمام"><ArrowLeftIcon className="w-5 h-5" /></ToolButton>
                
                <div className="h-6 w-px bg-border-default mx-2"></div>

                {/* Font Size Group (Direct Control) */}
                <ToolButton 
                    onClick={handleDecreaseFont} 
                    label="تصغير الخط" 
                    disabled={fontSize === FONT_SIZES[0]}
                >
                    <MinusIcon className="w-5 h-5" />
                </ToolButton>
                
                <ToolButton 
                    onClick={handleIncreaseFont} 
                    label="تكبير الخط"
                    disabled={fontSize === FONT_SIZES[FONT_SIZES.length - 1]}
                >
                    <PlusIcon className="w-5 h-5" />
                </ToolButton>
                
                <div className="h-6 w-px bg-border-default mx-2"></div>

                {/* Browsing Mode Group */}
                <ToolButton
                    onClick={() => setBrowsingMode(browsingMode === 'full' ? 'page' : 'full')}
                    label={browsingMode === 'full' ? 'التحويل إلى عرض الصفحات' : 'التحويل إلى العرض الكامل'}
                >
                    {browsingMode === 'full' ? <DocumentDuplicateIcon className="w-5 h-5" /> : <QueueListIcon className="w-5 h-5" />}
                </ToolButton>

            </div>
        </div>
    );
};

export default Toolbox;