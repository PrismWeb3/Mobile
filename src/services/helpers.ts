export const wait = (p_milliSeconds: number) => new Promise(p_resolve => setTimeout(p_resolve, p_milliSeconds));

export const generateRandomKey = (): string => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'.split('');

    let id = '_';
    for (let i = 0; i < 15; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }

    return id;
};

export function formatTime(date: Date) {
    const now = new Date();

    const timeDiffInHours = (now.getTime() - date.getTime()) / 1000 / 60;

    if (timeDiffInHours < 24) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
}

export function formatDate(date: Date) {
    return date.toLocaleTimeString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
