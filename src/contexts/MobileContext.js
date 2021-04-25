import React, { useState, useEffect } from 'react';

export const MOBILE_RESOLUTION_WIDTH = 1024;

export const getWindowDimension = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
});

export const getMobileState = ({ width }) => width <= MOBILE_RESOLUTION_WIDTH;

const MobileContext = React.createContext(null);

export const MobileProvider = MobileContext.Provider;

export const MobileConsumer = MobileContext.Consumer;

export const MobileApp = ({ children }) => {
    const [windowDimension, setWindowDimension] = useState(getWindowDimension());
    const onResize = () => setWindowDimension(getWindowDimension());

    useEffect(() => {
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <MobileProvider value={{
            isMobile: getMobileState(windowDimension),
            ...windowDimension,
        }}>
            {children}
        </MobileProvider>
    );
};

export default MobileContext;
