'use client'
import React, { useEffect, useState } from 'react';
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
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

// Define the steps/slides for the onboarding process
const onboardingSteps = [
    {
        title: 'Welcome to Our App!',
        description: 'Discover a new way to manage your tasks, connect with friends, and explore new opportunities.',
        image: 'https://placehold.co/400x250/A3E635/000000?text=Welcome', // Placeholder image
    },
    {
        title: 'Intuitive Interface',
        description: 'Our user-friendly design ensures a seamless and enjoyable experience from start to finish.',
        image: 'https://placehold.co/400x250/22D3EE/000000?text=Interface', // Placeholder image
    },
    {
        title: 'Powerful Features',
        description: 'Unlock a suite of powerful tools designed to boost your productivity and simplify your life.',
        image: 'https://placehold.co/400x250/FACC15/000000?text=Features', // Placeholder image
    },
    {
        title: 'Get Started!',
        description: 'You are now ready to begin your journey. Click "Finish" to dive in!',
        image: 'https://placehold.co/400x250/FB923C/000000?text=Ready', // Placeholder image
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
    const { open, closeModal, openModal } = useCommonModal()
    const { user } = useAuth()
    const [activeStep, setActiveStep] = useState(0);
    const classes = useStyles()

    // Handler for closing the dialog
    const handleClose = () => {
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

    useEffect(() => {
        if (user?.id) {
            const isViewOnboarding = localStorage.getItem('view-onboarding-' + user?.id)
            if (!isViewOnboarding) {
                setTimeout(() => {
                    openModal()
                }, 2000);
            }

        }
    }, [user?.id])


    return (
        <Dialog
            open={open.open && open.type === CommonModalType.ONBOARDING}
            slots={{
                transition: Transition,
            }}
            keepMounted
            onClose={handleClose}
            aria-describedby="onboarding-dialog-description"
            fullWidth
            maxWidth="md" // Set max width for the dialog
            PaperProps={{
                className: "rounded-xl shadow-2xl overflow-hidden" // Tailwind classes for rounded corners and shadow
            }}
        >
            {/* Dialog title with a close button */}
            <DialogTitle
                sx={classes.header}>
                <Typography variant="h5" component="div" className="font-semibold">
                    {onboardingSteps[activeStep].title}
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    className="text-white hover:bg-blue-700"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* Dialog content area for the current slide */}
            <DialogContent sx={classes.content}>
                <Image
                width={100}
                height={100}
                    src={onboardingSteps[activeStep].image}
                    alt={onboardingSteps[activeStep].title}
                    className={classes.image as any} // Responsive image styling
                    onError={(e: any) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x250/CCCCCC/000000?text=Image+Error"; }}
                />
                <Typography variant="body1" className="text-gray-700 leading-relaxed max-w-lg">
                    {onboardingSteps[activeStep].description}
                </Typography>
            </DialogContent>

            {/* Dialog actions for navigation and stepper */}
            <DialogActions className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-200">
                {/* Stepper to show progress */}
                <Box className="flex-grow w-full sm:w-auto mb-4 sm:mb-0">
                    <Stepper activeStep={activeStep} alternativeLabel className="w-full">
                        {onboardingSteps.map((step, index) => (
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
                        className="rounded-full px-4 py-2 hover:bg-gray-100 border-gray-300 text-gray-700"
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={isLastStep}
                        endIcon={<ArrowForwardIosIcon />}
                        className="rounded-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Next
                    </Button>
                    {/* Finish button only on the last step */}
                    {isLastStep && (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleClose}
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
