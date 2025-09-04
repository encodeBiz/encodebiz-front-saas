'use client';
import { Container } from '@mui/material';
import PageLoader from '@/components/common/PageLoader';

export default function Dashboard() {
  return (
    <Container maxWidth="xl">
       <PageLoader backdrop />
    </Container>
  );
}
