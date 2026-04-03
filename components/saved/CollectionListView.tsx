import React from 'react';
import type { Collections, Collection } from '../../types';
import { BookmarkIcon, UploadIcon } from '../icons';
import { timeAgo } from '../../utils/date';

interface CollectionListViewProps {
    collections: Collections;
}

const CollectionListView: React.FC<CollectionListViewProps> = ({ collections }) => {
    const collectionList = Object.values(collections).sort((a: Collection, b: Collection) => b.createdAt - a.createdAt);
    
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.hash = e.currentTarget.getAttribute('href')!;
    };
    
    return (
        <div className="animate-fade-in w-full max-w-4xl mx-auto px-4">
            <div className="mb-8 p-6 bg-surface rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-text-secondary">نقل دفتر التدبر</h2>
                    <p className="text-text-muted mt-1">هل تريد نقل بياناتك المحفوظة إلى جهاز آخر أو استيرادها؟</p>
                </div>
                <a 
                    href="#/settings?tab=tadabbur"
                    onClick={handleLinkClick}
                    className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover transition-colors flex-shrink-0"
                >
                    <UploadIcon className="w-5 h-5" />
                    <span>الذهاب إلى بوابة الاستيراد والتصدير</span>
                </a>
            </div>
            
            <main>
                {collectionList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {collectionList.map((collection: Collection) => (
                            <a 
                                key={collection.id}
                                href={`#/saved/${collection.id}`}
                                onClick={handleLinkClick}
                                className="block p-5 bg-surface rounded-lg shadow-sm hover:shadow-xl hover:border-primary border-2 border-transparent transition-all duration-200 group"
                            >
                                <h2 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors truncate">{collection.name}</h2>
                                <p className="text-sm text-text-muted mt-1">{collection.items.length} عنصر</p>
                                <p className="text-xs text-text-subtle mt-3">{timeAgo(collection.createdAt)}</p>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-12 bg-surface rounded-lg shadow-md">
                        <BookmarkIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" />
                        <h2 className="mt-4 text-2xl font-bold text-text-primary">دفتر تدبرك فارغ</h2>
                        <p className="mt-2 text-text-muted">
                            يمكنك حفظ الآيات التي تؤثر فيك أو عمليات البحث التي تجريها للعودة إليها لاحقاً.
                            <br/>
                            ابحث عن أيقونة <BookmarkIcon className="w-4 h-4 inline-block text-primary" /> لحفظ العناصر.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CollectionListView;
