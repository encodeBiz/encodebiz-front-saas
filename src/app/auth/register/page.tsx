
'use client'
import React from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    Divider,
    Paper,
    Grid,
    Link
} from '@mui/material';
import {
    Google as GoogleIcon,
    Facebook as FacebookIcon
} from '@mui/icons-material';
import { RegisterFormValues, useRegisterController } from './page.controller';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';


const SignUpPage = () => {
    const { signInWithGoogle, initialValues, signInWithFacebook, validationSchema, fields, signInWithEmail } = useRegisterController()


    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Create an Account
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Join our community today
                    </Typography>
                </Box>

                <Grid container spacing={2} sx={{ width: '100%' }}>
                    <Grid item xs={12} sm={6} sx={{ width: '100%' }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<GoogleIcon color="primary" />}
                            onClick={signInWithGoogle}
                            sx={{ height: 56 }}
                        >
                            Google
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ width: '100%' }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<FacebookIcon color="primary" />}
                            onClick={signInWithFacebook}
                            sx={{ height: 56 }}
                        >
                            Facebook
                        </Button>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        OR
                    </Typography>
                </Divider>


                <GenericForm<RegisterFormValues>
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={signInWithEmail}
                    fields={fields as FormField[]}
                    submitButtonText="Sign Up"
                />

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2">
                        Already have an account? <Link href="/login">Log in</Link>
                    </Typography>
                </Box>

            </Paper>
        </Container>
    );
};

export default SignUpPage;
