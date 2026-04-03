import React, { useState } from 'react';

interface JoinKhatmahModalProps {
    onClose: () => void; 
    onJoin: (id: string) => void;
}

const JoinKhatmahModal: React.FC<JoinKhatmahModalProps> = ({ onClose, onJoin }) => {
    const [id, setId] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onJoin(id);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-surface rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-border-default"><h2 className="text-xl font-bold">الانضمام إلى ختمة</h2></div>
                <div className="p-5">
                    <label htmlFor="khatmah-id" className="block text-sm font-medium mb-1">أدخل كود الختمة (6 رموز)</label>
                    <input id="khatmah-id" type="text" value={id} onChange={e => setId(e.target.value.toUpperCase())} required maxLength={6} className="w-full p-3 text-2xl font-mono tracking-widest text-center border rounded bg-surface border-border-default" />
                </div>
                <div className="p-4 bg-surface-subtle flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded">إلغاء</button>
                    <button type="submit" disabled={id.length !== 6} className="px-4 py-2 bg-primary text-white font-semibold rounded disabled:opacity-50">انضمام</button>
                </div>
            </form>
        </div>
    );
};

export default JoinKhatmahModal;
