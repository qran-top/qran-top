import React, { useState, useCallback, useEffect } from 'react';
import { ChatBubbleIcon, ChartBarIcon } from './icons';
import { useAuth } from '../hooks/useAuth';
import { db, FieldValue } from '../firebase';
import CommentForm from './comments/CommentForm';
import CommentsList from './comments/CommentsList';
import type { Comment } from '../types';

interface DiscussionSectionProps {
  topicId: string;
  wordForTopic?: string;
  buttonText?: string;
  autoOpen?: boolean;
  showAnalysisButton?: boolean;
  onAnalysisClick?: () => void;
}

const DiscussionSection: React.FC<DiscussionSectionProps> = ({ topicId, wordForTopic, buttonText, autoOpen = false, showAnalysisButton, onAnalysisClick }) => {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const { user } = useAuth();

  useEffect(() => {
      setIsOpen(autoOpen);
  }, [autoOpen, topicId]);


  const handleToggleDiscussion = useCallback(() => {
    if (!isOpen) {
        // Increment count only when opening the discussion
        const topicRef = db.collection("discussionTopics").doc(topicId);
        db.runTransaction(async (transaction: any) => {
            const docSnap = await transaction.get(topicRef);
            if (docSnap.exists) {
                transaction.update(topicRef, {
                    viewCount: FieldValue.increment(1)
                });
            }
        }).catch(err => console.warn("Could not increment view count", err));
    }
    setIsOpen(prev => !prev);
  }, [isOpen, topicId]);

  const addComment = async (text: string, parentId: string | null = null) => {
    if (!text.trim()) return;

    try {
        const topicRef = db.collection("discussionTopics").doc(topicId);
        const commentsRef = db.collection('qran_comments');
        const newCommentRef = commentsRef.doc(); // Create a reference for the new comment

        await db.runTransaction(async (transaction: any) => {
            const topicSnap = await transaction.get(topicRef);

            // Prepare new comment data inside the transaction
            const newCommentData: any = {
                topicId: topicId,
                text: text.trim(),
                parentId: parentId,
                createdAt: FieldValue.serverTimestamp(),
            };
            if (user) {
                newCommentData.author = { uid: user.uid, displayName: user.displayName, photoURL: user.photoURL };
            }

            // 1. Set the new comment
            transaction.set(newCommentRef, newCommentData);

            // 2. Update topic count
            if (topicSnap.exists) {
                transaction.update(topicRef, {
                    count: FieldValue.increment(1),
                    lastDiscussed: FieldValue.serverTimestamp(),
                });
            } else {
                transaction.set(topicRef, {
                    topic: wordForTopic || topicId,
                    count: 1,
                    viewCount: 1, // Start with 1 view since it's just been interacted with
                    lastDiscussed: FieldValue.serverTimestamp()
                });
            }

            // 3. Update parent reply count
            if (parentId) {
                const parentRef = commentsRef.doc(parentId);
                transaction.update(parentRef, {
                    replyCount: FieldValue.increment(1)
                });
            }
        });

    } catch (error: any) {
        console.error("Error adding comment to Firestore:", error);
        alert(`فشل إرسال التعليق.\n\nالسبب: ${error.message}`);
        throw error;
    }
  };

  const displayWord = wordForTopic || topicId;

  return (
    <div className="mt-6 pt-6 border-t border-border-default">
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleToggleDiscussion}
          className="flex-1 flex items-center justify-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-blue-500"
          aria-expanded={isOpen}
        >
          <ChatBubbleIcon className="w-6 h-6" />
          <span className="text-lg font-semibold">
            {isOpen ? 'إغلاق النقاش' : (buttonText || `فتح النقاش حول: "${displayWord}"`)}
          </span>
        </button>

        {showAnalysisButton && (
          <button
            onClick={onAnalysisClick}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-green-500"
          >
            <ChartBarIcon className="w-6 h-6" />
            <span className="text-lg font-semibold">تحليل المفردة</span>
          </button>
        )}
      </div>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[3000px] mt-4' : 'max-h-0'}`}>
        <div className="p-4 bg-surface-subtle rounded-lg">
          {isOpen && (
             <div>
                <CommentForm onSubmit={(text) => addComment(text, null)} />
                <CommentsList topicId={topicId} addComment={addComment} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionSection;