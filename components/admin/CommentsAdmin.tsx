import React, { useState, useEffect, useMemo } from 'react';
import { db, FieldValue } from '../../firebase';
import type { Comment } from '../../types';
import { SpinnerIcon, TrashIcon, ShieldCheckIcon } from '../icons';

interface Topic {
    id: string;
    topic: string;
    count: number;
}

const createAdminAction = async (actionType: 'delete_comment' | 'delete_report', targetId: string) => {
    const actionDoc = {
        topicId: '__ADMIN_ACTIONS__',
        text: `__${actionType.toUpperCase()}__::${targetId}`,
        createdAt: FieldValue.serverTimestamp(),
        parentId: null,
        type: 'comment',
    };
    await db.collection('qran_comments').add(actionDoc);
};

const CommentsAdmin: React.FC = () => {
    const [commentsTab, setCommentsTab] = useState<'reported' | 'topics'>('reported');
    const [allCommentDocs, setAllCommentDocs] = useState<Comment[]>([]);
    const [loadingCommentsData, setLoadingCommentsData] = useState(true);
    const [allTopics, setAllTopics] = useState<Topic[]>([]);
    const [loadingTopics, setLoadingTopics] = useState(false);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

    useEffect(() => {
        setLoadingCommentsData(true);
        const unsubscribe = db.collection('qran_comments').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
            const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
            setAllCommentDocs(fetched);
            setLoadingCommentsData(false);
        }, err => { 
            setLoadingCommentsData(false); 
            console.error("Error fetching comments data.", err);
        });
        return () => unsubscribe();
    }, []);
    
    useEffect(() => {
        if (commentsTab !== 'topics') return;
        setLoadingTopics(true);
        const unsubscribe = db.collection('discussionTopics').orderBy('count', 'desc').onSnapshot(snapshot => {
            const fetched = snapshot.docs.map(doc => ({ id: doc.id, topic: doc.data().topic, count: doc.data().count } as Topic));
            setAllTopics(fetched);
            setLoadingTopics(false);
        }, err => { setLoadingTopics(false); });
        return () => unsubscribe();
    }, [commentsTab]);

    const { visibleReports, commentsByTopic } = useMemo(() => {
        const adminActions = allCommentDocs.filter(d => d.topicId === '__ADMIN_ACTIONS__');
        const deletionTargets = new Set<string>();
        
        adminActions.forEach(action => {
            const parts = (action.text || '').split('::');
            if (parts.length === 2 && (parts[0] === '__DELETE_COMMENT__' || parts[0] === '__DELETE_REPORT__')) {
                deletionTargets.add(parts[1]);
            }
        });

        const allReports = allCommentDocs.filter(d => d.type === 'report');
        const visibleReports = allReports.filter(report => 
            !deletionTargets.has(report.id) && 
            report.targetId && 
            !deletionTargets.has(report.targetId)
        );

        const allRegularComments = allCommentDocs.filter(d => !d.type && d.topicId !== '__ADMIN_ACTIONS__');
        const commentsByTopic = new Map<string, Comment[]>();
        allRegularComments.forEach(comment => {
            if (!deletionTargets.has(comment.id)) {
                if (!commentsByTopic.has(comment.topicId)) {
                    commentsByTopic.set(comment.topicId, []);
                }
                commentsByTopic.get(comment.topicId)!.push(comment);
            }
        });

        return { visibleReports, commentsByTopic };
    }, [allCommentDocs]);
    
    const handleCommentAction = async (action: 'approve' | 'delete', item: Comment) => {
        try {
            if (action === 'approve') {
                if (item.type !== 'report') return;
                if (!window.confirm("سيؤدي هذا إلى إخفاء البلاغ فقط، وسيبقى التعليق الأصلي. هل أنت متأكد؟")) return;
                await createAdminAction('delete_report', item.id);
                alert("تم إخفاء البلاغ بنجاح.");
    
            } else if (action === 'delete') {
                const isReport = item.type === 'report';
                const commentIdToDelete = isReport ? item.targetId : item.id;
                
                if (!commentIdToDelete) {
                    alert("خطأ: لم يتم العثور على معرّف التعليق المراد حذفه.");
                    return;
                }
                
                if (!window.confirm('هل أنت متأكد؟ سيتم إخفاء التعليق (وكل ردوده) من العرض العام.')) return;
                
                await createAdminAction('delete_comment', commentIdToDelete);

                if (isReport) {
                    await createAdminAction('delete_report', item.id);
                }
                
                alert("تم إخفاء التعليق بنجاح.");
            }
        } catch (error) { 
            console.error(`Error performing action:`, error);
            alert(`فشل الإجراء: ${(error as Error).message}`);
        }
    };

    const renderCommentsTable = (items: Comment[], isReportView: boolean) => (
        <div className="overflow-x-auto bg-surface rounded-lg shadow">
            <table className="min-w-full divide-y divide-border-default">
                <thead className="bg-surface-subtle">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">
                            {isReportView ? 'التعليق المبلغ عنه' : 'التعليق'}
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">
                            {isReportView ? 'الموضوع' : 'الردود'}
                        </th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">الإجراءات</span></th>
                    </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-border-default">
                    {items.map(item => (
                        <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-pre-wrap max-w-lg">
                                <div className="text-sm text-text-primary">{item.text}</div>
                                {item.author && <div className="text-xs text-text-muted mt-1">{item.author.displayName}</div>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {isReportView ? (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{item.topicId}</span>
                                ) : (
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-surface-subtle text-text-secondary`}>{item.replyCount || 0}</span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                {isReportView && (
                                     <button onClick={() => handleCommentAction('approve', item)} className="text-green-600 hover:text-green-900" title="موافقة (إخفاء البلاغ)"><ShieldCheckIcon className="w-5 h-5"/></button>
                                )}
                                <button onClick={() => handleCommentAction('delete', item)} className="text-red-600 hover:text-red-900" title="حذف التعليق (والبلاغ إن وجد)"><TrashIcon className="w-5 h-5"/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const topicComments = commentsByTopic.get(selectedTopicId || '') || [];
    
    return (
        <div className="animate-fade-in">
            <div className="flex border-b border-border-default mb-6">
                <button onClick={() => setCommentsTab('reported')} className={`px-4 py-2 text-md font-semibold transition-colors ${commentsTab === 'reported' ? 'border-b-2 border-primary text-primary-text' : 'text-text-muted hover:text-text-primary'}`}>التعليقات المبلغ عنها ({visibleReports.length})</button>
                <button onClick={() => setCommentsTab('topics')} className={`px-4 py-2 text-md font-semibold transition-colors ${commentsTab === 'topics' ? 'border-b-2 border-primary text-primary-text' : 'text-text-muted hover:text-text-primary'}`}>كل المواضيع</button>
            </div>

            {commentsTab === 'reported' && (
                loadingCommentsData ? <div className="flex justify-center p-16"><SpinnerIcon className="w-12 h-12" /></div> : renderCommentsTable(visibleReports, true)
            )}

            {commentsTab === 'topics' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <h2 className="text-xl font-semibold mb-4">المواضيع</h2>
                        {loadingTopics ? <SpinnerIcon className="w-8 h-8"/> : (
                            <ul className="space-y-1 h-[60vh] overflow-y-auto pr-2">
                                {allTopics.map(topic => (
                                    <li key={topic.id}>
                                        <button onClick={() => setSelectedTopicId(topic.id)} className={`w-full text-right p-2 rounded-md transition-colors flex justify-between ${selectedTopicId === topic.id ? 'bg-surface-active' : 'hover:bg-surface-hover'}`}>
                                            <span>{topic.topic}</span><span className="font-mono text-xs bg-surface-subtle px-2 py-1 rounded-full">{topic.count}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4">تعليقات الموضوع: <span className="text-primary-text font-mono">{selectedTopicId || "لم يتم اختيار موضوع"}</span></h2>
                        {loadingCommentsData ? <div className="flex justify-center p-16"><SpinnerIcon className="w-12 h-12" /></div> : topicComments.length > 0 ? renderCommentsTable(topicComments, false) : <p className="text-text-muted mt-8 text-center">اختر موضوعاً من القائمة لعرض تعليقاته.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentsAdmin;
