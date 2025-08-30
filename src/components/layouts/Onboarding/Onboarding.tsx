'use client'
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Slide,
    IconButton,
    Box,
    MobileStepper,
    LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { TransitionProps } from '@mui/material/transitions';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useStyles } from './Onboarding.styles';
import Image from 'next/image';
import image from '../../../../public/assets/images/1.jpg'
import { Card1 } from './Cards/Card1';
import { Card2 } from './Cards/Card2';
import { Card3 } from './Cards/Card3';

// Define the steps/slides for the onboarding process
const onboardingSteps = [
    {
        title: 'Welcome to Our App!',
        description: 'Discover a new way to manage your tasks, connect with friends, and explore new opportunities.',
        image: image, // Placeholder image
    },
    {
        title: 'Intuitive Interface',
        description: 'Our user-friendly design ensures a seamless and enjoyable experience from start to finish.',
        image: image, // Placeholder image
    },
    {
        title: 'Powerful Features',
        description: 'Unlock a suite of powerful tools designed to boost your productivity and simplify your life.',
        image: image, // Placeholder image
    },
    {
        title: 'Get Started!',
        description: 'You are now ready to begin your journey. Click "Finish" to dive in!',
        image: image, // Placeholder image
    },
];

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
    };

    // Handler for moving to the next step
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    // Handler for moving to the previous step
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
            fullWidth
            maxWidth="lg" // Set max width for the dialog

        >
            <LinearProgress variant="determinate" value={(activeStep+1)*33} />

            {/* Dialog content area for the current slide */}
            <DialogContent sx={classes.content}>                  
                {activeStep === 0 && <Card1 handleNext={handleNext} />}
                {activeStep === 1 && <Card2 handleNext={handleNext}/>}
                {activeStep === 2 && <Card3 handleNext={handleNext} />}
            </DialogContent>

             
        </Dialog>
    );
}

export default Onboarding;
