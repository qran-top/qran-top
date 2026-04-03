import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { Ayah, QuranEdition, SurahData, PlaybackMode } from '../types';
import { getAudioUrl } from '../utils/audio';

export const useAudioKhatmiyah = (
    allAyahs: Ayah[],
    initialAyahNumber: number,
    onSaveProgress: (ayahNumber: number) => void,
    selectedAudioEdition: string,
    allAudioEditions: QuranEdition[],
    allQuranData: { [key: string]: SurahData[] } | null,
    fetchCustomEditionData: (id: string) => void,
    selectedEdition: string,
    juzStartAyahs: { juz: number, ayahNumber: number }[]
) => {
    const [currentAyahNumber, setCurrentAyahNumber] = useState(initialAyahNumber);
    const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null);
    const [uthmaniText, setUthmaniText] = useState<string>('');
    const [displayedText, setDisplayedText] = useState<string>('');
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioDuration, setAudioDuration] = useState(0);
    const [audioProgress, setAudioProgress] = useState(0);
    const [wordTimings, setWordTimings] = useState<{word: string, start: number, duration: number}[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);

    const [isLoading, setIsLoading] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);
    
    const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('continuous');
    const [playbackJuzSelection, setPlaybackJuzSelection] = useState<number[] | null>(null);
    const [playbackSurahSelection, setPlaybackSurahSelection] = useState<number[] | null>(null);
    
    // Loop State
    const [isLooping, setIsLooping] = useState(false);


    const audioRef = useRef<HTMLAudioElement>(null);
    
    const audioEditionDetails = useMemo(() => allAudioEditions.find(e => e.identifier === selectedAudioEdition), [selectedAudioEdition, allAudioEditions]);

    useEffect(() => {
        const foundAyah = allAyahs.find(a => a.number === currentAyahNumber);
        if (foundAyah) {
            setCurrentAyah(foundAyah);
            const uthmaniData = allQuranData?.['quran-uthmani-quran-academy'];
            const uthmaniSurah = uthmaniData?.find(s => s.number === foundAyah.surah?.number);
            const uthmaniAyah = uthmaniSurah?.ayahs.find(a => a.numberInSurah === foundAyah.numberInSurah);
            setUthmaniText(uthmaniAyah?.text || foundAyah.text || '');
            const displayData = allQuranData?.[selectedEdition];
            const displaySurah = displayData?.find(s => s.number === foundAyah.surah?.number);
            const displayAyah = displaySurah?.ayahs.find(a => a.numberInSurah === foundAyah.numberInSurah);
            setDisplayedText(displayAyah?.text || uthmaniAyah?.text || foundAyah.text || '');
            setIsLoading(true);
            setIsBuffering(true);
            setWordTimings([]);
            setCurrentWordIndex(-1);
            onSaveProgress(currentAyahNumber);
        }
    }, [currentAyahNumber, allAyahs, allQuranData, onSaveProgress, selectedEdition]);

    useEffect(() => {
        if (!currentAyah || !audioEditionDetails || !audioRef.current) return;
        const loadAudio = () => {
            let audioUrl: string | undefined;
            if (audioEditionDetails.sourceApi === 'alquran.cloud') {
                const audioData = allQuranData?.[selectedAudioEdition];
                const audioSurah = audioData?.find(s => s.number === currentAyah.surah?.number);
                const audioAyah = audioSurah?.ayahs.find(a => a.numberInSurah === currentAyah.numberInSurah);
                audioUrl = audioAyah?.audio;
            } else {
                audioUrl = getAudioUrl(currentAyah, audioEditionDetails);
            }
            if (audioUrl && audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.load();
                if(isPlaying) audioRef.current.play().catch(e => console.error("Play failed", e));
            } else {
                setIsLoading(false);
                setIsBuffering(false);
            }
        };
        if(audioEditionDetails.sourceApi === 'alquran.cloud' && !allQuranData?.[selectedAudioEdition]) {
            fetchCustomEditionData(selectedAudioEdition);
        } else {
            loadAudio();
        }
    }, [currentAyah, selectedAudioEdition, audioEditionDetails, allQuranData, fetchCustomEditionData, isPlaying]);
    
    useEffect(() => {
        if (audioDuration > 0 && uthmaniText) {
            const words = uthmaniText.split(' ');
            const totalLetters = words.reduce((acc, word) => acc + word.length, 0);
            if (totalLetters === 0) return;
            const effectiveDuration = audioDuration * 0.92;
            const timePerLetter = effectiveDuration / totalLetters;
            let cumulativeTime = 0;
            const timings = words.map(word => {
                const duration = word.length * timePerLetter;
                const timing = { word, start: cumulativeTime, duration };
                cumulativeTime += duration;
                return timing;
            });
            setWordTimings(timings);
        }
    }, [audioDuration, uthmaniText]);

    useEffect(() => {
        if (!isPlaying) return;
        const intervalId = setInterval(() => {
            if (audioRef.current && wordTimings.length > 0) {
                 const leadTime = 0.150;
                 const currentTime = audioRef.current.currentTime;
                 const lookupTime = currentTime + leadTime;
                 setAudioProgress(currentTime);
                 let newWordIndex = -1;
                 for (let i = 0; i < wordTimings.length; i++) {
                    if (lookupTime >= wordTimings[i].start) {
                        newWordIndex = i;
                    } else {
                        break;
                    }
                 }
                 setCurrentWordIndex(prevIndex => newWordIndex !== prevIndex ? newWordIndex : prevIndex);
            }
        }, 50);
        return () => clearInterval(intervalId);
    }, [isPlaying, wordTimings]);

    const changeAyah = useCallback((direction: 'next' | 'prev') => {
        if (direction === 'prev') {
            const newAyahNumber = currentAyahNumber - 1;
            if (newAyahNumber > 0) setCurrentAyahNumber(newAyahNumber);
            return;
        }

        // Logic for Next Ayah
        const nextAyahNumber = currentAyahNumber + 1;
        
        // --- LOOP LOGIC START ---
        if (isLooping && currentAyah) {
            const nextAyah = allAyahs.find(a => a.number === nextAyahNumber);
            if (!nextAyah || nextAyah.surah?.number !== currentAyah.surah?.number) {
                const firstAyahOfSurah = allAyahs.find(a => a.surah?.number === currentAyah.surah?.number && a.numberInSurah === 1);
                if (firstAyahOfSurah) {
                    setCurrentAyahNumber(firstAyahOfSurah.number);
                    return; 
                }
            }
        }
        // --- LOOP LOGIC END ---

        if (nextAyahNumber > allAyahs.length) {
            setIsPlaying(false);
            return;
        }

        const nextAyah = allAyahs[nextAyahNumber - 1];
        if (!nextAyah || !currentAyah?.juz || !currentAyah?.surah) {
            setIsPlaying(false);
            return;
        }

        let shouldStop = false;
        
        if (playbackMode === 'single' && nextAyah.juz !== currentAyah.juz) {
            shouldStop = true;
        } else if (playbackMode === 'selection_juz' && playbackJuzSelection && nextAyah.juz !== currentAyah.juz) {
            const currentJuzIndex = playbackJuzSelection.indexOf(currentAyah.juz);
            if (currentJuzIndex === -1 || currentJuzIndex === playbackJuzSelection.length - 1) {
                shouldStop = true;
            } else {
                const nextSelectedJuz = playbackJuzSelection[currentJuzIndex + 1];
                const startOfNextSelectedJuz = juzStartAyahs.find(j => j.juz === nextSelectedJuz)?.ayahNumber;
                if (startOfNextSelectedJuz) {
                    setCurrentAyahNumber(startOfNextSelectedJuz);
                    return; 
                } else {
                    shouldStop = true;
                }
            }
        } else if (playbackMode === 'selection_surah' && playbackSurahSelection && nextAyah.surah?.number !== currentAyah.surah.number) {
            const currentSurahIndex = playbackSurahSelection.indexOf(currentAyah.surah.number);
            if (currentSurahIndex === -1 || currentSurahIndex === playbackSurahSelection.length - 1) {
                shouldStop = true;
            } else {
                const nextSelectedSurah = playbackSurahSelection[currentSurahIndex + 1];
                const startOfNextSelectedSurah = allAyahs.find(a => a.surah?.number === nextSelectedSurah && a.numberInSurah === 1)?.number;
                if (startOfNextSelectedSurah) {
                    setCurrentAyahNumber(startOfNextSelectedSurah);
                    return;
                } else {
                    shouldStop = true;
                }
            }
        }


        if (shouldStop) {
            setIsPlaying(false);
        } else {
            setCurrentAyahNumber(nextAyahNumber);
        }
    }, [currentAyahNumber, allAyahs, currentAyah, playbackMode, playbackJuzSelection, playbackSurahSelection, juzStartAyahs, isLooping]);

    const handleAudioEnded = useCallback(() => {
        changeAyah('next');
    }, [changeAyah]);

    const handlePlayPause = () => {
        if (isLoading || isBuffering) return;
        const newIsPlaying = !isPlaying;
        setIsPlaying(newIsPlaying);
        if (newIsPlaying) {
            audioRef.current?.play().catch(e => console.error(e));
            setCurrentWordIndex(-1);
        } else {
            audioRef.current?.pause();
        }
    };
    
    return {
        audioRef,
        currentAyah,
        uthmaniText,
        displayedText,
        isPlaying,
        isLoading,
        isBuffering,
        audioDuration,
        audioProgress,
        currentWordIndex,
        handlePlayPause,
        handleNextAyah: () => changeAyah('next'),
        handlePrevAyah: () => changeAyah('prev'),
        handleAudioEnded,
        setCurrentAyahNumber,
        setAudioDuration,
        setIsLoading,
        setIsBuffering,
        setIsPlaying,
        playbackMode,
        setPlaybackMode,
        playbackJuzSelection,
        setPlaybackJuzSelection,
        playbackSurahSelection,
        setPlaybackSurahSelection,
        isLooping,
        setIsLooping
    };
};