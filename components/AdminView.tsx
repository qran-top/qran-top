import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SpinnerIcon, ShieldCheckIcon, HomeIcon } from './icons';
import CommentsAdmin from './admin/CommentsAdmin';
import KhatmahsAdmin from './admin/KhatmahsAdmin';
import FontsAdmin from './admin/FontsAdmin';
import SourcesAdmin from './admin/SourcesAdmin';
import { ADMIN_UIDS } from '../data/config';

const AdminView: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [mainTab, setMainTab] = useState<'comments' | 'fonts' | 'sources' | 'khatmahs'>('comments');

    useEffect(() => {
        if (!authLoading) {
            setIsAuthenticated(!!user && ADMIN_UIDS.includes(user.uid));
        }
    }, [user, authLoading]);
    
    if (authLoading) {
        return <div className="flex justify-center p-16"><SpinnerIcon className="w-12 h-12" /></div>;
    }

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] bg-background">
                <div className="p-8 bg-surface rounded-lg shadow-md w-full max-w-sm text-center">
                    <h1 className="text-2xl font-bold text-text-primary mb-4">وصول مقيد</h1>
                    <p className="text-text-secondary">هذه الصفحة متاحة للمشرفين فقط.</p>
                </div>
            </div>
        );
    }
    
    const renderMainContent = () => {
        switch (mainTab) {
            case 'khatmahs':
                return <KhatmahsAdmin />;
            case 'fonts':
                return <FontsAdmin />;
            case 'sources':
                return <SourcesAdmin />;
            case 'comments':
            default:
                return <CommentsAdmin />;
        }
    };
    
    return (
        <div className="animate-fade-in w-full max-w-7xl mx-auto px-4 py-8 mb-20">
            <header className="flex items-center justify-between border-b pb-4 mb-6 border-border-default">
                <div className="flex items-center gap-3">
                    <ShieldCheckIcon className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold text-primary-text-strong">لوحة التحكم الكاملة</h1>
                </div>
                <a href="#/" onClick={(e) => {e.preventDefault(); window.location.hash = '#/';}} className="p-3 bg-surface-subtle text-text-secondary rounded-full hover:bg-surface-hover transition-colors">
                    <HomeIcon className="w-6 h-6" />
                </a>
            </header>

            <div className="flex border-b border-border-default mb-6 flex-wrap">
                <button onClick={() => setMainTab('comments')} className={`px-4 py-3 text-lg font-semibold transition-colors ${mainTab === 'comments' ? 'border-b-2 border-primary text-primary-text' : 'text-text-muted hover:text-text-primary'}`}>التعليقات</button>
                <button onClick={() => setMainTab('khatmahs')} className={`px-4 py-3 text-lg font-semibold transition-colors ${mainTab === 'khatmahs' ? 'border-b-2 border-primary text-primary-text' : 'text-text-muted hover:text-text-primary'}`}>الختميات</button>
                <button onClick={() => setMainTab('fonts')} className={`px-4 py-3 text-lg font-semibold transition-colors ${mainTab === 'fonts' ? 'border-b-2 border-primary text-primary-text' : 'text-text-muted hover:text-text-primary'}`}>الخطوط</button>
                <button onClick={() => setMainTab('sources')} className={`px-4 py-3 text-lg font-semibold transition-colors ${mainTab === 'sources' ? 'border-b-2 border-primary text-primary-text' : 'text-text-muted hover:text-text-primary'}`}>المصادر</button>
            </div>
            
            {renderMainContent()}
        </div>
    );
};

export default AdminView;