import { useState, useEffect, useMemo, useCallback } from 'react';
import { db, FieldValue } from '../firebase';
import { generateKhatmahId, checkActionLimit, incrementActionCount } from '../utils/khatmiyah';

// --- Types ---
export interface JuzStatus {
    status: 'available' | 'reserved' | 'completed';
    by?: string;
    reservedAt?: any; // Firestore Timestamp
    completedAt?: any; // Firestore Timestamp
}

export interface Khatmah {
    id: string;
    name: string;
    createdAt: any; // Firestore Timestamp
    juz_status: { [key: number]: JuzStatus };
    visibility: 'public' | 'private';
}

export interface KhatmahHistoryItem {
    id: string;
    name: string;
}

const KHATMIYAH_HISTORY_KEY = 'qran_khatmiyah_history';

export const useKhatmiyah = (khatmiyahId: string | null) => {
    const [khatmah, setKhatmah] = useState<Khatmah | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingJuz, setUpdatingJuz] = useState<number | null>(null);
    
    const [publicKhatmahs, setPublicKhatmahs] = useState<Khatmah[]>([]);
    const [loadingPublic, setLoadingPublic] = useState(true);

    const [history, setHistory] = useState<KhatmahHistoryItem[]>(() => {
        try {
            const stored = localStorage.getItem(KHATMIYAH_HISTORY_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const addKhatmahToHistory = useCallback((khatmahToAdd: KhatmahHistoryItem) => {
        setHistory(prev => {
            const existing = prev.find(h => h.id === khatmahToAdd.id);
            const filtered = prev.filter(h => h.id !== khatmahToAdd.id);
            const updatedHistory = [{... (existing || {}), ...khatmahToAdd}, ...filtered];
            
            if (updatedHistory.length > 20) {
                updatedHistory.pop();
            }

            localStorage.setItem(KHATMIYAH_HISTORY_KEY, JSON.stringify(updatedHistory));
            return updatedHistory;
        });
    }, []);

    const removeKhatmahFromHistory = useCallback((idToRemove: string) => {
        if (window.confirm("هل تريد إزالة هذه الختمة من قائمتك؟ لن يتم حذف الختمة نفسها.")) {
            setHistory(prev => {
                const newHistory = prev.filter(h => h.id !== idToRemove);
                localStorage.setItem(KHATMIYAH_HISTORY_KEY, JSON.stringify(newHistory));
                return newHistory;
            });
        }
    }, []);
    
    useEffect(() => {
        if (khatmiyahId) {
            setLoadingPublic(false);
            return;
        }

        setLoadingPublic(true);
        const unsubscribe = db.collection('khatmahs')
            .orderBy('createdAt', 'desc')
            .limit(30)
            .onSnapshot(snapshot => {
                const allRecent = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Khatmah));
                const publicOnly = allRecent.filter(k => k.visibility === 'public');
                setPublicKhatmahs(publicOnly);
                setLoadingPublic(false);
            }, err => {
                console.error("Error fetching public khatmahs:", err);
                setError("فشل في تحميل الختمات العامة.");
                setLoadingPublic(false);
            });

        return () => unsubscribe();
    }, [khatmiyahId]);

    useEffect(() => {
        if (!khatmiyahId) {
            setLoading(false);
            setError(null);
            setKhatmah(null);
            return;
        }

        setLoading(true);
        const unsubscribe = db.collection('khatmahs').doc(khatmiyahId)
            .onSnapshot(doc => {
                if (doc.exists) {
                    const data = doc.data() as Omit<Khatmah, 'id'>;
                    const loadedKhatmah = { id: doc.id, ...data };
                    setKhatmah(loadedKhatmah);
                    addKhatmahToHistory({ id: loadedKhatmah.id, name: loadedKhatmah.name });
                    setError(null);
                } else {
                    setError(`الختمة بالمعرف "${khatmiyahId}" غير موجودة. تأكد من صحة الرابط أو الكود.`);
                    setKhatmah(null);
                }
                setLoading(false);
            }, err => {
                console.error("Error fetching Khatmah:", err);
                setError("حدث خطأ أثناء تحميل بيانات الختمة.");
                setLoading(false);
            });

        return () => unsubscribe();
    }, [khatmiyahId, addKhatmahToHistory]);

    const handleCreateKhatmah = async (name: string, visibility: 'public' | 'private'): Promise<string> => {
        if (!checkActionLimit('creations')) {
            throw new Error("Creation limit reached.");
        }

        const initialJuzStatus: { [key: number]: JuzStatus } = {};
        for (let i = 1; i <= 30; i++) {
            initialJuzStatus[i] = { status: 'available' };
        }
        
        let newId = '';
        let docExists = true;
        let attempts = 0;

        while(docExists && attempts < 10) {
            newId = generateKhatmahId();
            const docRef = db.collection('khatmahs').doc(newId);
            const docSnap = await docRef.get();
            docExists = docSnap.exists;
            attempts++;
        }

        if (docExists) {
            alert("فشل في إنشاء معرف فريد للختمة، يرجى المحاولة مرة أخرى.");
            throw new Error("Could not generate a unique ID.");
        }

        try {
            await db.collection('khatmahs').doc(newId).set({
                name: name,
                visibility: visibility,
                createdAt: new Date(),
                juz_status: initialJuzStatus
            });
            
            incrementActionCount('creations');
            addKhatmahToHistory({id: newId, name});
            return newId;
        } catch (err) {
            console.error("Error creating Khatmah:", err);
            alert("فشل إنشاء الختمة. يرجى المحاولة مرة أخرى.");
            throw err;
        }
    };
    
    const handleReserveJuz = async (juzNumber: number, name: string) => {
        if (!khatmiyahId || !name.trim()) return;

        if (!checkActionLimit('reservations')) {
            throw new Error("Reservation limit reached.");
        }
        
        setUpdatingJuz(juzNumber);
        const docRef = db.collection('khatmahs').doc(khatmiyahId);

        try {
            await db.runTransaction(async (transaction: any) => {
                const doc = await transaction.get(docRef);
                if (!doc.exists) throw new Error("Document does not exist!");
                
                const currentJuzStatus = doc.data().juz_status[juzNumber];
                if (currentJuzStatus.status !== 'available') {
                    throw new Error("This Juz has already been reserved.");
                }

                transaction.update(docRef, { 
                    [`juz_status.${juzNumber}`]: {
                        status: 'reserved',
                        by: name.trim(),
                        reservedAt: new Date()
                    }
                });
            });
            
            incrementActionCount('reservations');
        } catch (err) {
            console.error("Error reserving Juz:", err);
            if (!(err instanceof Error && err.message === "Reservation limit reached.")) {
                alert("فشل حجز الجزء. قد يكون شخص آخر قد حجزه قبلك.");
            }
            throw err;
        } finally {
            setUpdatingJuz(null);
        }
    };

    const handleCompleteJuz = async (juzNumber: number) => {
        if (!khatmiyahId) return;

        if (!checkActionLimit('completions')) {
            return;
        }

        setUpdatingJuz(juzNumber);
        const docRef = db.collection('khatmahs').doc(khatmiyahId);

        try {
            await db.runTransaction(async (transaction: any) => {
                const doc = await transaction.get(docRef);
                if (!doc.exists) throw new Error("Document does not exist!");

                const currentJuzStatus = doc.data().juz_status[juzNumber];
                if (currentJuzStatus.status !== 'reserved') {
                    throw new Error("This Juz is not currently reserved.");
                }
                
                transaction.update(docRef, {
                    [`juz_status.${juzNumber}`]: {
                        ...currentJuzStatus,
                        status: 'completed',
                        completedAt: new Date(),
                    }
                });
            });
            incrementActionCount('completions');
        } catch (err) {
            console.error("Error completing Juz:", err);
            if (!(err instanceof Error && err.message === "Completion limit reached.")) {
                alert("فشل تحديث حالة الجزء. قد يكون هناك مشكلة في الاتصال.");
            }
        } finally {
            setUpdatingJuz(null);
        }
    };

    const progress = useMemo(() => {
        if (!khatmah) return 0;
        const completedCount = Object.values(khatmah.juz_status).filter(s => (s as JuzStatus).status === 'completed').length;
        return Math.round((completedCount / 30) * 100);
    }, [khatmah]);

    return {
        khatmah,
        loading,
        error,
        updatingJuz,
        publicKhatmahs,
        loadingPublic,
        history,
        progress,
        handleCreateKhatmah,
        handleReserveJuz,
        handleCompleteJuz,
        removeKhatmahFromHistory,
    };
};
