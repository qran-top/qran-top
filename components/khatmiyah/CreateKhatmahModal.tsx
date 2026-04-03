import React, { useState } from 'react';
import { SpinnerIcon, PlusIcon } from '../icons';

interface CreateKhatmahModalProps {
    onClose: () => void; 
    onCreate: (name: string, visibility: 'public' | 'private') => Promise<string>;
}

const CreateKhatmahModal: React.FC<CreateKhatmahModalProps> = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [visibility, setVisibility] = useState<'public' | 'private'>('public');
    const [isCreating, setIsCreating] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setIsCreating(true);
        try {
            const newId = await onCreate(name, visibility);
            window.location.hash = `#/khatmiyah/${newId}`;
            onClose();
        } catch (err) {
            // Error is handled in the hook
        } finally {
            setIsCreating(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-surface rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-border-default">
                    <h2 className="text-xl font-bold">إنشاء ختمة جديدة</h2>
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <label htmlFor="khatmah-name" className="block text-sm font-medium mb-1">اسم الختمة</label>
                        <input id="khatmah-name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="مثال: ختمة شهر رمضان" className="w-full p-2 border rounded bg-surface border-border-default" />
                    </div>
                    <div>
                         <label className="block text-sm font-medium mb-1">من يمكنه رؤيتها؟</label>
                         <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="visibility" value="public" checked={visibility === 'public'} onChange={() => setVisibility('public')} className="w-4 h-4 text-primary"/> عامة (تظهر للجميع)</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="visibility" value="private" checked={visibility === 'private'} onChange={() => setVisibility('private')} className="w-4 h-4 text-primary"/> خاصة (فقط لمن يملك الكود)</label>
                         </div>
                    </div>
                </div>
                <div className="p-4 bg-surface-subtle flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded">إلغاء</button>
                    <button type="submit" disabled={isCreating || !name.trim()} className="px-4 py-2 bg-primary text-white font-semibold rounded disabled:opacity-50 flex items-center gap-2">
                        {isCreating ? <SpinnerIcon className="w-5 h-5"/> : <PlusIcon className="w-5 h-5"/>}
                        {isCreating ? "جاري الإنشاء..." : "إنشاء"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateKhatmahModal;
