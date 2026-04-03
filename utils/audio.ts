import type { Ayah, QuranEdition } from '../types';

export const getAudioUrl = (ayah: Ayah, audioEditionDetails: QuranEdition): string | undefined => {
  const { sourceApi, reciterIdentifier, identifier } = audioEditionDetails;
  if (!ayah.surah?.number) return undefined;
  switch (sourceApi) {
    case 'versebyversequran.com':
      if (!reciterIdentifier) return undefined;
      const surahNumPad = ayah.surah.number.toString().padStart(3, '0');
      const ayahNumPad = ayah.numberInSurah.toString().padStart(3, '0');
      return `https://everyayah.com/data/${reciterIdentifier}/${surahNumPad}${ayahNumPad}.mp3`;
    case 'islamic-network':
      if (!ayah.number) return undefined;
      return `https://cdn.islamic.network/quran/audio/128/${identifier}/${ayah.number}.mp3`;
    default: return undefined;
  }
};

export const getBismillahAudioUrl = (audioEditionDetails: QuranEdition): string | undefined => {
  const { sourceApi, reciterIdentifier, identifier } = audioEditionDetails;
  switch (sourceApi) {
    case 'versebyversequran.com': return reciterIdentifier ? `https://everyayah.com/data/${reciterIdentifier}/001001.mp3` : undefined;
    case 'alquran.cloud': case 'islamic-network': return `https://cdn.islamic.network/quran/audio/128/${identifier}/1.mp3`;
    default: return undefined;
  }
};

export const getSecondaryAudioUrl = (ayah: Ayah, identifier: string): string | undefined => {
    // Specific fallback for Muhammad Ayyub to EveryAyah
    if (identifier === 'ar.muhammadayyoub' && ayah.surah) {
        const surahPad = ayah.surah.number.toString().padStart(3, '0');
        const ayahPad = ayah.numberInSurah.toString().padStart(3, '0');
        // Using 128kbps source from EveryAyah
        return `https://everyayah.com/data/Muhammad_Ayyoub_128kbps/${surahPad}${ayahPad}.mp3`;
    }
    return undefined;
};