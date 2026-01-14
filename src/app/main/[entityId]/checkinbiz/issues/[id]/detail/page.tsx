'use client';
import { Container } from '@mui/material';

import useEmployeeDetailController from './page.controller';
import { Detail } from './Detail';

export default function BranchDetail() {
    const { initialValues, onSuccess } = useEmployeeDetailController()

    return (
        <Container maxWidth="lg">
            {initialValues?.id && <Detail onSuccess={onSuccess}  issue={initialValues as any} ></Detail>}

        </Container>
    );
}
