import { useState, useEffect, useMemo } from 'react';
import type { QuranEdition, QuranFont, FontSize, BrowsingMode, FontStyleType } from '../types';

const QURAN_EDITION_KEY = 'qran_app_edition';
const FONT_SIZE_KEY = 'qran_app_font_size';
const FONT_STYLE_KEY = 'qran_app_font_style';
const AUDIO_EDITION_KEY = 'qran_app_audio_edition';
const BROWSING_MODE_KEY = 'qran_app_browsing_mode';

const DEFAULT_EDITIONS: QuranEdition[] = [
    { identifier: "quran-simple-clean", language: "ar", name: "المصحف المبسط", englishName: "Simple Clean", format: "text", type: "quran", direction: "rtl", sourceApi: "alquran.cloud" },
    { identifier: "quran-uthmani-quran-academy", language: "ar", name: "الرسم العثماني", englishName: "Uthmani (Quran Academy)", format: "text", type: "quran", direction: "rtl", sourceApi: "alquran.cloud" }
];

export const useSettings = () => {
    const [fontSize, setFontSize] = useState<FontSize>(() => (localStorage.getItem(FONT_SIZE_KEY) as FontSize) || 'md');
    
    // Default to 'imlai_1' (System Font) for maximum performance on first load
    const [fontStyle, setFontStyle] = useState<FontStyleType>(
        () => (localStorage.getItem(FONT_STYLE_KEY) as FontStyleType) || 'imlai_1'
    );

    // Default to 'quran-simple-clean' which is loaded instantly from GCS
    const [selectedEdition, setSelectedEdition] = useState<string>(
        () => localStorage.getItem(QURAN_EDITION_KEY) || 'quran-simple-clean'
    );
    
    // Default to 'full' mode as it pairs with simple text
    const [browsingMode, setBrowsingMode] = useState<BrowsingMode>(() => {
        const storedMode = localStorage.getItem(BROWSING_MODE_KEY) as BrowsingMode;
        if (storedMode) return storedMode;
        return 'full';
    });

    const activeEditions = DEFAULT_EDITIONS;

    const [selectedAudioEdition, setSelectedAudioEdition] = useState<string>(
        () => localStorage.getItem(AUDIO_EDITION_KEY) || 'ar.muhammadayyoub'
    );

    useEffect(() => { localStorage.setItem(QURAN_EDITION_KEY, selectedEdition); }, [selectedEdition]);
    useEffect(() => { localStorage.setItem(FONT_SIZE_KEY, fontSize); }, [fontSize]);
    useEffect(() => { localStorage.setItem(FONT_STYLE_KEY, fontStyle); }, [fontStyle]);
    useEffect(() => { localStorage.setItem(BROWSING_MODE_KEY, browsingMode); }, [browsingMode]);
    useEffect(() => { localStorage.setItem(AUDIO_EDITION_KEY, selectedAudioEdition); }, [selectedAudioEdition]);

    const displayEdition = useMemo(() => {
        const found = activeEditions.find(e => e.identifier === selectedEdition) || DEFAULT_EDITIONS[0];
        if (found.name.includes('القرآن الكريم')) {
            return { ...found, name: found.name.replace(/القرآن الكريم/g, 'المصحف الشريف') };
        }
        return found;
    }, [activeEditions, selectedEdition]);

    return {
        fontSize, setFontSize,
        fontStyle, setFontStyle,
        browsingMode, setBrowsingMode,
        activeEditions,
        selectedEdition, setSelectedEdition,
        selectedAudioEdition, setSelectedAudioEdition,
        displayEdition
    };
};