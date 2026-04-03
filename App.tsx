import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './index.css';
import type { SurahData, Ayah, SavedItem } from './types';
import { useQuranData } from './hooks/useQuranData';
import { useSettings } from './hooks/useSettings';
import { useRouting } from './hooks/useRouting';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useNotebook } from './hooks/useNotebook';
import { AuthProvider } from './hooks/useAuth';
import { useSearch } from './hooks/useSearch';
import { useServiceWorkerUpdater } from './hooks/useServiceWorkerUpdater';
import { useAppVersion } from './hooks/useAppVersion';
import { SettingsProvider } from './contexts/SettingsContext';
import AppRouter from './components/AppRouter';
import TopProgressBar from './components/TopProgressBar';
import SidePanel from './components/SidePanel';
import AudioPlayerBar from './components/AudioPlayerBar';
import Toolbox from './components/Toolbox';
import SaveItemModal from './components/SaveItemModal';
import UpdateNotification from './components/UpdateNotification';
import { ArrowUpIcon, RefreshIcon, WifiOffIcon } from './components/icons';
import Header from './components/Header';
import { ALL_AUDIO_EDITIONS } from './data/audioEditions';


const KHATMIYAH_AUDIO_PROGRESS_KEY = 'qran_khatmiyah_audio_progress';


const App: React.FC = () => {
    // --- State from Hooks ---
    const {
        allQuranData, isInitialLoading, isBackgroundLoading, loadingEditions,
        fetchCustomEditionData, dataSourceStatus, error: dataError
    } = useQuranData();

    const { currentPath, pathParts, queryParams } = useRouting();

    // Initialize settings hook here, then pass results to Provider
    const settings = useSettings();
    const { selectedEdition, selectedAudioEdition, setSelectedAudioEdition, displayEdition } = settings;
    
    const { 
        simpleSearchableAyahs, 
        tryParseAyahReference, 
        performSearch, 
        performSearchByAyahNumber 
    } = useSearch(allQuranData);

    const {
        playbackInfo, currentlyPlayingAyahGlobalNumber, selectedAudioEditionDetails,
        handleStartPlayback, handlePlayPause, handleNext, handlePrev, handleClosePlayback
    } = useAudioPlayer(currentPath, allQuranData, selectedAudioEdition, setSelectedAudioEdition, fetchCustomEditionData);

    const {
        collections, itemToSave, setItemToSave, handleSaveItem, handleConfirmSave,
        handleDeleteCollection, handleDeleteSavedItem, handleExportNotebook,
        handleImportNotebook, updateItemNotes,
    } = useNotebook();
    
    const { showUpdateNotification: showSWUpdate, handleUpdate: handleSWUpdate } = useServiceWorkerUpdater();
    const { isUpdateAvailable: isAppUpdateAvailable, applyUpdate: handleAppUpdate } = useAppVersion();
    
    const showUpdateNotification = showSWUpdate || isAppUpdateAvailable;
    const handleUpdate = isAppUpdateAvailable ? handleAppUpdate : handleSWUpdate;
    
    // --- App-level State ---
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [showScroll, setShowScroll] = useState(false);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    
    const [audioKhatmiyahProgress, setAudioKhatmiyahProgress] = useState<{ ayahNumber: number } | null>(() => {
        try {
            const stored = localStorage.getItem(KHATMIYAH_AUDIO_PROGRESS_KEY);
            if (stored) return JSON.parse(stored);
        } catch (e) { console.error("Failed to parse audio khatmiyah progress", e); }
        return { ayahNumber: 1 };
    });
    
    const handleSaveAudioKhatmiyahProgress = useCallback((ayahNumber: number) => {
        const newProgress = { ayahNumber };
        setAudioKhatmiyahProgress(newProgress);
        localStorage.setItem(KHATMIYAH_AUDIO_PROGRESS_KEY, JSON.stringify(newProgress));
    }, []);
    
    // --- UI Effects ---
    useEffect(() => {
        const checkScrollTop = () => setShowScroll(window.pageYOffset > 400);
        window.addEventListener('scroll', checkScrollTop);
        return () => window.removeEventListener('scroll', checkScrollTop);
    }, []);

    useEffect(() => {
        if (!isInitialLoading) {
            const loader = document.querySelector('.static-loader');
            if (loader) {
                (loader as HTMLElement).style.opacity = '0';
                setTimeout(() => loader.remove(), 500);
            }
        }
    }, [isInitialLoading]);

    // --- Search Handlers ---
    const handleSearch = (query: string, sourceEdition?: string, position?: { surah: number; ayah: number; wordIndex: number; }) => {
        const ayahRef = tryParseAyahReference(query);
        if (ayahRef && !position) {
            window.location.hash = `#/surah/${ayahRef.surah}?ayah=${ayahRef.ayah}`;
            return;
        }
        setIsSearching(true);
        let url = `#/search/${encodeURIComponent(query)}?search_edition=${sourceEdition || 'quran-simple-clean'}`;
        if (position) url += `&s=${position.surah}&a=${position.ayah}&w=${position.wordIndex}`;
        window.location.hash = url;
    };

    const handleSearchByAyahNumber = (ayahNumber: number) => {
        setIsSearching(true);
        window.location.hash = `#/search/number/${ayahNumber}`;
    };


    // --- Other Handlers ---
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    // --- Data Derivations for Views ---
    const quranData = useMemo(() => allQuranData?.[selectedEdition], [allQuranData, selectedEdition]);
    
    const hizbQuarterStartMap = useMemo(() => {
        if (!simpleSearchableAyahs) return new Map<number, number>();
        const map = new Map<number, number>();
        simpleSearchableAyahs.forEach(ayah => {
            if (ayah.hizbQuarter && !map.has(ayah.hizbQuarter)) {
                map.set(ayah.hizbQuarter, ayah.number);
            }
        });
        return map;
    }, [simpleSearchableAyahs]);
    
    const isAudioKhatmiyahPage = currentPath.startsWith('#/audio-khatmiyah');
    const isPageWithToolbox = useMemo(() => 
        (currentPath.startsWith('#/surah/') || currentPath.startsWith('#/search/') || currentPath.startsWith('#/page/')) && !isAudioKhatmiyahPage, 
    [currentPath, isAudioKhatmiyahPage]);

    const isSearchDataReady = simpleSearchableAyahs.length > 0;

    // --- Retry Handler ---
    const handleRetryLoading = () => {
        window.location.reload();
    };

    if (dataError && !isSearchDataReady) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text-primary p-6 text-center animate-fade-in">
                <WifiOffIcon className="w-20 h-20 text-text-muted mb-4 opacity-50" />
                <h2 className="text-2xl font-bold mb-2">تعذر تحميل البيانات</h2>
                <p className="text-text-secondary mb-6 max-w-md">
                    يبدو أن هناك مشكلة في الاتصال بالإنترنت. التطبيق يحتاج لتحميل البيانات الأساسية لأول مرة.
                </p>
                <button 
                    onClick={handleRetryLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors shadow-lg"
                >
                    <RefreshIcon className="w-5 h-5" />
                    <span>إعادة المحاولة</span>
                </button>
            </div>
        );
    }

    return (
        <AuthProvider>
            <SettingsProvider value={settings}>
                <div className="bg-background text-text-primary min-h-screen transition-colors duration-300">
                    <TopProgressBar isSearching={isSearching || isBackgroundLoading || loadingEditions.length > 0} />
                    <SidePanel 
                        isOpen={isSidePanelOpen}
                        onClose={() => setIsSidePanelOpen(false)}
                        currentPath={currentPath}
                        onNavigate={(path) => {
                            const currentHash = window.location.hash || '#/';
                            if (currentHash !== path) {
                                window.location.hash = path;
                            }
                            setIsSidePanelOpen(false);
                        }}
                    />
                    {!isAudioKhatmiyahPage && (
                        <Header
                            setIsSidePanelOpen={setIsSidePanelOpen}
                            currentPath={currentPath}
                            dataSourceStatus={dataSourceStatus}
                            onSearch={handleSearch}
                            searchDisabled={isInitialLoading || !isSearchDataReady}
                            loadingEditions={loadingEditions}
                            onStartPlayback={handleStartPlayback}
                            isPlaybackLoading={!!playbackInfo?.trigger}
                        />
                    )}
                    <main className={`pt-8 pb-24 ${isAudioKhatmiyahPage ? 'pt-0' : ''}`}>
                        <AppRouter
                            pathParts={pathParts}
                            queryParams={queryParams}
                            isInitialLoading={isInitialLoading}
                            quranData={quranData}
                            simpleSearchableAyahs={simpleSearchableAyahs}
                            collections={collections}
                            audioKhatmiyahProgress={audioKhatmiyahProgress}
                            handleSaveAudioKhatmiyahProgress={handleSaveAudioKhatmiyahProgress}
                            allQuranData={allQuranData}
                            fetchCustomEditionData={fetchCustomEditionData}
                            handleDeleteCollection={handleDeleteCollection}
                            handleDeleteSavedItem={handleDeleteSavedItem}
                            updateItemNotes={updateItemNotes}
                            handleExportNotebook={handleExportNotebook}
                            handleImportNotebook={handleImportNotebook}
                            handleSearch={handleSearch}
                            handleSaveItem={handleSaveItem as (item: SavedItem) => void}
                            handleSearchByAyahNumber={handleSearchByAyahNumber}
                            currentlyPlayingAyahGlobalNumber={currentlyPlayingAyahGlobalNumber}
                            playbackInfo={playbackInfo}
                            handleStartPlayback={handleStartPlayback as (ayahs: Ayah[], audioEditionIdentifier: string, startIndex?: number) => void}
                            hizbQuarterStartMap={hizbQuarterStartMap}
                            setIsSearching={setIsSearching}
                            performSearchByAyahNumber={performSearchByAyahNumber}
                            performSearch={performSearch}
                        />
                    </main>

                    {isPageWithToolbox && <Toolbox
                        isAudioPlayerVisible={!!playbackInfo}
                    />}
                    {itemToSave && <SaveItemModal item={itemToSave} collections={collections} onClose={() => setItemToSave(null)} onSave={handleConfirmSave} />}
                    {playbackInfo && !isAudioKhatmiyahPage && <AudioPlayerBar 
                        playlist={playbackInfo.playlist} currentIndex={playbackInfo.currentIndex}
                        isPlaying={playbackInfo.isPlaying} isLoading={!!playbackInfo?.trigger}
                        onPlayPause={handlePlayPause} onNext={handleNext} onPrev={handlePrev}
                        onEnded={handleNext} onClose={handleClosePlayback}
                        audioEdition={selectedAudioEditionDetails}
                    />}
                    {showScroll && !isAudioKhatmiyahPage && <button onClick={scrollToTop} className={`fixed left-8 p-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${!!playbackInfo ? 'bottom-28' : 'bottom-8'}`} aria-label="الانتقال إلى الأعلى"><ArrowUpIcon className="w-6 h-6" /></button>}
                    {showUpdateNotification && <UpdateNotification onUpdate={handleUpdate} />}
                </div>
            </SettingsProvider>
        </AuthProvider>
    );
};

export default App;