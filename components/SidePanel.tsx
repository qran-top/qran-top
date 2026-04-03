import React from 'react';
import { HomeIcon, BookmarkIcon, SparklesIcon, CogIcon, BookOpenIcon, ShieldCheckIcon, UserCircleIcon, UsersIcon, MicrophoneIcon, ChartBarIcon, ChatBubbleIcon, InformationCircleIcon } from './icons';

interface SidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    currentPath: string;
    // Navigation props
    onNavigate: (path: string) => void;
}

const NavLink: React.FC<{ href: string; icon: React.ReactNode; label: string; onNavigate: (path: string) => void; isActive: boolean }> = ({ href, icon, label, onNavigate, isActive }) => (
    <a
        href={href}
        onClick={(e) => { e.preventDefault(); onNavigate(href); }}
        className={`flex items-center gap-3 p-2.5 rounded-lg text-base transition-colors ${isActive ? 'bg-surface-active text-primary-text-strong font-bold' : 'text-text-secondary hover:bg-surface-hover'}`}
    >
        {icon}
        <span className="whitespace-nowrap">{label}</span>
    </a>
);

const SidePanel: React.FC<SidePanelProps> = ({
    isOpen, onClose, currentPath, onNavigate
}) => {

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Panel */}
            <aside
                className={`fixed top-0 right-0 h-full bg-surface shadow-2xl z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto w-fit min-w-[220px] max-w-[85vw]`}
                role="dialog"
                aria-modal="true"
                aria-label="القائمة الجانبية"
            >
                <div className="flex flex-col h-full">
                    {/* Content */}
                    <div className="p-4 pt-8">
                        <nav className="space-y-1">
                            <NavLink href="#/" icon={<HomeIcon className="w-5 h-5" />} label="الفهرس" onNavigate={onNavigate} isActive={currentPath === '#/'} />
                            <NavLink href="#/audio-khatmiyah" icon={<MicrophoneIcon className="w-5 h-5" />} label="الختمة الصوتية" onNavigate={onNavigate} isActive={currentPath.startsWith('#/audio-khatmiyah')} />
                            <NavLink href="#/khatmiyah" icon={<UsersIcon className="w-5 h-5" />} label="الختمية الجماعية" onNavigate={onNavigate} isActive={currentPath.startsWith('#/khatmiyah')} />
                            <NavLink href="#/saved" icon={<BookmarkIcon className="w-5 h-5" />} label="دفتر التدبر" onNavigate={onNavigate} isActive={currentPath.startsWith('#/saved')} />
                            <NavLink href="#/analysis" icon={<ChartBarIcon className="w-5 h-5" />} label="تحليل مفردة" onNavigate={onNavigate} isActive={currentPath.startsWith('#/analysis')} />
                            <NavLink href="#/comments" icon={<SparklesIcon className="w-5 h-5" />} label="سحابة الكلمات" onNavigate={onNavigate} isActive={currentPath.startsWith('#/comments')} />
                            <NavLink href="#/settings" icon={<CogIcon className="w-5 h-5" />} label="الإعدادات" onNavigate={onNavigate} isActive={currentPath.startsWith('#/settings')} />
                            
                            <div className="!mt-4 pt-4 border-t border-border-default">
                                <NavLink href="#/about" icon={<InformationCircleIcon className="w-5 h-5" />} label="عن التطبيق والدليل" onNavigate={onNavigate} isActive={currentPath.startsWith('#/about')} />
                                <NavLink href="#/privacy-policy" icon={<ShieldCheckIcon className="w-5 h-5" />} label="سياسة الخصوصية" onNavigate={onNavigate} isActive={currentPath.startsWith('#/privacy-policy')} />
                            </div>
                        </nav>
                    </div>
                    
                    {/* Spacer to push content down */}
                    <div className="flex-grow"></div>
                    
                    {/* Footer */}
                    <div className="p-4 border-t border-border-default flex-shrink-0">
                         <div className="flex items-center justify-between gap-2">
                            <a 
                                href="https://aboharon.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 bg-surface-subtle text-text-secondary rounded-full hover:bg-surface-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                                aria-label="موقع المطور"
                                title="موقع المطور"
                            >
                                <UserCircleIcon className="w-5 h-5" />
                            </a>
                            <span className="text-[10px] font-mono text-text-subtle select-none">
                                V22.0.0
                            </span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default SidePanel;