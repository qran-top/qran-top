import { useState, useEffect, useMemo, useCallback } from 'react';

export const useRouting = () => {
    const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');

    const handleHashChange = useCallback(() => {
        setCurrentPath(window.location.hash || '#/');
    }, []);

    useEffect(() => {
        window.addEventListener('hashchange', handleHashChange, false);
        return () => window.removeEventListener('hashchange', handleHashChange, false);
    }, [handleHashChange]);

    const { path, pathParts, queryParams } = useMemo(() => {
        const [pathStr, paramsStr] = currentPath.substring(1).split('?');
        const parts = pathStr.split('/').filter(Boolean);
        const params = new URLSearchParams(paramsStr);
        return { path: pathStr, pathParts: parts, queryParams: params };
    }, [currentPath]);

    return {
        currentPath,
        pathParts,
        queryParams,
    };
};
