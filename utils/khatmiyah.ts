const KHATMIYAH_ACTION_TRACKER_KEY = 'qran_khatmiyah_actions_v1';

export const generateKhatmahId = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    let letters = '';
    for (let i = 0; i < 3; i++) {
        letters += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    let numbers = '';
    for (let i = 0; i < 3; i++) {
        numbers += nums.charAt(Math.floor(Math.random() * nums.length));
    }
    return `${letters}${numbers}`;
};

// Anti-spam helper functions
const getActionTracker = () => {
    const today = new Date().toISOString().split('T')[0];
    try {
        const stored = localStorage.getItem(KHATMIYAH_ACTION_TRACKER_KEY);
        if (stored) {
            const tracker = JSON.parse(stored);
            if (tracker.date === today) {
                return tracker;
            }
        }
    } catch (e) { console.error("Could not parse action tracker", e); }
    // If no tracker, or it's for a previous day, reset it
    return { date: today, creations: 0, reservations: 0, completions: 0 };
};

export const checkActionLimit = (actionType: 'creations' | 'reservations' | 'completions'): boolean => {
    const tracker = getActionTracker();
    const limits = { creations: 1, reservations: 10, completions: 10 };
    
    if (tracker[actionType] >= limits[actionType]) {
        alert(`لقد وصلت إلى الحد الأقصى المسموح به لهذا الإجراء اليوم (${limits[actionType]}). يرجى المحاولة غداً.`);
        return false;
    }
    return true;
};

export const incrementActionCount = (actionType: 'creations' | 'reservations' | 'completions') => {
    const tracker = getActionTracker();
    tracker[actionType] += 1;
    localStorage.setItem(KHATMIYAH_ACTION_TRACKER_KEY, JSON.stringify(tracker));
};
