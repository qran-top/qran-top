import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../firebase';
import type { QuranFont } from '../../types';
import { SpinnerIcon, TrashIcon, PlusIcon } from '../icons';

const FontsAdmin: React.FC = () => {
    const [fonts, setFonts] = useState<QuranFont[]>([]);
    const [loadingFonts, setLoadingFonts] = useState(true);
    const [newFontName, setNewFontName] = useState('');
    const [newFontFamily, setNewFontFamily] = useState('');
    const [newFontUrl, setNewFontUrl] = useState('');
    
    const fetchFonts = useCallback(async () => {
        setLoadingFonts(true);
        try {
            const snapshot = await db.collection('qran_fonts').get();
            const items = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as QuranFont));
            setFonts(items);
        } catch (err) {
            console.error(`Error fetching fonts:`, err);
        } finally {
            setLoadingFonts(false);
        }
    }, []);

    useEffect(() => {
        fetchFonts();
    }, [fetchFonts]);

    const handleDelete = async (id: string) => {
        if (!window.confirm(`هل أنت متأكد من حذف هذا الخط نهائياً؟`)) return;
        try {
            await db.collection('qran_fonts').doc(id).delete();
            fetchFonts();
        } catch (error) {
            console.error(`Error deleting font:`, error);
        }
    };

    const handleAddFont = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFontName.trim() || !newFontFamily.trim()) return;
        try {
            await db.collection('qran_fonts').add({
                name: newFontName,
                font_family: newFontFamily,
                url: newFontUrl.trim() || null
            });
            setNewFontName('');
            setNewFontFamily('');
            setNewFontUrl('');
            fetchFonts();
        } catch (error) { console.error("Error adding font:", error); }
    };
    
    return (
        <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">إدارة الخطوط</h2>
            <div className="overflow-x-auto bg-surface rounded-lg shadow mb-8">
                <table className="min-w-full divide-y divide-border-default">
                    <thead className="bg-surface-subtle">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase">الاسم</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase">عائلة الخط</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase">URL</th>
                            <th className="relative px-6 py-3"><span className="sr-only">حذف</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loadingFonts ? (
                            <tr><td colSpan={4} className="text-center p-8"><SpinnerIcon className="w-8 h-8 mx-auto" /></td></tr>
                        ) : (
                            fonts.map(font => (
                                <tr key={font.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{font.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary font-mono">{font.font_family}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted max-w-xs truncate">{font.url}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <button onClick={() => handleDelete(font.id!)} className="text-red-600 hover:text-red-900"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <form onSubmit={handleAddFont} className="p-6 bg-surface-subtle rounded-lg shadow">
                 <h3 className="text-lg font-semibold mb-4">إضافة خط جديد</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="الاسم (مثال: أميري قرآن)" value={newFontName} onChange={e => setNewFontName(e.target.value)} required className="p-2 border rounded bg-surface border-border-default" />
                    <input type="text" placeholder="عائلة الخط (font-family)" value={newFontFamily} onChange={e => setNewFontFamily(e.target.value)} required className="p-2 border rounded bg-surface border-border-default" />
                    <input type="url" placeholder="رابط URL (اختياري)" value={newFontUrl} onChange={e => setNewFontUrl(e.target.value)} className="p-2 border rounded bg-surface border-border-default" />
                 </div>
                 <button type="submit" className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover flex items-center gap-2"><PlusIcon className="w-5 h-5"/> إضافة الخط</button>
            </form>
        </div>
    );
};

export default FontsAdmin;
