import React, { useState } from 'react';
import { ClearIcon } from '../icons';

interface JuzSelectionModalProps {
    onClose: () => void;
    juzStartAyahs: { juz: number, ayahNumber: number }[];
    onJuzSelect: (ayahNumber: number) => void;
    onSelectionConfirm: (selectedJuzs: number[]) => void;
    mode: 'jump' | 'selection';
}

const JuzSelectionModal: React.FC<JuzSelectionModalProps> = ({ onClose, juzStartAyahs, onJuzSelect, onSelectionConfirm, mode }) => {
    const [selectedJuzs, setSelectedJuzs] = useState<number[]>([]);

    const handleJuzClick = (juz: number, ayahNumber: number) => {
        if (mode === 'jump') {
            onJuzSelect(ayahNumber);
            onClose();
        } else { // selection mode
            setSelectedJuzs(prev => 
                prev.includes(juz) ? prev.filter(j => j !== juz) : [...prev, juz]
            );
        }
    };
    
    const handleConfirm = () => {
        if (selectedJuzs.length > 0) {
            onSelectionConfirm(selectedJuzs.sort((a,b) => a-b));
            onClose();
        }
    };

    const title = mode === 'jump' ? "الانتقال إلى جزء" : "اختر الأجزاء";
    
    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4"
            onClick={onClose}
        >
            <div 
                className="bg-surface rounded-lg shadow-xl w-full max-w-lg mx-auto flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-border-default flex justify-between items-center">
                    <h2 className="text-xl font-bold text-text-primary">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-hover">
                        <ClearIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto">
                    <div className="grid grid-cols-6 gap-2">
                        {juzStartAyahs.map(({ juz, ayahNumber }) => {
                            const isSelected = mode === 'selection' && selectedJuzs.includes(juz);
                            return (
                                <button
                                    key={juz}
                                    onClick={() => handleJuzClick(juz, ayahNumber)}
                                    className={`p-3 rounded-lg text-center font-mono font-bold text-lg text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary
                                        bg-surface-subtle hover:bg-surface-hover
                                        ${isSelected ? 'ring-2 ring-primary bg-surface-active' : ''}
                                    `}
                                >
                                    {juz}
                                </button>
                            );
                        })}
                    </div>
                </div>
                {mode === 'selection' && (
                    <div className="p-4 border-t border-border-default">
                        <button 
                            onClick={handleConfirm}
                            disabled={selectedJuzs.length === 0}
                            className="w-full px-4 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover disabled:bg-primary/50 transition-colors"
                        >
                            بدء القراءة ({selectedJuzs.length})
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JuzSelectionModal;
