import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { Ayah, SurahData, SavedAyahItem, SavedSearchItem } from '../types';
import { SearchIcon, ClearIcon, BackspaceIcon, BackspaceReverseIcon } from './icons';
import { normalizeArabicText, formatSurahNameForDisplay } from '../utils/text';
import { useSearchLogic } from '../hooks/useSearchLogic';
import { db } from '../firebase';
import { useSettingsContext } from '../contexts/SettingsContext';
import { ALL_AUDIO_EDITIONS } from '../data/audioEditions';

import DiscussionSection from './DiscussionSection';
import AyahActionPopover from './AyahActionPopover';
import SearchResultItem from './SearchResultItem';
import SearchResultsHeader from './search/SearchResultsHeader';
import SearchResultsToolbar from './search/SearchResultsToolbar';
import PhraseFilters from './search/PhraseFilters';
import NeighboringWords from './search/NeighboringWords';


interface SearchViewProps {
  query: string;
  results: Ayah[];
  onNewSearch: (word: string, sourceEdition?: string, position?: { surah: number, ayah: number, wordIndex: number }) => void;
  onSearchByAyahNumber: (ayahNumber: number) => void;
  onSearchComplete: () => void;
  autoOpenDiscussion?: boolean;
  displayEditionData: SurahData[];
  searchEdition: string;
  position?: { surah: number, ayah: number, wordIndex: number };
  simpleCleanData: SurahData[];
  onSaveAyah: (item: SavedAyahItem) => void;
  onSaveSearch: (item: SavedSearchItem) => void;
  searchType?: 'text' | 'number';
  // --- Props for audio playback ---
  currentlyPlayingAyahGlobalNumber: number | null;
  isPlaybackLoading: boolean;
  onStartPlayback: (ayahs: Ayah[], audioEditionIdentifier: string, startIndex?: number) => void;
  correctedQuery?: string;
}

export const SearchView: React.FC<SearchViewProps> = ({ 
    query, results, onNewSearch, onSearchByAyahNumber, onSearchComplete, autoOpenDiscussion, 
    displayEditionData, searchEdition, position, 
    simpleCleanData, onSaveAyah, onSaveSearch, searchType = 'text',
    currentlyPlayingAyahGlobalNumber, isPlaybackLoading, onStartPlayback,
    correctedQuery
}) => {
  const [editableQuery, setEditableQuery] = useState(query);
  const [isAllCopied, setIsAllCopied] = useState(false);
  
  // Consume Settings from Context
  const { displayEdition, fontStyle, selectedAudioEdition, setSelectedAudioEdition, activeEditions } = useSettingsContext();

  const itemRefs = useRef<React.RefObject<HTMLLIElement>[]>([]);
  
  const [wordPopoverState, setWordPopoverState] = useState<{
    resultIndex: number;
    simpleText: string;
    triggerElement: HTMLElement;
  } | null>(null);
  const wordPopoverRef = useRef<HTMLDivElement>(null);

  const [activePopover, setActivePopover] = useState<{ ayah: Ayah; triggerElement: HTMLElement } | null>(null);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [cachedAnalysisExists, setCachedAnalysisExists] = useState(false);
  const [pulsingWord, setPulsingWord] = useState<{ itemIndex: number; wordIndex: number } | null>(null);
  
  const {
    exactMatch, setExactMatch,
    visibleSuggestionsCount, handleShowMore,
    activePhraseFilter, setActivePhraseFilter,
    queryWords, isSingleWordSearch,
    phraseFilters,
    displayedResults,
    occurrencesMap, totalOccurrences,
    generalOccurrences, exactOccurrences,
    neighboringWords,
    formatResultsForExport,
  } = useSearchLogic(query, correctedQuery, results, searchType as 'text' | 'number', simpleCleanData);


  const normalizedQueryForDiscussion = useMemo(() => {
    if (searchType === 'number') return `topic:ayah-number:${query}`;
    return normalizeArabicText(correctedQuery || query);
  }, [query, correctedQuery, searchType]);

  useEffect(() => { setEditableQuery(query); }, [query]);
  useEffect(() => { onSearchComplete(); }, [results, onSearchComplete]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (wordPopoverRef.current && !wordPopoverRef.current.contains(event.target as Node)) {
            if (!(event.target as HTMLElement).closest('.word-trigger')) {
                setWordPopoverState(null);
            }
        }
        if (!(event.target as HTMLElement).closest('.popover-trigger, .popover-content')) {
            setActivePopover(null);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const checkAnalysisCache = async () => {
        const trimmedQuery = (correctedQuery || query).trim();
        const isSingleWord = trimmedQuery.split(/\s+/).length === 1 && trimmedQuery.length > 1;
        if (isSingleWord && searchType === 'text') {
            setCachedAnalysisExists(false);
            try {
                const snapshot = await db.collection('qran_word_analysis_cache').doc(normalizeArabicText(trimmedQuery)).collection('analyses').limit(1).get();
                if (!snapshot.empty) setCachedAnalysisExists(true);
            } catch (error) { console.error("Error checking analysis cache:", error); }
        } else {
            setCachedAnalysisExists(false);
        }
    };
    checkAnalysisCache();
  }, [query, correctedQuery, searchType]);

  itemRefs.current = displayedResults.map((_, i) => itemRefs.current[i] ?? React.createRef());

  useEffect(() => {
    if (currentlyPlayingAyahGlobalNumber) {
        const playingIndex = displayedResults.findIndex(ayah => ayah.number === currentlyPlayingAyahGlobalNumber);
        if (playingIndex !== -1 && itemRefs.current[playingIndex]?.current) {
            itemRefs.current[playingIndex].current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
  }, [currentlyPlayingAyahGlobalNumber, displayedResults]);

  const handleJumpToOccurrence = (target: number) => {
    const occurrence = occurrencesMap[target - 1];
    if (occurrence && itemRefs.current[occurrence.itemIndex]?.current) {
        const element = itemRefs.current[occurrence.itemIndex].current;
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setPulsingWord({ itemIndex: occurrence.itemIndex, wordIndex: occurrence.wordIndex });
        setTimeout(() => setPulsingWord(null), 3000);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = editableQuery.trim();
    if (trimmedQuery && trimmedQuery !== query) onNewSearch(trimmedQuery);
  };

  const handleDeleteFirstChar = () => {
    const newQuery = editableQuery.slice(1);
    if (newQuery) onNewSearch(newQuery); else setEditableQuery('');
  };

  const handleDeleteLastChar = () => {
    const newQuery = editableQuery.slice(0, -1);
    if (newQuery) onNewSearch(newQuery); else setEditableQuery('');
  };

  const handleSaveSearch = () => {
    const queryToSave = correctedQuery || query;
    if (queryToSave) onSaveSearch({ type: 'search', id: queryToSave, query: queryToSave, createdAt: Date.now() });
  };
  
  const handleCopyAll = () => {
    const textToCopy = formatResultsForExport(displayEditionData);
    if (textToCopy) navigator.clipboard.writeText(textToCopy).then(() => {
        setIsAllCopied(true);
        setTimeout(() => setIsAllCopied(false), 2500);
    });
  };

  const handleDownloadAll = () => {
    const textToDownload = formatResultsForExport(displayEditionData);
    if (textToDownload) {
        const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const safeQuery = (correctedQuery || query).replace(/[^a-zA-Z0-9-ء-ي ]/g, "").trim() || 'results';
        link.download = `qran-top-search-${safeQuery}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }
  };
  
  const handlePlayAll = () => {
    if (displayedResults.length > 0) onStartPlayback(displayedResults, selectedAudioEdition);
  };

  // --- Ayah Action Handlers ---
  const handleSaveClick = (ayah: Ayah) => {
    onSaveAyah({ type: 'ayah', id: `${ayah.surah!.number}:${ayah.numberInSurah}`, surah: ayah.surah!.number, ayah: ayah.numberInSurah, text: ayah.text || '', createdAt: Date.now() });
    setActivePopover(null);
  };
  const handleCopyAyah = (ayah: Ayah) => {
    const isImlaei = fontStyle === 'imlai_1' || fontStyle === 'imlai_2';
    let ayahText = ayah.text || '';

    if (isImlaei) {
        const marksToRemoveRegex = /[\u06D6-\u06ED]/g;
        ayahText = ayahText.replace(marksToRemoveRegex, '');
    }

    const textToCopy = `"${ayahText}" (سورة ${formatSurahNameForDisplay(ayah.surah?.name)} - الآية ${ayah.numberInSurah})`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        setCopiedAyah(ayah.number);
        setTimeout(() => setCopiedAyah(null), 2000);
        setActivePopover(null);
    });
  };
  const handleSearchByAyahText = (ayah: Ayah) => {
    const simpleSurah = simpleCleanData.find(s => s.number === ayah.surah!.number);
    const simpleAyah = simpleSurah?.ayahs.find(a => a.numberInSurah === ayah.numberInSurah);
    if (simpleAyah?.text) onNewSearch(simpleAyah.text, 'quran-simple-clean', { surah: ayah.surah!.number, ayah: ayah.numberInSurah, wordIndex: 0 });
    else if (ayah.text) onNewSearch(ayah.text, displayEdition.identifier, { surah: ayah.surah!.number, ayah: ayah.numberInSurah, wordIndex: 0 });
    setActivePopover(null);
  };
  const handlePlayFromAyah = (ayah: Ayah) => {
    const startIndex = results.findIndex(a => a.number === ayah.number);
    if (startIndex !== -1) onStartPlayback(results, selectedAudioEdition, startIndex);
    setActivePopover(null);
  };

  return (
    <div className="animate-fade-in w-full max-w-4xl mx-auto px-4">
      {searchType !== 'number' && (
          <div className="mb-6">
              <form onSubmit={handleFormSubmit} className="flex-grow w-full flex items-center gap-2">
                {isSingleWordSearch && editableQuery.length > 1 && <button type="button" onClick={handleDeleteFirstChar} className="flex-shrink-0 p-2 text-text-muted rounded-full hover:bg-surface-hover transition-colors" title="حذف من بداية الكلمة"><BackspaceIcon className="w-5 h-5" /></button>}
                <div className="relative flex-grow">
                    <input type="text" value={editableQuery} onChange={(e) => setEditableQuery(e.target.value)} placeholder="ابحث عن كلمة..." className="w-full text-xl font-bold text-primary-text-strong border-b-2 border-border-default focus:border-primary bg-transparent py-2 pr-4 pl-12 outline-none transition-colors" aria-label="كلمة البحث"/>
                    {editableQuery && (<button type="button" onClick={() => { setEditableQuery(''); onNewSearch(''); }} className="absolute left-1 top-1/2 -translate-y-1/2 p-2 text-text-muted hover:text-text-primary rounded-full" aria-label="مسح البحث"><ClearIcon className="w-5 h-5" /></button>)}
                </div>
                {isSingleWordSearch && editableQuery.length > 1 && <button type="button" onClick={handleDeleteLastChar} className="flex-shrink-0 p-2 text-text-muted rounded-full hover:bg-surface-hover transition-colors" title="حذف من نهاية الكلمة"><BackspaceReverseIcon className="w-5 h-5" /></button>}
                <button type="submit" className="flex-shrink-0 p-3 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50" aria-label="بحث"><SearchIcon className="w-5 h-5" /></button>
            </form>
            <NeighboringWords neighboringWords={neighboringWords} visibleSuggestionsCount={visibleSuggestionsCount} onNeighborClick={(word) => onNewSearch(`${editableQuery.trim()} ${word}`)} onShowMore={handleShowMore}/>
          </div>
      )}
      
      <main className="bg-surface p-6 sm:p-8 rounded-lg shadow-md transition-colors duration-300">
        <PhraseFilters phraseFilters={phraseFilters} activePhraseFilter={activePhraseFilter} setActivePhraseFilter={setActivePhraseFilter} resultsCount={displayedResults.length}/>
        <SearchResultsHeader 
            searchType={searchType} query={query} correctedQuery={correctedQuery}
            displayedResultsCount={displayedResults.length} resultsCount={results.length}
            isSingleWordSearch={isSingleWordSearch} generalOccurrences={generalOccurrences}
            exactOccurrences={exactOccurrences} exactMatch={exactMatch} setExactMatch={setExactMatch}
            totalOccurrences={totalOccurrences} onJumpToOccurrence={handleJumpToOccurrence}
            cachedAnalysisExists={cachedAnalysisExists} onNewSearch={onNewSearch}
        />
        
        {displayedResults.length > 0 && (
          <>
            <SearchResultsToolbar
                isPlaybackLoading={isPlaybackLoading} allAudioEditions={ALL_AUDIO_EDITIONS}
                onPlayAll={handlePlayAll} selectedAudioEdition={selectedAudioEdition}
                onAudioEditionChange={setSelectedAudioEdition} searchType={searchType}
                onSaveSearch={handleSaveSearch} onCopyAll={handleCopyAll}
                isAllCopied={isAllCopied} onDownloadAll={handleDownloadAll}
            />
            <DiscussionSection topicId={normalizedQueryForDiscussion} wordForTopic={correctedQuery || query} autoOpen={autoOpenDiscussion} showAnalysisButton={isSingleWordSearch} onAnalysisClick={() => window.location.hash = `#/analysis/${encodeURIComponent(correctedQuery || query)}`}/>
          </>
        )}
        
        <div className="mt-6">
            {displayedResults.length > 0 ? (
                <ul className="space-y-4">
                    {displayedResults.map((ayah, index) => {
                        const simpleSurah = simpleCleanData.find(s => s.number === ayah.surah?.number);
                        const simpleAyah = simpleSurah?.ayahs.find(a => a.numberInSurah === ayah.numberInSurah);
                        return (
                           <SearchResultItem 
                                key={ayah.number} itemRef={itemRefs.current[index]} ayah={ayah} 
                                queryWords={searchType === 'number' ? [] : queryWords} onNewSearch={onNewSearch}
                                displayEdition={displayEdition} displayEditionData={displayEditionData} searchEdition={searchEdition}
                                fontSize={useSettingsContext().fontSize} fontStyle={fontStyle} searchType={searchType} isCurrentlyPlaying={ayah.number === currentlyPlayingAyahGlobalNumber}
                                pulsingWordIndex={pulsingWord?.itemIndex === index ? pulsingWord.wordIndex : -1} resultIndex={index}
                                simpleAyahText={simpleAyah?.text || ''}
                                onUthmaniWordClick={(e, idx, text) => { if (wordPopoverState?.resultIndex === idx) setWordPopoverState(null); else setWordPopoverState({ resultIndex: idx, simpleText: text, triggerElement: e.currentTarget }); }}
                                onOpenPopover={(ayah, triggerElement) => setActivePopover({ ayah, triggerElement })}
                            />
                       );
                    })}
                </ul>
            ) : (<div className="text-center p-10 text-lg text-text-muted">لم يتم العثور على نتائج.</div>)}
        </div>
      </main>
      
       {wordPopoverState && (
         <div ref={wordPopoverRef} className="absolute p-3 bg-surface rounded-lg shadow-lg border border-border-default flex items-center gap-2 z-20 animate-fade-in flex-wrap leading-loose"
            style={(() => {
                if (!wordPopoverState.triggerElement) return { opacity: 0, top: 0, left: 0 };
                const rect = wordPopoverState.triggerElement.getBoundingClientRect();
                return { top: `${rect.bottom + window.scrollY + 5}px`, left: `${rect.left + window.scrollX + rect.width / 2}px`, transform: 'translateX(-50%)' };
            })()}
        >
            {wordPopoverState.simpleText.split(' ').map((word, wordIndex) => {
                const originalAyah = displayedResults[wordPopoverState.resultIndex];
                return (
                    <button key={wordIndex} onClick={() => { onNewSearch(word, 'quran-simple-clean', { surah: originalAyah.surah!.number, ayah: originalAyah.numberInSurah, wordIndex: wordIndex }); setWordPopoverState(null); }} className="px-2 py-1 bg-surface-subtle rounded-md hover:bg-primary/20 transition-colors">
                        {word}
                    </button>
                );
            })}
        </div>
      )}

       {activePopover && <AyahActionPopover activePopover={activePopover} onClose={() => setActivePopover(null)} onSave={handleSaveClick} onCopy={handleCopyAyah} onSearchText={handleSearchByAyahText} onSearchNumber={onSearchByAyahNumber} onPlayFrom={handlePlayFromAyah} copiedAyah={copiedAyah} />}
    </div>
  );
};