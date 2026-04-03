import React from 'react';
import type { Ayah, SurahData } from '../types';
import { useSettingsContext } from '../contexts/SettingsContext';

interface AyahRendererProps {
    ayahsToRender: Ayah[];
    surah: SurahData;
    highlightAyahNumber: number | null;
    onWordClick: (query: string, editionIdentifier: string, position: { surah: number; ayah: number; wordIndex: number; }) => void;
    currentlyPlayingAyahGlobalNumber: number | null;
    simpleCleanData: SurahData[];
    wordPopoverState: { ayahNumberInSurah: number; simpleText: string; triggerElement: HTMLElement; } | null;
    setWordPopoverState: (state: { ayahNumberInSurah: number; simpleText: string; triggerElement: HTMLElement; } | null) => void;
    setActivePopover: (state: { ayah: Ayah; triggerElement: HTMLElement } | null) => void;
    playingAyahRef: React.RefObject<HTMLSpanElement>;
    highlightRef: React.RefObject<HTMLSpanElement>;
    firstAyahInfo: { bismillah: string; restOfAyah: string; } | null;
}

const AyahRenderer: React.FC<AyahRendererProps> = ({
    ayahsToRender, surah, highlightAyahNumber, onWordClick,
    currentlyPlayingAyahGlobalNumber, simpleCleanData, wordPopoverState, setWordPopoverState,
    setActivePopover, playingAyahRef, highlightRef, firstAyahInfo
}) => {
    
    // Consume Settings from Context
    const { displayEdition, browsingMode } = useSettingsContext();
    const isImlaei = displayEdition.identifier.includes('simple-clean');

    const cleanImlaiText = (text: string | undefined): string | undefined => {
        if (!text) return text;
        const marksToRemoveRegex = /[\u06D6-\u06ED]/g;
        return text.replace(marksToRemoveRegex, '');
    };

    return (
        <>
            {ayahsToRender.map((ayah, index) => {
                const isHighlighted = ayah.numberInSurah === highlightAyahNumber;
                const isPlaying = ayah.number === currentlyPlayingAyahGlobalNumber;

                const simpleSurah = simpleCleanData.find(s => s.number === surah.number);
                const simpleAyah = simpleSurah?.ayahs.find(a => a.numberInSurah === ayah.numberInSurah);

                const baseText = (index === 0 && firstAyahInfo) ? firstAyahInfo.restOfAyah : ayah.text;
                const textToDisplay = isImlaei ? cleanImlaiText(baseText) : baseText;

                const createUthmaniWordClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
                    const simpleAyahText = simpleAyah?.text;
                    if (simpleAyahText) {
                        if (wordPopoverState?.ayahNumberInSurah === ayah.numberInSurah) {
                            setWordPopoverState(null);
                        } else {
                            setWordPopoverState({
                                ayahNumberInSurah: ayah.numberInSurah,
                                simpleText: simpleAyahText,
                                triggerElement: event.currentTarget,
                            });
                        }
                    }
                };

                return (
                    <span key={ayah.number} className="inline">
                        <span
                            // Add a stable ID for reliable scrolling
                            id={`ayah-${surah.number}-${ayah.numberInSurah}`}
                            ref={isPlaying ? playingAyahRef : (isHighlighted ? highlightRef : null)}
                            className={`inline rounded-md transition-colors duration-300 ${isPlaying ? 'bg-yellow-300/60 dark:bg-yellow-400/30' : ''}`}
                        >
                            {textToDisplay?.split(' ').map((word, wordIndex, arr) => (
                                <React.Fragment key={wordIndex}>
                                    <button
                                        onClick={
                                            isImlaei
                                                ? () => onWordClick(word, displayEdition.identifier, { surah: surah.number, ayah: ayah.numberInSurah, wordIndex: wordIndex })
                                                : createUthmaniWordClickHandler
                                        }
                                        className="word-trigger bg-transparent border-none p-0 font-inherit text-inherit leading-inherit cursor-pointer hover:bg-primary/10 rounded-md transition-colors"
                                        aria-label={`إظهار خيارات البحث لكلمة: ${word}`}
                                    >
                                        {word}
                                    </button>
                                    {wordIndex < arr.length - 1 && ' '}
                                </React.Fragment>
                            ))}
                        </span>

                        <span className="relative inline-block align-middle">
                            <button
                                onClick={(e) => setActivePopover({ ayah: ayah, triggerElement: e.currentTarget })}
                                className={`popover-trigger mx-1 select-none cursor-pointer hover:opacity-80 transition-opacity ${browsingMode === 'page' ? 'ayah-marker' : 'text-sm font-sans font-bold text-primary-text rounded-md p-1 -m-1'}`}
                                aria-label={`إجراءات للآية ${ayah.numberInSurah}`}
                                aria-haspopup="true"
                            >
                                {browsingMode === 'page' ? ayah.numberInSurah : `﴿${ayah.numberInSurah}﴾`}
                            </button>
                        </span>
                    </span>
                );
            })}
        </>
    );
};

export default AyahRenderer;