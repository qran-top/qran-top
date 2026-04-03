import React, { useState } from 'react';
import { ClearIcon } from '../icons';
import { QURAN_INDEX } from '../../quranIndex';
import { formatSurahNameForDisplay } from '../../utils/text';

interface SurahSelectionModalProps {
    onClose: () => void;
    onSelectionConfirm: (selectedSurahs: number[]) => void;
}

const SurahSelectionModal: React.FC<SurahSelectionModalProps> = ({ onClose, onSelectionConfirm }) => {
    const [selectedSurahs, setSelectedSurahs] = useState<number[]>([]);

    const handleSurahClick = (surahNumber: number) => {
        setSelectedSurahs(prev => 
            prev.includes(surahNumber) 
                ? prev.filter(s => s !== surahNumber) 
                : [...prev, surahNumber]
        );
    };
    
    const handleConfirm = () => {
        if (selectedSurahs.length > 0) {
            onSelectionConfirm(selectedSurahs);
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4"
            onClick={onClose}
        >
            <div 
                className="bg-surface rounded-lg shadow-xl w-full max-w-2xl mx-auto flex flex-col h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex-shrink-0 p-4 border-b border-border-default flex justify-between items-center">
                    <h2 className="text-xl font-bold text-text-primary">اختر السور</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-hover">
                        <ClearIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-grow p-4 overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {QURAN_INDEX.map(surah => {
                            const isSelected = selectedSurahs.includes(surah.number);
                            return (
                                <button
                                    key={surah.number}
                                    onClick={() => handleSurahClick(surah.number)}
                                    className={`p-3 rounded-lg text-center font-semibold text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary
                                        bg-surface-subtle hover:bg-surface-hover
                                        ${isSelected ? 'ring-2 ring-primary bg-surface-active text-primary-text-strong' : ''}
                                    `}
                                >
                                    {surah.number}. {formatSurahNameForDisplay(surah.name)}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="flex-shrink-0 p-4 border-t border-border-default">
                    <button 
                        onClick={handleConfirm}
                        disabled={selectedSurahs.length === 0}
                        className="w-full px-4 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover disabled:bg-primary/50 transition-colors"
                    >
                        بدء القراءة ({selectedSurahs.length} سور)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SurahSelectionModal;
