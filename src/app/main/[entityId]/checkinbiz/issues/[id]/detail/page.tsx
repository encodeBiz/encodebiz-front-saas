'use client';
import { Container } from '@mui/material';

import useEmployeeDetailController from './page.controller';
import { Detail } from './Detail';

export default function BranchDetail() {
    const { initialValues } = useEmployeeDetailController()

    return (
        <Container maxWidth="lg">
            {initialValues?.id && <Detail  issue={initialValues as any} ></Detail>}

        </Container>
    );
}
