'use client'
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    Slide,
    LinearProgress,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useStyles } from './Onboarding.styles';
import { Card1 } from './Cards/Card1';
import { Card2 } from './Cards/Card2';
import { Card3 } from './Cards/Card3';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Onboarding() {
    const { open, closeModal } = useCommonModal()
    const [activeStep, setActiveStep] = useState(0);

    const classes = useStyles()

    // Handler for closing the dialog
    const handleClose = (event: any, reason: 'backdropClick' | 'escapeKeyDown' | 'manual') => {
        if (reason !== 'backdropClick')
            closeModal(CommonModalType.ONBOARDING);
        setActiveStep(0)
    };

    // Handler for moving to the next step
    const handleNext = () => {
        if (activeStep == 2) {
           
            closeModal(CommonModalType.ONBOARDING);
             setActiveStep(0)
        }
        else
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };




    return (
        <Dialog
            open={open.open && open.type === CommonModalType.ONBOARDING}
            slots={{
                transition: Transition,
            }}
            keepMounted
            disableEscapeKeyDown
            onClose={handleClose}
            aria-describedby="onboarding-dialog-description"
            fullScreen

        >
            <LinearProgress variant="determinate" value={(activeStep + 1) * 33} />

            {/* Dialog content area for the current slide */}
            <DialogContent sx={classes.content}>
                {activeStep === 0 && <Card1 handleNext={handleNext} />}
                {activeStep === 1 && <Card2 handleNext={handleNext} />}
                {activeStep === 2 && <Card3 handleNext={handleNext} />}
            </DialogContent>


        </Dialog>
    );
}

export default Onboarding;
