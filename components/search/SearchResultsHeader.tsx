import React, { useState } from 'react';
import type { Ayah } from '../../types';
import { SparklesIcon } from '../icons';

interface SearchResultsHeaderProps {
    searchType: 'text' | 'number';
    query: string;
    correctedQuery?: string;
    displayedResultsCount: number;
    resultsCount: number;
    isSingleWordSearch: boolean;
    generalOccurrences: number;
    exactOccurrences: number;
    exactMatch: boolean;
    setExactMatch: (value: boolean) => void;
    totalOccurrences: number;
    onJumpToOccurrence: (target: number) => void;
    cachedAnalysisExists: boolean;
    onNewSearch: (query: string) => void;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({
    searchType, query, correctedQuery, displayedResultsCount, resultsCount,
    isSingleWordSearch, generalOccurrences, exactOccurrences, exactMatch,
    setExactMatch, totalOccurrences, onJumpToOccurrence, 
    cachedAnalysisExists, onNewSearch
}) => {
    const [jumpToValue, setJumpToValue] = useState('');
    
    const handleJump = () => {
        const target = parseInt(jumpToValue, 10);
        if (isNaN(target) || target < 1 || target > totalOccurrences) {
            alert(`الرجاء إدخال رقم صحيح بين 1 و ${totalOccurrences}`);
            return;
        }
        onJumpToOccurrence(target);
    };

    const finalQueryForChecks = correctedQuery || query;
    const shouldShowAnalysisButton = finalQueryForChecks.trim().split(/\s+/).filter(Boolean).length === 1 && searchType === 'text';

    return (
        <div className="mb-4 p-4 bg-surface-subtle rounded-lg border border-border-default">
            {correctedQuery && (
                <div className="mb-4 p-4 bg-blue-500/10 border-l-4 border-blue-500 text-text-secondary rounded-r-lg">
                    <p>لم نجد نتائج لـ "{query}". نعرض لك نتائج لأقرب كلمة: <strong>{correctedQuery}</strong>.</p>
                    <button onClick={() => onNewSearch(query)} className="mt-2 text-sm font-bold hover:underline">
                        ابحث عن "{query}" بدلاً من ذلك
                    </button>
                </div>
            )}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-grow">
                    {searchType === 'text' ? (
                        <h3 className="text-lg font-semibold text-text-secondary">نتائج البحث عن الكلمات: <span className="font-bold text-primary-text-strong">{(correctedQuery || query).replace(/"/g, '')}</span></h3>
                    ) : (
                        <h3 className="text-lg font-semibold text-text-secondary">الآيات التي تحمل الرقم "<span className="font-bold text-primary-text-strong">{query}</span>"</h3>
                    )}
                    
                    {resultsCount > 0 && (
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-500/20 text-text-primary shadow-sm cursor-help" title="إجمالي عدد الآيات التي تحتوي على كلمة البحث.">{displayedResultsCount} آيات</span>
                            {searchType === 'text' && isSingleWordSearch && (
                              <>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-500/20 text-text-primary shadow-sm cursor-help" title="إجمالي عدد مرات ورود كلمة البحث في كل الآيات.">{generalOccurrences} تكراراً</span>
                                
                                <button
                                    onClick={() => {
                                        setExactMatch(!exactMatch);
                                    }}
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-subtle focus:ring-purple-500
                                    ${exactMatch 
                                        ? 'bg-purple-600 text-white' 
                                        : 'bg-purple-500/20 text-text-primary hover:bg-purple-500/40'}`}
                                    title="تفعيل/إلغاء تفعيل المطابقة التامة"
                                    aria-pressed={exactMatch}
                                >
                                    {exactOccurrences} مطابقة
                                </button>
                              </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {searchType === 'text' && totalOccurrences > 1 && (
                <div className="mt-3 pt-3 border-t border-border-default flex items-center gap-2 flex-wrap">
                    <label htmlFor="jump-input" className="text-sm font-semibold text-text-muted">الانتقال إلى التكرار:</label>
                    <input id="jump-input" type="number" value={jumpToValue} onChange={(e) => setJumpToValue(e.target.value)} min="1" max={totalOccurrences} className="w-24 p-1.5 border border-border-default rounded-md text-center bg-surface focus:outline-none focus:ring-2 focus:ring-primary" placeholder={`1 - ${totalOccurrences}`} />
                    <button onClick={handleJump} className="px-4 py-1.5 bg-primary text-white text-sm font-semibold rounded-md hover:bg-primary-hover transition-colors">اذهب</button>
                </div>
            )}
            {cachedAnalysisExists && shouldShowAnalysisButton && (
                <div className="mt-3 pt-3 border-t border-border-default">
                    <a href={`#/analysis/${encodeURIComponent(finalQueryForChecks)}`} onClick={(e) => { e.preventDefault(); window.location.hash = `#/analysis/${encodeURIComponent(finalQueryForChecks)}`; }} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors">
                        <SparklesIcon className="w-5 h-5" />
                        <span>عرض التحليل المحفوظ لهذه الكلمة</span>
                    </a>
                </div>
            )}
        </div>
    );
};

export default SearchResultsHeader;