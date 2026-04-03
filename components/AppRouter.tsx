import React from 'react';
import type { Ayah, SurahData, Collections, QuranEdition, SavedItem } from '../types';

import HomeView from './HomeView';
import SurahDetailView from './SurahDetailView';
import { SearchView } from './SearchView';
import SettingsView from './SettingsView';
import SavedView from './SavedView';
import KhatmiyahView from './KhatmiyahView';
import AudioKhatmiyahView from './AudioKhatmiyahView';
import AdminView from './AdminView';
import CommentsCloudView from './CommentsCloudView';
import WordAnalysisView from './WordAnalysisView';
import PrivacyPolicyView from './PrivacyPolicyView';
import LoadingScreen from './LoadingScreen';
import AboutView from './AboutView';

import { QURAN_INDEX } from '../quranIndex';
import { JUZ_INDEX, HIZB_INDEX } from '../quranPartitions';
import { useSettingsContext } from '../contexts/SettingsContext';
import { ALL_AUDIO_EDITIONS } from '../data/audioEditions';

interface AppRouterProps {
    pathParts: string[];
    queryParams: URLSearchParams;
    isInitialLoading: boolean;
    quranData: SurahData[] | undefined;
    simpleSearchableAyahs: Ayah[];
    collections: Collections;
    audioKhatmiyahProgress: { ayahNumber: number } | null;
    handleSaveAudioKhatmiyahProgress: (ayahNumber: number) => void;
    allQuranData: { [key: string]: SurahData[] } | null;
    fetchCustomEditionData: (id: string) => void;
    handleDeleteCollection: (id: string) => void;
    handleDeleteSavedItem: (collectionId: string, itemId: string) => void;
    updateItemNotes: (collectionId: string, itemId: string, notes: string) => void;
    handleExportNotebook: () => Promise<string>;
    handleImportNotebook: (code: string) => Promise<void>;
    handleSearch: (query: string, sourceEdition?: string, position?: { surah: number; ayah: number; wordIndex: number; }) => void;
    handleSaveItem: (item: SavedItem) => void;
    handleSearchByAyahNumber: (num: number) => void;
    currentlyPlayingAyahGlobalNumber: number | null;
    playbackInfo: any;
    handleStartPlayback: (ayahs: Ayah[], audioEditionIdentifier: string, startIndex?: number) => void;
    hizbQuarterStartMap: Map<number, number>;
    setIsSearching: (isSearching: boolean) => void;
    performSearchByAyahNumber: (num: number) => Ayah[];
    performSearch: (query: string) => { results: Ayah[], finalSearchEdition: string, correctedQuery?: string };
}

const AppRouter: React.FC<AppRouterProps> = (props) => {
    const {
        pathParts, queryParams, isInitialLoading, quranData, simpleSearchableAyahs, collections,
        audioKhatmiyahProgress, handleSaveAudioKhatmiyahProgress,
        allQuranData, fetchCustomEditionData,
        handleDeleteCollection, handleDeleteSavedItem, updateItemNotes, handleExportNotebook,
        handleImportNotebook, handleSearch, handleSaveItem,
        handleSearchByAyahNumber, currentlyPlayingAyahGlobalNumber, playbackInfo, handleStartPlayback,
        hizbQuarterStartMap, setIsSearching, performSearchByAyahNumber, performSearch
    } = props;

    // Use Context for AudioEditions and selections
    const { activeEditions, selectedAudioEdition, setSelectedAudioEdition } = useSettingsContext();

    if (isInitialLoading) return <LoadingScreen />;
    if (pathParts[0] === 'admin') return <AdminView />;
    if (pathParts[0] === 'khatmiyah') return <KhatmiyahView khatmiyahId={pathParts[1] || null} />;
    if (pathParts[0] === 'audio-khatmiyah') {
        return <AudioKhatmiyahView
            allAyahs={simpleSearchableAyahs}
            allAudioEditions={ALL_AUDIO_EDITIONS}
            initialAyahNumber={audioKhatmiyahProgress?.ayahNumber || 1}
            onSaveProgress={handleSaveAudioKhatmiyahProgress}
            selectedAudioEdition={selectedAudioEdition}
            onAudioEditionChange={setSelectedAudioEdition}
            allQuranData={allQuranData}
            fetchCustomEditionData={fetchCustomEditionData}
            activeEditions={activeEditions}
        />;
    }
    if (pathParts[0] === 'saved') return <SavedView collections={collections} collectionId={pathParts[1] || null} onDeleteCollection={handleDeleteCollection} onDeleteSavedItem={handleDeleteSavedItem} onUpdateNotes={updateItemNotes} />;
    if (pathParts[0] === 'analysis') return <WordAnalysisView simpleCleanData={allQuranData?.['quran-simple-clean'] || []} initialWord={pathParts[1] ? decodeURIComponent(pathParts[1]) : undefined} />;
    if (pathParts[0] === 'settings') return <SettingsView 
        onExportNotebook={handleExportNotebook} 
        onImportNotebook={handleImportNotebook}
    />;
    if (pathParts[0] === 'about') return <AboutView />;
    if (pathParts[0] === 'privacy-policy') return <PrivacyPolicyView />;
    
    // Handle Page Route
    if (pathParts[0] === 'page' && pathParts[1]) {
        if (isInitialLoading || !quranData) {
            return null;
        }
        const pageNumber = parseInt(pathParts[1], 10);
        
        const pageSurahs: SurahData[] = [];
        let startAyahInFirstSurah: number | null = null;

        for (const surah of quranData) {
            const ayahsOnPage = surah.ayahs.filter(a => a.page === pageNumber);
            if (ayahsOnPage.length > 0) {
                pageSurahs.push({ ...surah, ayahs: ayahsOnPage });
                if (startAyahInFirstSurah === null) {
                    startAyahInFirstSurah = ayahsOnPage[0].numberInSurah;
                }
            }
        }

        if (pageSurahs.length > 0) {
            return <SurahDetailView 
                surah={pageSurahs[0]}
                pageSurahs={pageSurahs}
                highlightAyahNumber={startAyahInFirstSurah}
                onWordClick={handleSearch}
                onSaveAyah={handleSaveItem}
                onSearchByAyahNumber={handleSearchByAyahNumber}
                currentlyPlayingAyahGlobalNumber={currentlyPlayingAyahGlobalNumber}
                onStartPlayback={handleStartPlayback as (ayahs: Ayah[], audioEditionIdentifier: string, startIndex?: number) => void}
                selectedAudioEdition={selectedAudioEdition}
                simpleCleanData={allQuranData?.['quran-simple-clean'] || []}
                hizbQuarterStartMap={hizbQuarterStartMap}
                forcedPageNumber={pageNumber}
            />;
        } else {
             return <div className="text-center p-10">الصفحة غير موجودة</div>;
        }
    }

    if (pathParts[0] === 'surah' && pathParts[1]) {
        if (isInitialLoading || !quranData) {
            return null;
        }
        const surahNumber = parseInt(pathParts[1], 10);
        const highlightAyahNumber = queryParams.get('ayah') ? parseInt(queryParams.get('ayah')!, 10) : null;
        const surah = quranData.find(s => s.number === surahNumber);
        if (surah) {
            return <SurahDetailView 
                surah={surah}
                highlightAyahNumber={highlightAyahNumber}
                onWordClick={handleSearch}
                onSaveAyah={handleSaveItem}
                onSearchByAyahNumber={handleSearchByAyahNumber}
                currentlyPlayingAyahGlobalNumber={currentlyPlayingAyahGlobalNumber}
                onStartPlayback={handleStartPlayback as (ayahs: Ayah[], audioEditionIdentifier: string, startIndex?: number) => void}
                selectedAudioEdition={selectedAudioEdition}
                simpleCleanData={allQuranData?.['quran-simple-clean'] || []}
                hizbQuarterStartMap={hizbQuarterStartMap}
            />;
        }
    }
    if (pathParts[0] === 'search') {
        const commonProps = {
            onNewSearch: handleSearch, onSearchByAyahNumber: handleSearchByAyahNumber,
            onSearchComplete: () => setIsSearching(false),
            displayEditionData: quranData || [], 
            simpleCleanData: allQuranData?.['quran-simple-clean'] || [],
            onSaveAyah: handleSaveItem, onSaveSearch: handleSaveItem,
            currentlyPlayingAyahGlobalNumber: currentlyPlayingAyahGlobalNumber, isPlaybackLoading: !!playbackInfo?.trigger,
            onStartPlayback: handleStartPlayback,
        };
        if (pathParts[1] === 'number' && pathParts[2]) {
            const ayahNumber = parseInt(pathParts[2], 10);
            return <SearchView {...commonProps} query={pathParts[2]} results={performSearchByAyahNumber(ayahNumber)} searchEdition={'quran-simple-clean'} searchType="number" />;
        }
        const query = pathParts[1] ? decodeURIComponent(pathParts[1]) : "";
        const searchResult = performSearch(query);
        const position = queryParams.get('s') ? { surah: parseInt(queryParams.get('s')!), ayah: parseInt(queryParams.get('a')!), wordIndex: parseInt(queryParams.get('w')!) } : undefined;
        return <SearchView {...commonProps} query={query} results={searchResult.results} correctedQuery={searchResult.correctedQuery} autoOpenDiscussion={!!queryParams.get('from')} searchEdition={searchResult.finalSearchEdition} position={position} />;
    }
    if (pathParts[0] === 'comments') return <CommentsCloudView />;
    
    return <HomeView surahList={QURAN_INDEX} juzList={JUZ_INDEX} hizbList={HIZB_INDEX} />;
};

export default AppRouter;