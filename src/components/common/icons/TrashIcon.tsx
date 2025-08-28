import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export const TrashIcon = (props: any) => {

    return (
        <SvgIcon {...props}>
            <mask id="mask0_2763_1721" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="30" height="30">
                <rect width="30" height="30" />
            </mask>
            <g mask="url(#mask0_2763_1721)">
                <path d="M5.625 18C5.14375 18 4.73177 17.8259 4.38906 17.4778C4.04635 17.1296 3.875 16.7111 3.875 16.2222V4.66667H3V2.88889H7.375V2H12.625V2.88889H17V4.66667H16.125V16.2222C16.125 16.7111 15.9536 17.1296 15.6109 17.4778C15.2682 17.8259 14.8562 18 14.375 18H5.625ZM14.375 4.66667H5.625V16.2222H14.375V4.66667ZM7.375 14.4444H9.125V6.44444H7.375V14.4444ZM10.875 14.4444H12.625V6.44444H10.875V14.4444Z" />
            </g>

        </SvgIcon>
    );
}


