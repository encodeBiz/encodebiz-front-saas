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

    // Check if it's the last step
    const isLastStep = activeStep === onboardingSteps.length - 1;

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
            maxWidth="md" // Set max width for the dialog

        >
            {/* Dialog title with a close button */}
            <DialogTitle
                sx={classes.header}>
                <Typography variant="h5" component="div" className="font-semibold">
                    {onboardingSteps[activeStep].title}
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={(e) => handleClose(e, 'manual')}
                    className="text-white hover:bg-blue-700"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* Dialog content area for the current slide */}
            <DialogContent sx={classes.content}>
                <Image
                    width={400}
                    height={300}
                    src={onboardingSteps[activeStep].image}
                    alt={onboardingSteps[activeStep].title}
                    className={classes.image as any} // Responsive image styling
                />
                <Typography variant="body1" sx={classes.textContent}>
                    {onboardingSteps[activeStep].description}
                </Typography>
            </DialogContent>

            {/* Dialog actions for navigation and stepper */}
            <DialogActions sx={classes.footer} className="">
                {/* Stepper to show progress */}
                <Box className="flex-grow w-full sm:w-auto mb-4 sm:mb-0">
                    <Stepper activeStep={activeStep} alternativeLabel className="w-full">
                        {onboardingSteps.map((step) => (
                            <Step key={step.title}>
                                <StepLabel>{/* Step labels are optional, could display step.title here */}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                {/* Navigation buttons */}
                <Box className="flex justify-center sm:justify-end gap-2 w-full sm:w-auto">
                    <Button
                        variant="outlined"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        startIcon={<ArrowBackIosIcon />}
                        style={{ marginRight: 10 }}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={isLastStep}
                        endIcon={<ArrowForwardIosIcon />}

                    >
                        Next
                    </Button>
                    {/* Finish button only on the last step */}
                    {isLastStep && (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={(e) => handleClose(e, 'manual')}
                            className="rounded-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white"
                        >
                            Finish
                        </Button>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
}

export default Onboarding;
