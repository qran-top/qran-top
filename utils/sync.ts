export const generateSyncCode = (): string => {
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
