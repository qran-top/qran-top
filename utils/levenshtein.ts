// --- Levenshtein Distance Helper ---
// Calculates the number of edits (insertions, deletions, or substitutions)
// required to change one string into the other.
export const levenshtein = (s1: string, s2: string): number => {
    if (s1.length < s2.length) { return levenshtein(s2, s1); }
    if (s2.length === 0) { return s1.length; }
    let previousRow = Array.from({ length: s2.length + 1 }, (_, i) => i);
    for (let i = 0; i < s1.length; i++) {
        let currentRow = [i + 1];
        for (let j = 0; j < s2.length; j++) {
            let insertions = previousRow[j + 1] + 1;
            let deletions = currentRow[j] + 1;
            let substitutions = previousRow[j] + (s1[i] !== s2[j] ? 1 : 0);
            currentRow.push(Math.min(insertions, deletions, substitutions));
        }
        previousRow = currentRow;
    }
    return previousRow[s2.length];
};