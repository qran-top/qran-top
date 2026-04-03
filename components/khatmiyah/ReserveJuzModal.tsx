import React, { useState } from 'react';
import { SpinnerIcon, CheckIcon } from '../icons';

interface ReserveJuzModalProps {
    onClose: () => void; 
    onReserve: (name: string) => Promise<void>; 
    juzNumber: number;
}

const ReserveJuzModal: React.FC<ReserveJuzModalProps> = ({ onClose, onReserve, juzNumber }) => {
    const [name, setName] = useState('');
    const [isReserving, setIsReserving] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setIsReserving(true);
        try {
            await onReserve(name);
            onClose();
        } catch (err) {
            // Error handled by parent hook, no need to close modal
        } finally {
            setIsReserving(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-surface rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-border-default"><h2 className="text-xl font-bold">حجز الجزء {juzNumber}</h2></div>
                <div className="p-5">
                    <label htmlFor="reserver-name" className="block text-sm font-medium mb-1">الاسم (سيظهر للجميع)</label>
                    <input id="reserver-name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="اكتب اسمك هنا" className="w-full p-2 border rounded bg-surface border-border-default" />
                </div>
                <div className="p-4 bg-surface-subtle flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded">إلغاء</button>
                    <button type="submit" disabled={isReserving || !name.trim()} className="px-4 py-2 bg-primary text-white font-semibold rounded disabled:opacity-50 flex items-center gap-2">
                        {isReserving ? <SpinnerIcon className="w-5 h-5"/> : <CheckIcon className="w-5 h-5"/>}
                        {isReserving ? "جاري الحجز..." : "تأكيد الحجز"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReserveJuzModal;
