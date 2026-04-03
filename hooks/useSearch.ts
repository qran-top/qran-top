import { useMemo, useCallback } from 'react';
import type { Ayah, SurahData } from '../types';
import { QURAN_INDEX } from '../quranIndex';
import { normalizeArabicText } from '../utils/text';
import { levenshtein } from '../utils/levenshtein';

export const useSearch = (allQuranData: { [key: string]: SurahData[] } | null) => {
    
    const surahNameMap = useMemo(() => {
        const map = new Map<string, number>();
        QURAN_INDEX.forEach(surah => {
            map.set(normalizeArabicText(surah.name.replace(/^سُورَةُ\s*/, '')), surah.number);
            map.set(normalizeArabicText(surah.name.replace(/^سُورَةُ\s*ال/, '')), surah.number);
        });
        return map;
    }, []);
    
    const simpleSearchableAyahs = useMemo(() => {
        if (!allQuranData || !allQuranData['quran-simple-clean']) return [];
        const simpleData = allQuranData['quran-simple-clean'];
        return simpleData.flatMap(surah =>
            surah.ayahs.map(ayah => ({
                ...ayah,
                surah: {
                    number: surah.number, name: surah.name, englishName: surah.englishName,
                    englishNameTranslation: surah.englishNameTranslation, revelationType: surah.revelationType,
                }
            }))
        );
    }, [allQuranData]);

    const quranicWordList = useMemo(() => {
        if (!simpleSearchableAyahs) return new Set<string>();
        const words = new Set<string>();
        simpleSearchableAyahs.forEach(ayah => {
            normalizeArabicText(ayah.text).split(/\s+/).forEach(word => {
                if (word) words.add(word);
            });
        });
        return words;
    }, [simpleSearchableAyahs]);

    const tryParseAyahReference = useCallback((query: string): { surah: number; ayah: number } | null => {
        const cleanedQuery = query.trim().replace(/[أإآ]/g, 'ا').replace(/[آا]ية/g, '').replace(/سورة/g, '');
        const nameMatch = cleanedQuery.match(/^\s*([^\d\s:]+(?:\s+[^\d\s:]+)*)\s*[:\s]\s*(\d+)\s*$/);
        if (nameMatch) {
            const surahName = normalizeArabicText(nameMatch[1].trim());
            const ayahNumber = parseInt(nameMatch[2], 10);
            if (surahNameMap.has(surahName)) return { surah: surahNameMap.get(surahName)!, ayah: ayahNumber };
        }
        const numberMatch = cleanedQuery.match(/^\s*(\d+)\s*[:\s]\s*(\d+)\s*$/);
        if (numberMatch) {
            const surahNumber = parseInt(numberMatch[1], 10);
            const ayahNumber = parseInt(numberMatch[2], 10);
            if (surahNumber > 0 && surahNumber <= 114 && ayahNumber > 0) return { surah: surahNumber, ayah: ayahNumber };
        }
        return null;
    }, [surahNameMap]);

    const performSearch = useCallback((query: string): { results: Ayah[], finalSearchEdition: string, correctedQuery?: string } => {
        if (!allQuranData) return { results: [], finalSearchEdition: 'quran-simple-clean' };
        
        const executeSearch = (searchQuery: string) => {
            const isExactPhrase = searchQuery.startsWith('"') && searchQuery.endsWith('"');
            const content = isExactPhrase ? searchQuery.substring(1, searchQuery.length - 1) : searchQuery;
            if (!content) return { results: [], finalSearchEdition: 'quran-simple-clean' };

            const searchWords = content.split(/\s+/).filter(Boolean).map(normalizeArabicText);
            const hasDiacritics = /[\u064B-\u065F]/.test(content);
            
            const doSearch = (editionId: string): number[] => {
                const dataSource = allQuranData[editionId];
                if (!dataSource) return [];
                const matchingAyahNumbers: number[] = [];
                dataSource.forEach(surah => surah.ayahs.forEach(ayah => {
                    const ayahText = normalizeArabicText(ayah.text);
                    if ((isExactPhrase && ayahText.includes(searchWords.join(' '))) || (!isExactPhrase && searchWords.every(word => ayahText.includes(word)))) {
                        matchingAyahNumbers.push(ayah.number);
                    }
                }));
                return matchingAyahNumbers;
            };

            let matchingIdentifiers: number[] = [];
            let finalSearchEdition = 'quran-simple-clean';
            if (hasDiacritics && allQuranData['quran-uthmani-quran-academy']) {
                matchingIdentifiers = doSearch('quran-uthmani-quran-academy');
                if (matchingIdentifiers.length > 0) finalSearchEdition = 'quran-uthmani-quran-academy';
                else matchingIdentifiers = doSearch('quran-simple-clean');
            } else {
                matchingIdentifiers = doSearch('quran-simple-clean');
            }
            const matchingSet = new Set(matchingIdentifiers);
            return { results: simpleSearchableAyahs.filter(ayah => matchingSet.has(ayah.number)), finalSearchEdition };
        };

        const initialResult = executeSearch(query);
        if (initialResult.results.length === 0 && !query.includes(' ') && !query.startsWith('"') && quranicWordList.size > 0) {
            let minDistance = 3; let bestMatch = '';
            const normalizedQuery = normalizeArabicText(query);
            for (const dictWord of quranicWordList) {
                const distance = levenshtein(normalizedQuery, dictWord);
                if (distance < minDistance) { minDistance = distance; bestMatch = dictWord; }
                if (minDistance === 1) break;
            }
            if (bestMatch) {
                const correctedResult = executeSearch(bestMatch);
                if (correctedResult.results.length > 0) return { ...correctedResult, correctedQuery: bestMatch };
            }
        }
        return initialResult;
    }, [allQuranData, simpleSearchableAyahs, quranicWordList]);

    const performSearchByAyahNumber = useCallback((ayahNumber: number): Ayah[] => {
        if (!simpleSearchableAyahs) return [];
        return simpleSearchableAyahs.filter(ayah => ayah.numberInSurah === ayahNumber);
    }, [simpleSearchableAyahs]);

    return {
        simpleSearchableAyahs,
        tryParseAyahReference,
        performSearch,
        performSearchByAyahNumber,
    };
};
