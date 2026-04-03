import React from 'react';

interface PhraseFilter {
    phrase: string;
    count: number;
}

interface PhraseFiltersProps {
    phraseFilters: PhraseFilter[];
    activePhraseFilter: string;
    setActivePhraseFilter: (phrase: string) => void;
    resultsCount: number;
}

const PhraseFilters: React.FC<PhraseFiltersProps> = ({ phraseFilters, activePhraseFilter, setActivePhraseFilter, resultsCount }) => {
    if (phraseFilters.length === 0) return null;

    return (
        <div className="mb-6 pb-4 border-b border-border-default">
            <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-sm font-medium text-text-muted flex-shrink-0">فلاتر التراكيب:</span>
                <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => setActivePhraseFilter('all')} className={`px-3 py-1 rounded-full text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 ${activePhraseFilter === 'all' ? 'bg-primary text-white font-semibold' : 'bg-surface-subtle text-text-secondary hover:bg-surface-hover hover:text-text-primary'}`}>
                        كل النتائج ({resultsCount})
                    </button>
                    {phraseFilters.map(({ phrase, count }) => (
                        <button key={phrase} onClick={() => setActivePhraseFilter(phrase)} className={`px-3 py-1 rounded-full text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 ${activePhraseFilter === phrase ? 'bg-primary text-white font-semibold' : 'bg-surface-subtle text-text-secondary hover:bg-surface-hover hover:text-text-primary'}`}>
                            {phrase} ({count})
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PhraseFilters;
