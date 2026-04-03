import React, { useState, useRef } from 'react';
import { MicrophoneIcon, SearchIcon } from './icons';

interface SearchFormProps {
    onSearch: (query: string) => void;
    disabled?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, disabled = false }) => {
    const [query, setQuery] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };
    
    const playTone = (frequency: number, duration: number) => {
        try {
            const audioCtx = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
            if (!audioCtx) return;

            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
            
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.error("Web Audio API error:", e);
        }
    };
    
    const handleVoiceSearch = async () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("عذراً، البحث الصوتي غير مدعوم في متصفحك.");
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
        } catch (err: any) {
            console.error("Microphone permission error", err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                 alert("للبحث الصوتي، يرجى السماح بالوصول إلى الميكروفون في إعدادات متصفحك أو عند الطلب.");
            } else {
                 alert("لم يتم العثور على ميكروفون أو حدث خطأ عند محاولة الوصول إليه.");
            }
            return;
        }
        
        playTone(880, 0.15);

        const recognition = new SpeechRecognition();
        recognition.lang = 'ar-SA';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognitionRef.current = recognition;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            let transcript = event.results[0][0].transcript;
            transcript = transcript.replace(/[.?!؟,]/g, '').trim();
            setQuery(transcript);
            onSearch(transcript);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            if (event.error !== 'not-allowed' && event.error !== 'service-not-allowed' && event.error !== 'no-speech') {
                 alert("حدث خطأ أثناء التعرف على الصوت.");
            }
        };
        
        recognition.onend = () => {
            playTone(523, 0.2);
            setIsListening(false);
            recognitionRef.current = null;
        };
        
        recognition.start();
    };

    return (
        <form onSubmit={handleSubmit} className="flex-grow w-full max-w-xl flex items-center">
            <div className="relative w-full">
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={disabled ? "جاري تحميل بيانات البحث..." : "ابحث عن كلمة، أو أدخل مرجعاً مثل (البقرة ٢٥٥)..."}
                    className="w-full text-base h-10 pl-14 pr-4 bg-surface border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    aria-label="بحث في المصحف الشريف"
                    disabled={disabled}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button type="button" onClick={handleVoiceSearch} className={`p-1 text-text-subtle rounded-full ${isListening ? 'text-red-500 animate-pulse-mic' : 'hover:text-primary'} disabled:opacity-50 disabled:cursor-not-allowed`} aria-label="بحث صوتي" title="بحث صوتي" disabled={disabled}>
                        <MicrophoneIcon className="w-4 h-4" />
                    </button>
                    <button type="submit" className="p-1 text-text-subtle hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed" aria-label="بحث" disabled={disabled}>
                        <SearchIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SearchForm;