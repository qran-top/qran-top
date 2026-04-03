import React, { useState, useMemo, useCallback } from 'react';
import { MenuIcon, LogoIcon, SearchIcon, ArrowRightIcon, PlayIcon, SpinnerIcon, WifiOffIcon } from './icons';
import { QURAN_INDEX } from '../quranIndex';
import { formatSurahNameForDisplay } from '../utils/text';
import SearchForm from './SearchForm';
import ThemeToggleButton from './ThemeToggleButton';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useSettingsContext } from '../contexts/SettingsContext';
import type { Ayah } from '../types';

interface HeaderProps {
    setIsSidePanelOpen: (open: boolean) => void;
    currentPath: string;
    dataSourceStatus: 'primary' | 'fallback';
    onSearch: (query: string) => void;
    searchDisabled: boolean;
    loadingEditions: string[];
    onStartPlayback: (ayahs: Ayah[], audioEditionIdentifier: string, startIndex?: number) => void;
    isPlaybackLoading: boolean;
}

const Logo: React.FC<{ dataSourceStatus: 'primary' | 'fallback'; isHomePage: boolean }> = ({ dataSourceStatus, isHomePage }) => {
    const [adminClickCount, setAdminClickCount] = useState(0);

    const handleLogoClick = () => {
        const newCount = adminClickCount + 1;
        setAdminClickCount(newCount);
        if (newCount >= 12) {
            window.location.hash = '#/admin';
            setAdminClickCount(0);
            return;
        }
        
        // Always navigate home on logo click
        window.location.hash = '#/';
    };

    const dotColorClass = dataSourceStatus === 'primary' ? 'text-green-500' : 'text-red-500';

    return (
        <div onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer select-none" title="الرجوع للرئيسية">
            <LogoIcon className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold text-text-primary tracking-tighter">
                QRAN<span className={dotColorClass}>.</span>TOP
            </span>
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({
    setIsSidePanelOpen,
    currentPath,
    dataSourceStatus,
    onSearch,
    searchDisabled,
    loadingEditions,
    onStartPlayback,
    isPlaybackLoading,
}) => {
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const isOnline = useNetworkStatus();
    
    // Consume Settings from Context
    const { 
        fontStyle, setFontStyle, selectedEdition, setSelectedEdition, setBrowsingMode, selectedAudioEdition 
    } = useSettingsContext();

    const { pageTitle, isSurahOrPage, isRelevantPageForToggle, isSearchPage, isHomePage } = useMemo(() => {
        const path = currentPath.split('?')[0];
        const isHome = path === '#/';
        const isSearch = path.startsWith('#/search/');
        const isSurah = path.startsWith('#/surah/');
        const isPage = path.startsWith('#/page/');
        const isRelevant = isSurah || isPage || isSearch;
        
        let title = "QRAN.TOP";
        if (!isHome) {
            if (isSurah) {
                const surahNum = parseInt(path.split('/')[2], 10);
                const surah = QURAN_INDEX.find(s => s.number === surahNum);
                if (surah) title = formatSurahNameForDisplay(surah.name);
            } else if (isPage) {
                const pageNum = path.split('/')[2];
                title = `الصفحة ${pageNum}`;
            } else if (isSearch) {
                title = "نتائج البحث";
            }
        } else {
            title = "الفهرس";
        }

        return { 
            pageTitle: title, 
            isSurahOrPage: isSurah || isPage, 
            isRelevantPageForToggle: isRelevant,
            isSearchPage: isSearch,
            isHomePage: isHome
        };
    }, [currentPath]);

    const isUthmaniLoading = useMemo(() => {
        return loadingEditions.includes('quran-uthmani-quran-academy');
    }, [loadingEditions]);

    const handleStyleToggle = useCallback(() => {
        if (fontStyle === 'imlai_1') {
            setFontStyle('imlai_2');
            setSelectedEdition('quran-simple-clean');
            setBrowsingMode('full');
        } else if (fontStyle === 'imlai_2') {
            setFontStyle('uthmani');
            setSelectedEdition('quran-uthmani-quran-academy');
            setBrowsingMode('page');
        } else { // 'uthmani'
            setFontStyle('imlai_1');
            setSelectedEdition('quran-simple-clean');
            setBrowsingMode('full');
        }
    }, [fontStyle, setFontStyle, setSelectedEdition, setBrowsingMode]);

    const getToggleLabel = () => {
        if (isUthmaniLoading && fontStyle !== 'uthmani') return '...';
        switch (fontStyle) {
            case 'imlai_1': return 'إملائي 1';
            case 'imlai_2': return 'إملائي 2';
            case 'uthmani': return 'عثماني';
            default: return '...';
        }
    };

    const handlePlaySurah = useCallback(() => {
        if (!isOnline) {
            alert("عذراً، الاستماع للتلاوة يتطلب اتصالاً بالإنترنت.");
            return;
        }
        onStartPlayback([], selectedAudioEdition);
    }, [onStartPlayback, selectedAudioEdition, isOnline]);

    const handleSearchSubmit = (query: string) => {
        onSearch(query);
        setIsMobileSearchOpen(false);
    };
    
    const handleTitleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.hash = '#/';
    };

    return (
        <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md shadow-sm border-b border-border-default transition-all duration-300">
            <div className="w-full max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16 gap-2">
                    
                    {isMobileSearchOpen ? (
                        <div className="flex items-center w-full gap-2 animate-fade-in">
                            <button onClick={() => setIsMobileSearchOpen(false)} className="p-2 text-text-secondary hover:bg-surface-hover rounded-full">
                                <ArrowRightIcon className="w-6 h-6" />
                            </button>
                            <div className="flex-grow">
                                <SearchForm onSearch={handleSearchSubmit} disabled={searchDisabled} />
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Right Group (visually): Menu, Theme, Offline Indicator */}
                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                <button
                                    onClick={() => setIsSidePanelOpen(true)}
                                    className="p-2 text-text-muted rounded-full hover:bg-surface-hover transition-colors"
                                    aria-label="فتح القائمة"
                                >
                                    <MenuIcon className="w-6 h-6" />
                                </button>
                                <ThemeToggleButton />
                                {!isOnline && (
                                    <div className="flex items-center justify-center p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" title="أنت غير متصل بالإنترنت. بعض الميزات قد لا تعمل.">
                                        <WifiOffIcon className="w-5 h-5" />
                                    </div>
                                )}
                            </div>

                            {/* Center Group: Title or Search */}
                            <div className="flex-grow flex justify-center min-w-0 px-2">
                                {/* Mobile Title */}
                                <div className="md:hidden text-lg font-bold text-text-primary truncate" title={pageTitle}>
                                     {isSearchPage ? (
                                        <a href="#/" onClick={handleTitleClick} className="hover:underline">{pageTitle}</a>
                                    ) : (
                                        pageTitle
                                    )}
                                </div>
                                
                                {/* Desktop Search - Always Visible */}
                                <div className="hidden md:flex items-center w-full max-w-xl">
                                    <SearchForm onSearch={onSearch} disabled={searchDisabled} />
                                </div>
                            </div>
                            
                            {/* Left Group (visually): Actions, Logo */}
                            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                {isRelevantPageForToggle && (
                                    <button 
                                        onClick={handleStyleToggle}
                                        disabled={fontStyle !== 'uthmani' && isUthmaniLoading}
                                        className="px-2 py-1.5 text-xs md:text-sm md:px-3 font-semibold bg-surface-subtle text-text-secondary rounded-lg hover:bg-surface-hover transition-colors border border-border-default disabled:opacity-50"
                                        title="التبديل بين أوضاع العرض"
                                    >
                                        <span>{getToggleLabel()}</span>
                                    </button>
                                )}

                                {isSurahOrPage && (
                                    <button
                                        onClick={handlePlaySurah}
                                        disabled={isPlaybackLoading}
                                        className="hidden md:flex p-2 bg-primary text-white rounded-full shadow-md hover:bg-primary-hover transition-colors disabled:opacity-60"
                                        aria-label="استماع"
                                        title={!isOnline ? "غير متاح بدون إنترنت" : "استماع"}
                                    >
                                        {isPlaybackLoading ? <SpinnerIcon className="w-4 h-4"/> : <PlayIcon className="w-4 h-4"/>}
                                    </button>
                                )}

                                <button 
                                    onClick={() => setIsMobileSearchOpen(true)}
                                    className="md:hidden p-2 text-text-muted hover:text-primary hover:bg-surface-hover rounded-full"
                                    aria-label="بحث"
                                >
                                    <SearchIcon className="w-6 h-6" />
                                </button>
                                
                                <div className="w-px h-6 bg-border-default mx-1"></div>

                                <Logo dataSourceStatus={dataSourceStatus} isHomePage={isHomePage} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;