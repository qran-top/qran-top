import React, { useState } from 'react';
import { useKhatmiyah, JuzStatus } from '../hooks/useKhatmiyah';
import { SpinnerIcon, UsersIcon, PlusIcon, TrashIcon } from './icons';
import CreateKhatmahModal from './khatmiyah/CreateKhatmahModal';
import JoinKhatmahModal from './khatmiyah/JoinKhatmahModal';
import ReserveJuzModal from './khatmiyah/ReserveJuzModal';

interface KhatmiyahViewProps {
    khatmiyahId: string | null;
}

const KhatmiyahView: React.FC<KhatmiyahViewProps> = ({ khatmiyahId }) => {
    const {
        khatmah, loading, error, updatingJuz, publicKhatmahs, loadingPublic,
        history, progress, handleCreateKhatmah, handleReserveJuz,
        handleCompleteJuz, removeKhatmahFromHistory
    } = useKhatmiyah(khatmiyahId);

    const [modal, setModal] = useState<'create' | 'join' | 'reserve' | null>(null);
    const [activeJuz, setActiveJuz] = useState<number | null>(null);

    const handleJoinKhatmah = (id: string) => {
        if (id.trim()) {
            window.location.hash = `#/khatmiyah/${id.trim()}`;
            setModal(null);
        }
    };

    const handleJuzClick = (juzNumber: number, status: JuzStatus) => {
        if (updatingJuz) return;
        if (status.status === 'available') {
            setActiveJuz(juzNumber);
            setModal('reserve');
        } else if (status.status === 'reserved') {
            if (window.confirm(`هل تريد تأكيد إتمام قراءة الجزء ${juzNumber}؟`)) {
                handleCompleteJuz(juzNumber);
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center p-16"><SpinnerIcon className="w-12 h-12 text-primary" /></div>;
    }

    if (error) {
        return (
            <div className="text-center p-10 bg-surface rounded-lg shadow-md max-w-lg mx-auto">
                <p className="text-red-500 font-semibold">{error}</p>
                <button onClick={() => window.location.hash = '#/khatmiyah'} className="mt-4 px-4 py-2 bg-primary text-white rounded-md">
                    العودة إلى الصفحة الرئيسية للختميات
                </button>
            </div>
        );
    }
    
    if (khatmah) {
        return (
            <div className="animate-fade-in w-full max-w-4xl mx-auto px-4">
                {modal === 'reserve' && activeJuz && (
                    <ReserveJuzModal
                        onClose={() => { setModal(null); setActiveJuz(null); }}
                        onReserve={(name) => handleReserveJuz(activeJuz, name)}
                        juzNumber={activeJuz}
                    />
                )}
                <header className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-primary-text-strong mb-2">{khatmah.name}</h1>
                    <div className="w-full bg-surface-subtle rounded-full h-4 border border-border-default">
                        <div
                            className="bg-green-500 h-4 rounded-full text-xs font-medium text-white text-center p-0.5 leading-none transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        >
                            {progress > 10 && `${progress}%`}
                        </div>
                    </div>
                     <p className="text-sm text-text-muted mt-2">
                        {progress < 100 ? `${30 - Object.values(khatmah.juz_status).filter(s => (s as JuzStatus).status === 'completed').length} جزء متبقي` : "اكتملت الختمة، تقبل الله منكم."}
                    </p>
                </header>
                
                <main>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {/* FIX: Cast status object to JuzStatus to resolve multiple type errors. */}
                        {Object.entries(khatmah.juz_status).map(([juzNumStr, statusObj]) => {
                            const status = statusObj as JuzStatus;
                            const juzNumber = parseInt(juzNumStr, 10);
                            let statusClass = '';
                            let statusText = 'متاح';
                            switch (status.status) {
                                case 'reserved':
                                    statusClass = 'bg-yellow-100 dark:bg-yellow-900/40 border-yellow-400 text-yellow-800 dark:text-yellow-200 cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-900/60';
                                    statusText = `محجوز (${status.by})`;
                                    break;
                                case 'completed':
                                    statusClass = 'bg-green-100 dark:bg-green-900/40 border-green-500 text-green-800 dark:text-green-300 cursor-default opacity-80';
                                    statusText = `مكتمل (${status.by})`;
                                    break;
                                default:
                                    statusClass = 'bg-surface-subtle border-border-default text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-primary';
                                    break;
                            }

                            return (
                                <button
                                    key={juzNumber}
                                    onClick={() => handleJuzClick(juzNumber, status)}
                                    disabled={status.status === 'completed' || !!updatingJuz}
                                    className={`p-4 rounded-lg border-2 text-center transition-colors relative ${statusClass}`}
                                >
                                    {updatingJuz === juzNumber && <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center rounded-lg"><SpinnerIcon className="w-6 h-6"/></div>}
                                    <span className="block text-2xl font-bold">{juzNumber}</span>
                                    <span className="block text-xs truncate">{statusText}</span>
                                </button>
                            );
                        })}
                    </div>
                </main>
            </div>
        );
    }
    
    return (
        <div className="animate-fade-in w-full max-w-4xl mx-auto px-4">
             {modal === 'create' && <CreateKhatmahModal onClose={() => setModal(null)} onCreate={handleCreateKhatmah} />}
             {modal === 'join' && <JoinKhatmahModal onClose={() => setModal(null)} onJoin={handleJoinKhatmah} />}
             
             <header className="text-center mb-8">
                <UsersIcon className="w-16 h-16 mx-auto text-primary mb-2"/>
                <h1 className="text-3xl font-bold text-primary-text-strong">الختمة الجماعية</h1>
                <p className="text-text-secondary mt-2">شارك في ختم القرآن الكريم مع الآخرين، أو أنشئ ختمة جديدة وادعُ أصدقاءك.</p>
            </header>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button onClick={() => setModal('create')} className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-all duration-200 shadow-md hover:shadow-lg">
                    <PlusIcon className="w-6 h-6"/>
                    <span>إنشاء ختمة جديدة</span>
                </button>
                 <button onClick={() => setModal('join')} className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-surface-subtle text-text-primary font-bold rounded-lg hover:bg-surface-hover transition-all duration-200 shadow-sm hover:shadow-md border border-border-default">
                    <span>الانضمام بـ "كود"</span>
                </button>
            </div>
            
            <div className="space-y-8">
                {history.length > 0 && (
                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-text-primary">ختماتك السابقة</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {history.map(item => (
                                <div key={item.id} className="group relative">
                                    <a href={`#/khatmiyah/${item.id}`} onClick={(e) => {e.preventDefault(); window.location.hash = `#/khatmiyah/${item.id}`;}} className="block w-full p-4 bg-surface rounded-lg shadow-sm border border-border-default hover:shadow-md hover:border-primary transition-all">
                                        <p className="font-bold text-text-primary group-hover:text-primary transition-colors truncate">{item.name}</p>
                                        <p className="text-xs text-text-muted font-mono">{item.id}</p>
                                    </a>
                                    <button onClick={() => removeKhatmahFromHistory(item.id)} className="absolute top-2 left-2 p-1.5 rounded-full bg-surface-hover text-text-muted opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-text-primary">الختمات العامة المتاحة</h2>
                    {loadingPublic ? <div className="flex justify-center p-8"><SpinnerIcon className="w-8 h-8"/></div> : (
                        publicKhatmahs.length > 0 ? (
                            <div className="space-y-3">
                                {publicKhatmahs.map(k => {
                                    const progress = Math.round(Object.values(k.juz_status).filter(s => (s as JuzStatus).status === 'completed').length / 30 * 100);
                                    return (
                                        <a key={k.id} href={`#/khatmiyah/${k.id}`} onClick={(e) => {e.preventDefault(); window.location.hash = `#/khatmiyah/${k.id}`;}} className="block p-4 bg-surface rounded-lg shadow-sm border border-border-default hover:shadow-md hover:border-primary transition-all">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-bold text-text-primary">{k.name}</h3>
                                                <span className="text-sm font-semibold text-green-600">{progress}%</span>
                                            </div>
                                            <div className="w-full bg-surface-subtle rounded-full h-2 mt-2">
                                                <div className="bg-green-500 h-2 rounded-full" style={{width: `${progress}%`}}></div>
                                            </div>
                                        </a>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-text-muted text-center p-6 bg-surface-subtle rounded-lg">لا توجد ختمات عامة متاحة حالياً. كن أول من ينشئ واحدة!</p>
                        )
                    )}
                </section>
            </div>
        </div>
    );
};

export default KhatmiyahView;