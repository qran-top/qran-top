import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../firebase';
import type { QuranEdition } from '../../types';
import { SpinnerIcon, TrashIcon, PlusIcon } from '../icons';

const SourcesAdmin: React.FC = () => {
    const [sources, setSources] = useState<QuranEdition[]>([]);
    const [loadingSources, setLoadingSources] = useState(true);
    const [newSource, setNewSource] = useState<Omit<QuranEdition, 'id'>>({
        identifier: '', name: '', englishName: '', language: 'ar',
        format: 'text', type: 'quran', direction: 'rtl', sourceApi: 'alquran.cloud'
    });

    const fetchSources = useCallback(async () => {
        setLoadingSources(true);
        try {
            const snapshot = await db.collection('qran_editions').get();
            const items = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as QuranEdition));
            setSources(items);
        } catch (err) {
            console.error(`Error fetching sources:`, err);
        } finally {
            setLoadingSources(false);
        }
    }, []);

    useEffect(() => {
        fetchSources();
    }, [fetchSources]);

    const handleDelete = async (id: string) => {
        if (!window.confirm(`هل أنت متأكد من حذف هذا المصدر نهائياً؟`)) return;
        try {
            await db.collection('qran_editions').doc(id).delete();
            fetchSources();
        } catch (error) {
            console.error(`Error deleting source:`, error);
        }
    };
    
    const handleAddSource = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSource.identifier.trim() || !newSource.name.trim()) return;
        try {
            await db.collection('qran_editions').add(newSource);
            setNewSource({
                identifier: '', name: '', englishName: '', language: 'ar',
                format: 'text', type: 'quran', direction: 'rtl', sourceApi: 'alquran.cloud'
            });
            fetchSources();
        } catch (error) { console.error("Error adding source:", error); }
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">إدارة المصادر (التفاسير والترجمات)</h2>
            <div className="overflow-x-auto bg-surface rounded-lg shadow mb-8">
                 <table className="min-w-full divide-y divide-border-default">
                    <thead className="bg-surface-subtle">
                        <tr>
                            <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase">المُعرف (Identifier)</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase">الاسم</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase">النوع</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase">اللغة</th>
                            <th className="relative px-4 py-3"><span className="sr-only">حذف</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loadingSources ? (
                            <tr><td colSpan={5} className="text-center p-8"><SpinnerIcon className="w-8 h-8 mx-auto" /></td></tr>
                        ) : (
                            sources.map(source => (
                                <tr key={source.id}>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary font-mono">{source.identifier}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">{source.name}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-muted">{source.type}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-muted">{source.language}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                                        <button onClick={() => handleDelete(source.id!)} className="text-red-600 hover:text-red-900"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                 </table>
            </div>
            <form onSubmit={handleAddSource} className="p-6 bg-surface-subtle rounded-lg shadow space-y-4">
                <h3 className="text-lg font-semibold">إضافة مصدر جديد</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input type="text" placeholder="المعرف (e.g., en.ahmedali)" value={newSource.identifier} onChange={e => setNewSource({...newSource, identifier: e.target.value})} required className="p-2 border rounded bg-surface border-border-default" />
                    <input type="text" placeholder="الاسم (e.g., تفسير الجلالين)" value={newSource.name} onChange={e => setNewSource({...newSource, name: e.target.value})} required className="p-2 border rounded bg-surface border-border-default" />
                    <input type="text" placeholder="الاسم بالإنجليزي (e.g., Jalalayn)" value={newSource.englishName} onChange={e => setNewSource({...newSource, englishName: e.target.value})} required className="p-2 border rounded bg-surface border-border-default" />
                    <select value={newSource.language} onChange={e => setNewSource({...newSource, language: e.target.value})} className="p-2 border rounded bg-surface border-border-default"><option value="ar">ar</option><option value="en">en</option><option value="fr">fr</option><option value="es">es</option></select>
                    <select value={newSource.type} onChange={e => setNewSource({...newSource, type: e.target.value})} className="p-2 border rounded bg-surface border-border-default"><option value="quran">quran</option><option value="tafsir">tafsir</option><option value="translation">translation</option></select>
                    <select value={newSource.direction} onChange={e => setNewSource({...newSource, direction: e.target.value})} className="p-2 border rounded bg-surface border-border-default"><option value="rtl">rtl</option><option value="ltr">ltr</option></select>
                    <select value={newSource.sourceApi} onChange={e => setNewSource({...newSource, sourceApi: e.target.value as any})} className="p-2 border rounded bg-surface border-border-default"><option value="alquran.cloud">alquran.cloud</option><option value="fawazahmed0">fawazahmed0</option></select>
                </div>
                <button type="submit" className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover flex items-center gap-2"><PlusIcon className="w-5 h-5"/> إضافة المصدر</button>
            </form>
        </div>
    );
};

export default SourcesAdmin;
