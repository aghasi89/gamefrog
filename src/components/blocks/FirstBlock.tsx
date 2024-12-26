import React, {ReactNode} from 'react';

export const FirstBlock = ({children}:{children: ReactNode}) => {
    return (
        <div>
            {children}
        </div>
    );
};
