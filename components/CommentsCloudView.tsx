import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { SpinnerIcon, CloudIcon, ListBulletIcon } from './icons';

interface DiscussionTopic {
  id: string;
  topic: string; // This is the display word
  count: number;
}

interface AnalysisDoc {
  id: string; // This is the word
}

interface CloudWord {
    word: string;
    hasDiscussion: boolean;
    hasAnalysis: boolean;
    discussionCount: number;
}

// Function to shuffle an array for a more "cloud-like" random layout
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};


const CommentsCloudView: React.FC = () => {
  const [discussionTopics, setDiscussionTopics] = useState<DiscussionTopic[]>([]);
  const [analysisDocs, setAnalysisDocs] = useState<AnalysisDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cloud' | 'list'>('list');

  useEffect(() => {
    setLoading(true);
    const fetchAllData = async () => {
        try {
            const topicsPromise = db.collection('discussionTopics').where('count', '>', 0).orderBy('count', 'desc').limit(150).get();
            const analysesPromise = db.collection('qran_word_analysis_cache').limit(150).get();

            const [topicsSnapshot, analysesSnapshot] = await Promise.all([topicsPromise, analysesPromise]);
            
            const topicsData = topicsSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                  id: doc.id,
                  topic: data.topic, // The display word
                  count: data.count,
                } as DiscussionTopic
            });
            setDiscussionTopics(topicsData);

            const analysesData = analysesSnapshot.docs.map(doc => ({ id: doc.id } as AnalysisDoc));
            setAnalysisDocs(analysesData);

            setError(null);

        } catch (err: any) {
            console.error("Firebase fetch error:", err);
            if (err.code === 'failed-precondition') {
                setError('فشل تحميل البيانات. يتطلب هذا الإعداد "فهرس" خاص في قاعدة بيانات Firebase. يرجى التحقق من وحدة تحكم المتصفح (Developer Console)، حيث ستجد رسالة خطأ تحتوي على رابط مباشر لإنشاء هذا الفهرس تلقائياً.');
            } else {
                setError('فشل في تحميل البيانات. قد تكون هناك مشكلة في إعدادات Firebase أو اتصالك بالإنترنت.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    fetchAllData();
  }, []);

  const { shuffledWords, sortedWords, fontSizes } = useMemo(() => {
    if (loading || error) return { shuffledWords: [], sortedWords: [], fontSizes: {} };

    const mergedWords = new Map<string, CloudWord>();

    discussionTopics.forEach(topic => {
        const word = topic.topic;
        if (!mergedWords.has(word)) {
            mergedWords.set(word, { word, hasDiscussion: false, hasAnalysis: false, discussionCount: 0 });
        }
        const entry = mergedWords.get(word)!;
        entry.hasDiscussion = true;
        entry.discussionCount += topic.count;
    });

    analysisDocs.forEach(doc => {
        const word = doc.id;
        if (!mergedWords.has(word)) {
            mergedWords.set(word, { word, hasDiscussion: false, hasAnalysis: false, discussionCount: 0 });
        }
        const entry = mergedWords.get(word)!;
        entry.hasAnalysis = true;
    });

    const wordsArray = Array.from(mergedWords.values());
    const shuffledWords = shuffleArray(wordsArray);
    const sortedWords = [...wordsArray].sort((a, b) => a.word.localeCompare(b.word, 'ar'));

    if (shuffledWords.length === 0) return { shuffledWords, sortedWords, fontSizes: {} };
    
    const scores = shuffledWords.map(w => w.discussionCount + (w.hasAnalysis ? 5 : 0) + (w.hasDiscussion && w.hasAnalysis ? 10 : 0));
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const minLog = Math.log(minScore + 1);
    const maxLog = Math.log(maxScore + 1);

    const minFontSize = 16;
    const maxFontSize = 48;

    const sizes: { [key: string]: number } = {};
    shuffledWords.forEach(wordObj => {
        const score = wordObj.discussionCount + (wordObj.hasAnalysis ? 5 : 0) + (wordObj.hasDiscussion && wordObj.hasAnalysis ? 10 : 0);
        if (maxLog === minLog) {
            sizes[wordObj.word] = minFontSize;
        } else {
            const scale = (Math.log(score + 1) - minLog) / (maxLog - minLog);
            sizes[wordObj.word] = minFontSize + scale * (maxFontSize - minFontSize);
        }
    });

    return { shuffledWords, sortedWords, fontSizes: sizes };
  }, [discussionTopics, analysisDocs, loading, error]);

  const renderWord = (word: CloudWord) => {
    const hasBoth = word.hasDiscussion && word.hasAnalysis;
    const link = word.hasAnalysis ? `#/analysis/${encodeURIComponent(word.word)}` : `#/search/${encodeURIComponent(word.word)}?from=comments`;
    const colorClass = hasBoth 
        ? 'text-primary-text-strong font-bold' 
        : word.hasAnalysis 
            ? 'text-blue-600 dark:text-blue-400 font-semibold'
            : 'text-text-secondary font-medium';
    
    const style = viewMode === 'cloud' 
        ? { fontSize: `${fontSizes[word.word] || 16}px` }
        : {};

    const listClass = viewMode === 'list' ? 'text-lg' : '';
    
    return (
        <a
            key={word.word}
            href={link}
            className={`${colorClass} ${listClass} hover:opacity-70 transition-opacity duration-200`}
            style={style}
            title={`${word.word} (${word.discussionCount} نقاشات, ${word.hasAnalysis ? 'تحليل متوفر' : ''})`}
        >
            {word.word}
        </a>
    );
  };

  return (
    <div className="animate-fade-in w-full max-w-4xl mx-auto px-4">
      <main className="bg-surface p-6 sm:p-8 rounded-lg shadow-md transition-colors duration-300 min-h-[400px]">
        {loading && (
            <div className="flex justify-center items-center h-full p-10">
                <SpinnerIcon className="w-10 h-10 text-primary" />
            </div>
        )}
        {error && <div className="text-center p-10 text-red-500">{error}</div>}
        {!loading && !error && (
            <>
                <div className="flex justify-center items-center gap-2 mb-8 border-b border-border-default pb-4">
                    <button 
                        onClick={() => setViewMode('cloud')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${viewMode === 'cloud' ? 'bg-primary text-white' : 'bg-surface-subtle text-text-secondary hover:bg-surface-hover'}`}
                        aria-pressed={viewMode === 'cloud'}
                    >
                        <CloudIcon className="w-5 h-5" />
                        <span>عرض سحابي</span>
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-surface-subtle text-text-secondary hover:bg-surface-hover'}`}
                        aria-pressed={viewMode === 'list'}
                    >
                        <ListBulletIcon className="w-5 h-5" />
                        <span>عرض أبجدي</span>
                    </button>
                </div>

                {shuffledWords.length > 0 ? (
                    viewMode === 'cloud' ? (
                        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 text-center">
                            {shuffledWords.map(word => renderWord(word))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3 text-right">
                            {sortedWords.map(word => renderWord(word))}
                        </div>
                    )
                ) : (
                    <div className="text-center p-10 text-text-muted">
                        <p className="text-lg">لا توجد كلمات تفاعلية حالياً.</p>
                        <p className="mt-2 text-sm">ابدأ بفتح نقاش أو تحليل كلمة لإثراء المحتوى.</p>
                    </div>
                )}
            </>
        )}
      </main>
    </div>
  );
};

export default CommentsCloudView;