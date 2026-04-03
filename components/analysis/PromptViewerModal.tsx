import React from 'react';
import { ClearIcon, QueueListIcon } from '../icons';

const PromptViewerModal: React.FC<{ prompt: string; onClose: () => void }> = ({ prompt, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4" onClick={onClose}>
        <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl mx-auto flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-border-default flex justify-between items-center">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                    <QueueListIcon className="w-6 h-6 text-primary"/>
                    التعليمات المستخدمة (Prompt)
                </h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-hover"><ClearIcon className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-text-secondary bg-surface-subtle p-4 rounded-md font-sans text-sm">
                    {prompt}
                </pre>
            </div>
        </div>
    </div>
);

export default PromptViewerModal;
