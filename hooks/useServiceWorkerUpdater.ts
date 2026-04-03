import { useState, useEffect, useCallback } from 'react';

export const useServiceWorkerUpdater = () => {
    const [showUpdateNotification, setShowUpdateNotification] = useState(false);
    const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            const registerServiceWorker = async () => {
                try {
                    const registration = await navigator.serviceWorker.register(
                        './service-worker.js',
                        { scope: './' }
                    );
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    setWaitingWorker(newWorker);
                                    setShowUpdateNotification(true);
                                }
                            });
                        }
                    });
                } catch (error) {
                    console.warn("Service Worker registration failed:", error);
                }
            };
            registerServiceWorker();
        }
    }, []);

    const handleUpdate = useCallback(() => {
        if (waitingWorker) {
            waitingWorker.postMessage({ type: 'SKIP_WAITING' });
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (refreshing) return;
                window.location.reload();
                refreshing = true;
            });
        }
    }, [waitingWorker]);

    return { showUpdateNotification, handleUpdate };
};
