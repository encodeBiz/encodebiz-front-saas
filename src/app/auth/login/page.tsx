'use client'
import React from 'react';
import {
    Grid,
    Typography,
    TextField,
    Button,
    CssBaseline,
    Paper
} from '@mui/material';
import { useStyles } from './page.styles';


const LoginPage = ({ imagePosition = 'left' }) => {
    const classes = useStyles();
    return (

        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            {/* Image Grid - conditionally ordered based on prop */}
            <Grid
                item
                xs={false}
                sm={false}
                md={6}
                className={classes.image}
                sx={{
                    order: { xs: 2, md: imagePosition === 'left' ? 1 : 2 }
                }}
            />
            {/* Form Grid */}
            <Grid
                item
                xs={12}
                sm={12}
                md={6}
                component={Paper}
                elevation={6}
                square
                sx={{
                    order: { xs: 1, md: imagePosition === 'left' ? 2 : 1 }
                }}
            >
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Typography variant="body2" color="textSecondary">
                                    Forgot password?
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" color="textSecondary">
                                    {"Don't have an account? Sign Up"}
                                </Typography>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Grid>
        </Grid>

    );
};

export default LoginPage;