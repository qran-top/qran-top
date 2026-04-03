import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../firebase';
import { SpinnerIcon, TrashIcon } from '../icons';

interface JuzStatus {
    status: 'available' | 'reserved' | 'completed';
}
interface Khatmah {
    id: string;
    name: string;
    visibility: 'public' | 'private';
    createdAt: any;
    juz_status: { [key: number]: JuzStatus };
}

const KhatmahsAdmin: React.FC = () => {
    const [khatmahs, setKhatmahs] = useState<Khatmah[]>([]);
    const [loadingKhatmahs, setLoadingKhatmahs] = useState(true);

    const fetchKhatmahs = useCallback(async () => {
        setLoadingKhatmahs(true);
        try {
            const query = db.collection('khatmahs').orderBy('createdAt', 'desc');
            const snapshot = await query.get();
            const items = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Khatmah));
            setKhatmahs(items);
        } catch (err) {
            console.error(`Error fetching khatmahs:`, err);
        } finally {
            setLoadingKhatmahs(false);
        }
    }, []);
    
    useEffect(() => {
        fetchKhatmahs();
    }, [fetchKhatmahs]);

    const handleDelete = async (id: string) => {
        if (!window.confirm(`هل أنت متأكد من حذف هذه الختمة نهائياً؟`)) return;
        try {
            await db.collection('khatmahs').doc(id).delete();
            fetchKhatmahs();
        } catch (error) {
            console.error(`Error deleting khatmah:`, error);
        }
    };

    const calculateKhatmahProgress = (khatmah: Khatmah) => {
        const completedCount = Object.values(khatmah.juz_status).filter(s => s.status === 'completed').length;
        return Math.round((completedCount / 30) * 100);
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">إدارة الختمات الجماعية</h2>
            <div className="overflow-x-auto bg-surface rounded-lg shadow">
                <table className="min-w-full divide-y divide-border-default">
                    <thead className="bg-surface-subtle">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase">الاسم</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase">الكود</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase">النوع</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase">التقدم</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase">تاريخ الإنشاء</th>
                            <th className="relative px-6 py-3"><span className="sr-only">حذف</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loadingKhatmahs ? (
                            <tr><td colSpan={6} className="text-center p-8"><SpinnerIcon className="w-8 h-8 mx-auto" /></td></tr>
                        ) : (
                            khatmahs.map(khatmah => (
                                <tr key={khatmah.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary font-semibold">{khatmah.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-subtle font-mono">{khatmah.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${khatmah.visibility === 'public' ? 'bg-blue-100 text-blue-800' : 'bg-surface-subtle text-text-secondary'}`}>
                                            {khatmah.visibility === 'public' ? 'عامة' : 'خاصة'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{calculateKhatmahProgress(khatmah)}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{khatmah.createdAt?.toDate().toLocaleDateString('ar-EG')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <button onClick={() => handleDelete(khatmah.id!)} className="text-red-600 hover:text-red-900"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default KhatmahsAdmin;
