import React from 'react';
import type { Collection } from '../../types';
import { ArrowLeftIcon, TrashIcon } from '../icons';
import SavedItemCard from './SavedItemCard';

interface CollectionDetailViewProps {
    collection: Collection;
    onDeleteCollection: (collectionId: string) => void;
    onDeleteSavedItem: (collectionId: string, itemId: string) => void;
    onUpdateNotes: (collectionId: string, itemId: string, notes: string) => void;
}

const CollectionDetailView: React.FC<CollectionDetailViewProps> = ({ collection, onDeleteCollection, onDeleteSavedItem, onUpdateNotes }) => {
    
    const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.hash = e.currentTarget.getAttribute('href')!;
    };

    return (
        <div className="animate-fade-in w-full max-w-4xl mx-auto px-4">
             <div className="mb-4">
                <a href="#/saved" onClick={handleHomeClick} className="flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary">
                    <ArrowLeftIcon className="w-5 h-5" />
                    العودة إلى كل المجموعات
                </a>
             </div>
             <main className="bg-surface p-6 sm:p-8 rounded-lg shadow-md">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-primary-text-strong">{collection.name}</h1>
                        <p className="text-sm text-text-muted">{collection.items.length} عنصر</p>
                    </div>
                     <button onClick={() => onDeleteCollection(collection.id)} className="p-3 bg-red-100 dark:bg-red-900/40 text-red-600 rounded-full hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" title="حذف المجموعة">
                       <TrashIcon className="w-6 h-6" />
                    </button>
                 </div>
                 {collection.items.length > 0 ? (
                    <ul className="space-y-4">
                        {collection.items.map(item => (
                            <SavedItemCard 
                                key={item.id}
                                item={item} 
                                onDelete={() => onDeleteSavedItem(collection.id, item.id)}
                                onUpdateNotes={(notes) => onUpdateNotes(collection.id, item.id, notes)}
                            />
                        ))}
                    </ul>
                ) : (
                     <div className="text-center p-10 text-text-muted">
                        <h2 className="text-2xl font-bold mb-2">المجموعة فارغة</h2>
                        <p>لم تقم بإضافة أي آيات أو أبحاث لهذه المجموعة بعد.</p>
                     </div>
                )}
            </main>
        </div>
    );
};

export default CollectionDetailView;
