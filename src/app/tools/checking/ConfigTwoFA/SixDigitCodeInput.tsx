import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    TextField,
} from '@mui/material';



const SixDigitCodeInput = ({ onCompleted }: { onCompleted: (completed: string) => void }) => {
    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    // Focus the first input on component mount
    useEffect(() => {
        if ((inputRefs.current as any)[0]) {
            (inputRefs.current as any)[0].focus();
        }
    }, []);

    const handleDigitChange = (index: any, value: any) => {
        // Only allow numbers and limit to one character
        if (value === '' || (/^\d$/.test(value) && value.length <= 1)) {
            const newDigits = [...digits];
            newDigits[index] = value;
            setDigits(newDigits);
             onCompleted(newDigits.join(''));
            // Auto-focus next input if a digit was entered
            if (value !== '' && index < 5) {
                (inputRefs.current as any)[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index: any, e: any) => {
        // Handle backspace
        if (e.key === 'Backspace') {
            if (digits[index] === '' && index > 0) {
                // If current field is empty and backspace is pressed, focus previous field
                (inputRefs.current as any)[index - 1]?.focus();
            } else {
                // Clear current field
                const newDigits = [...digits];
                newDigits[index] = '';
                setDigits(newDigits);
                onCompleted(newDigits.join(''));
            }
        }

        // Handle arrow keys for navigation
        if (e.key === 'ArrowLeft' && index > 0) {
            (inputRefs.current as any)[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < 5) {
            (inputRefs.current as any)[index + 1]?.focus();
        }
    };

    const handlePaste = (e: any) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text');
        const numbers = pasteData.replace(/\D/g, '').slice(0, 6); // Only take numbers and limit to 6 digits

        if (numbers.length === 6) {
            const newDigits = numbers.split('');
            setDigits(newDigits);

             onCompleted(newDigits.join(''));

            // Focus the last input after paste
            (inputRefs.current as any)[5]?.focus();
        }
    };

   


    return (

        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                mb: 3
            }}
        >
            {digits.map((digit, index) => (
                <TextField
                    key={index}
                    inputRef={(el) => (((inputRefs.current as any) as any)[index] = el)}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    inputProps={{
                        maxLength: 1,
                        style: {
                            textAlign: 'center',
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                        }
                    }}
                    sx={{
                        width: 60,
                        height: 60,
                        '& .MuiOutlinedInput-root': {
                            height: '100%',
                        },
                        '& input': {
                            padding: '12px'
                        }
                    }}
                    variant="outlined"
                />
            ))}
        </Box>
    );
};

export default SixDigitCodeInput;