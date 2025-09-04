import { useTheme } from '@mui/material';
import React from 'react';
 
export const StepIcon = (props: any) => {
    const theme = useTheme()
    
    return (
        <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_3052_2642" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="33" height="33">
                <rect width="33" height="33" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_3052_2642)">
                <path d="M10.7 21.5H12.8V16H10.7V17.7188H8.6V19.7812H10.7V21.5ZM14.2 19.7812H25.4V17.7188H14.2V19.7812ZM21.2 16H23.3V14.2812H25.4V12.2188H23.3V10.5H21.2V16ZM8.6 14.2812H19.8V12.2188H8.6V14.2812ZM12.8 27H11.4H5.8C5.03 27 4.37083 26.7307 3.8225 26.1922C3.27417 25.6536 3 25.0063 3 24.25V7.75C3 6.99375 3.27417 6.34635 3.8225 5.80781C4.37083 5.26927 5.03 5 5.8 5H28.2C28.97 5 29.6292 5.26927 30.1775 5.80781C30.7258 6.34635 31 6.99375 31 7.75V24.25C31 25.0063 30.7258 25.6536 30.1775 26.1922C29.6292 26.7307 28.97 27 28.2 27H22.6H21.5818H19.8H17.5091H12.8ZM5.8 24.25H28.2V7.75H5.8V24.25Z" fill={props.selected?theme.palette.primary.main:"#1C1B1D"} />
            </g>
        </svg>

    );
}


