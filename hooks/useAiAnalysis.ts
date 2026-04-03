import { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { db, FieldValue } from '../firebase';
import { normalizeArabicText } from '../utils/text';

interface AnalysisDoc {
    id: string;
    result: string;
    prompt: string;
    createdAt: any;
}

export const useAiAnalysis = (word: string) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [aiResult, setAiResult] = useState('');
    const [isCheckingCache, setIsCheckingCache] = useState(false);
    const [cachedAnalyses, setCachedAnalyses] = useState<AnalysisDoc[] | null>(null);
    const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisDoc | null>(null);

    const fetchAnalyses = useCallback(async (wordToFetch: string, selectFirst = false) => {
        if (!wordToFetch) return;
        setIsCheckingCache(true);
        setCachedAnalyses(null);
        setSelectedAnalysis(null);
        setAiResult('');
        try {
            const collectionRef = db.collection('qran_word_analysis_cache').doc(normalizeArabicText(wordToFetch)).collection('analyses').orderBy('createdAt', 'desc');
            const snapshot = await collectionRef.get();
            if (!snapshot.empty) {
                const analyses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AnalysisDoc));
                setCachedAnalyses(analyses);
                if (selectFirst && analyses.length > 0) {
                    const firstAnalysis = analyses[0];
                    setSelectedAnalysis(firstAnalysis);
                    setAiResult(firstAnalysis.result);
                }
            }
        } catch (error) {
            console.error("Error checking AI cache:", error);
        } finally {
            setIsCheckingCache(false);
        }
    }, []);
    
    const saveAiResultToCache = async (wordToCache: string, result: string, prompt: string) => {
        if (!wordToCache || !result) return;
        const normalizedWord = normalizeArabicText(wordToCache);
        try {
            const wordDocRef = db.collection('qran_word_analysis_cache').doc(normalizedWord);
            const analysesSubCollectionRef = wordDocRef.collection('analyses');
            await analysesSubCollectionRef.add({
                result: result,
                prompt: prompt,
                createdAt: FieldValue.serverTimestamp()
            });
            await wordDocRef.set({
                lastAnalyzedAt: FieldValue.serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error("Failed to save AI result to cache:", error);
        }
    };

    const triggerAnalysis = async (customPrompt: string, dataString: string) => {
        if (!word) return;
        setIsProcessing(true);
        setAiResult('');

        try {
            // الحصول على مفتاح API من localStorage
            const apiKey = localStorage.getItem('qran_user_api_key');
            
            if (!apiKey) {
                throw new Error("MISSING_API_KEY");
            }
            const ai = new GoogleGenAI({ apiKey });
            const fullContent = `
الكلمة المراد تحليلها: "${word}"

تعليمات التحليل:
${customPrompt}

البيانات الإحصائية المستخرجة من القرآن (المثاني):
${dataString}
            `;

            const response = await ai.models.generateContentStream({
                model: 'gemini-3-pro-preview',
                contents: fullContent,
            });

            let finalResult = '';
            for await (const chunk of response) {
                if (chunk.text) {
                    finalResult += chunk.text;
                    setAiResult(prev => prev + chunk.text);
                }
            }
            
            await saveAiResultToCache(word, finalResult, customPrompt);
            await fetchAnalyses(word, true);

        } catch (error: any) {
            console.error("AI Error:", error);
            if (error.message === "MISSING_API_KEY") {
                setAiResult("يرجى إدخال مفتاح API الخاص بك في الإعدادات لتفعيل ميزة تحليل الذكاء الاصطناعي.");
            } else {
                setAiResult("حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. يرجى التأكد من صحة مفتاح API والمحاولة مرة أخرى.");
            }
        } finally {
            setIsProcessing(false);
        }
    };
    
    // Effect to fetch analyses when the word changes
    useEffect(() => {
        if (word) {
            fetchAnalyses(word);
        } else {
            setCachedAnalyses(null);
            setSelectedAnalysis(null);
        }
    }, [word, fetchAnalyses]);

    return {
        isProcessing,
        aiResult,
        setAiResult, // Allow manual setting from cache
        triggerAnalysis,
        isCheckingCache,
        cachedAnalyses,
        selectedAnalysis,
        setSelectedAnalysis,
    };
};
