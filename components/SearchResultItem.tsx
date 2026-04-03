import React, { useMemo } from 'react';
import type { Ayah, SurahData, QuranEdition, FontSize, FontStyleType } from '../types';
import { SparklesIcon } from './icons';
import { normalizeArabicText } from '../utils/text';
import { getQuranTextStyle } from '../utils/font';

interface SearchResultItemProps {
  ayah: Ayah;
  queryWords: string[];
  onNewSearch: (word: string, sourceEdition?: string, position?: { surah: number, ayah: number, wordIndex: number }) => void;
  displayEdition: QuranEdition;
  displayEditionData: SurahData[];
  searchEdition: string;
  fontSize: FontSize;
  fontStyle: FontStyleType;
  searchType: 'text' | 'number';
  isCurrentlyPlaying: boolean;
  itemRef: React.RefObject<HTMLLIElement>;
  pulsingWordIndex: number;
  resultIndex: number;
  simpleAyahText: string;
  onUthmaniWordClick: (event: React.MouseEvent<HTMLButtonElement>, resultIndex: number, simpleAyahText: string) => void;
  onOpenPopover: (ayah: Ayah, triggerElement: HTMLElement) => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ 
    ayah, queryWords, onNewSearch, displayEdition, displayEditionData, 
    fontSize, fontStyle, searchType, isCurrentlyPlaying, itemRef, pulsingWordIndex,
    resultIndex, simpleAyahText, onUthmaniWordClick, onOpenPopover
}) => {

    const displayAyah = useMemo(() => {
        if (displayEditionData?.length > 0 && ayah.surah) {
            const displaySurah = displayEditionData.find(s => s.number === ayah.surah!.number);
            const displayAyahData = displaySurah?.ayahs.find(a => a.numberInSurah === ayah.numberInSurah);
            if (displayAyahData && displaySurah) {
                return { 
                    ...displayAyahData,
                    surah: {
                        number: displaySurah.number,
                        name: displaySurah.name,
                        englishName: displaySurah.englishName,
                        englishNameTranslation: displaySurah.englishNameTranslation,
                        revelationType: displaySurah.revelationType,
                    }
                };
            }
        }
        return ayah;
    }, [ayah, displayEditionData]);

    const { className: quranTextClass } = getQuranTextStyle(fontStyle, fontSize);

    const renderAyahWithHighlight = () => {
        if (displayEdition.format === 'audio') {
            return <span className="text-sm text-text-muted">[مصدر صوتي، لا يتوفر عرض نصي هنا]</span>
        }

        if (!displayAyah.text) {
            return '';
        }
        
        const isImlaei = fontStyle === 'imlai_1' || fontStyle === 'imlai_2';
        let textToRender = displayAyah.text;

        if (isImlaei) {
            // This regex removes Quranic annotation marks like waqf signs (salli, qali, jeem, etc.)
            const marksToRemoveRegex = /[\u06D6-\u06ED]/g;
            textToRender = textToRender.replace(marksToRemoveRegex, '');
        }
        
        const wordElements = textToRender.split(' ').map((word, index) => {
            const isPulsing = index === pulsingWordIndex;

            if (searchType === 'number') { // No highlighting for number search
                 return (
                    <button 
                        type="button" 
                        key={index} 
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isImlaei) {
                                if (word && ayah.surah) {
                                    onNewSearch(word, 'quran-simple-clean', { surah: ayah.surah.number, ayah: ayah.numberInSurah, wordIndex: index });
                                }
                            } else {
                                if (simpleAyahText) {
                                    onUthmaniWordClick(e, resultIndex, simpleAyahText);
                                }
                            }
                        }} 
                        className="word-trigger bg-transparent border-none p-0 font-inherit cursor-pointer hover:bg-primary/10 rounded-md px-1 transition-colors"
                        aria-label={`إظهار خيارات البحث لكلمة: ${word}`}
                    >
                        <span className={isPulsing ? 'animate-highlight-pulse rounded-sm' : ''}>{word}</span>
                    </button>
                 );
            }

            const normalizedWord = normalizeArabicText(word);
            const isMatch = queryWords.some(queryWord => normalizedWord.includes(queryWord));

            return (
                <button
                    type="button"
                    key={index}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isImlaei) {
                            if (word && ayah.surah) {
                                onNewSearch(word, 'quran-simple-clean', { surah: ayah.surah.number, ayah: ayah.numberInSurah, wordIndex: index });
                            }
                        } else {
                            if (simpleAyahText) {
                                onUthmaniWordClick(e, resultIndex, simpleAyahText);
                            }
                        }
                    }}
                    className="word-trigger bg-transparent border-none p-0 font-inherit cursor-pointer hover:bg-primary/10 rounded-md px-1 transition-colors"
                    aria-label={`إظهار خيارات البحث لكلمة: ${word}`}
                >
                    {isMatch ? (
                        <mark className={`bg-yellow-400/40 text-text-primary rounded-sm ${isPulsing ? 'animate-highlight-pulse' : ''}`}>{word}</mark>
                    ) : (
                        <span className={isPulsing ? 'animate-highlight-pulse rounded-sm' : ''}>{word}</span>
                    )}
                </button>
            );
        });

        return wordElements.reduce((prev, curr, index) => <>{prev}{index > 0 ? ' ' : ''}{curr}</>, <></>);
    };
    
    return (
        <li
            ref={itemRef}
            className={`p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg ${isCurrentlyPlaying ? 'bg-yellow-300/60 dark:bg-yellow-400/30 ring-2 ring-yellow-500' : 'bg-surface-subtle'}`}
        >
            <div className="flex justify-between items-center mb-2 gap-4">
                 <a
                    href={`#/surah/${displayAyah.surah?.number}?ayah=${displayAyah.numberInSurah}`}
                    className="text-primary-text font-bold cursor-pointer rounded-md p-1 -m-1 hover:bg-surface-hover transition-colors"
                    aria-label={`الانتقال إلى ${displayAyah.surah?.name} الآية ${displayAyah.numberInSurah}`}
                >
                    <span className="font-quran-title">{displayAyah.surah?.name} - الآية {displayAyah.numberInSurah}</span>
                </a>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={(e) => onOpenPopover(displayAyah, e.currentTarget)}
                        className="p-2 -m-2 rounded-full text-text-subtle hover:text-primary hover:bg-surface-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                        aria-label="إجراءات الآية"
                        title="إجراءات الآية"
                    >
                        <SparklesIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <p
                dir="rtl"
                aria-label={`نص الآية ${displayAyah.numberInSurah} من سورة ${displayAyah.surah?.name}`}
                className={`${quranTextClass} text-text-primary text-right`}
            >
               {renderAyahWithHighlight()}
            </p>
        </li>
    );
};

export default SearchResultItem;