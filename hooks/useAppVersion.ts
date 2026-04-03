import { useState, useEffect, useCallback } from 'react';

const APP_VERSION_KEY = 'qran_app_version';

export const useAppVersion = () => {
    const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
    const [currentVersion, setCurrentVersion] = useState<string | null>(null);

    const checkVersion = useCallback(async () => {
        try {
            // Fetch metadata.json with a cache-busting parameter
            const response = await fetch(`./metadata.json?cb=${Date.now()}`);
            if (!response.ok) return;
            
            const metadata = await response.json();
            const latestVersion = metadata.version;
            
            if (!latestVersion) return;

            const storedVersion = localStorage.getItem(APP_VERSION_KEY);
            
            if (!storedVersion) {
                // First time visit, store the version
                localStorage.setItem(APP_VERSION_KEY, latestVersion);
                setCurrentVersion(latestVersion);
            } else if (storedVersion !== latestVersion) {
                // New version detected
                console.log(`New version detected: ${latestVersion} (current: ${storedVersion})`);
                setIsUpdateAvailable(true);
                setCurrentVersion(latestVersion);
            } else {
                setCurrentVersion(latestVersion);
            }
        } catch (error) {
            console.warn('Failed to check app version:', error);
        }
    }, []);

    useEffect(() => {
        checkVersion();
        
        // Check for updates every hour
        const interval = setInterval(checkVersion, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, [checkVersion]);

    const applyUpdate = useCallback(() => {
        if (currentVersion) {
            localStorage.setItem(APP_VERSION_KEY, currentVersion);
        }
        window.location.reload();
    }, [currentVersion]);

    return { isUpdateAvailable, applyUpdate, currentVersion };
};
