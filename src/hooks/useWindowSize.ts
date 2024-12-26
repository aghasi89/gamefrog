import React, { useState, useEffect } from 'react';

export const useWindowSize = ():{width: number, height: number} => {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // Добавление слушателя события изменения размера окна
        window.addEventListener('resize', handleResize);

        // Удаление слушателя при размонтировании компонента
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return windowSize;
}

