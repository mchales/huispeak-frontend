'use client';

import React from 'react';

import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { NextButton } from 'src/components/navigation/next-button';

type Adventure = {
  title: string;
  description: string;
  story: {
    title: string;
    description: string;
  };
};

type Props = {
  status?: 'idle' | 'loading' | 'failed' | 'succeeded';
  error?: string | null;
  adventure?: Adventure | null;
};

export function AdventureStoryDescription({ status, error, adventure }: Props) {
  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!adventure) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        {adventure.story.title}
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        {adventure.story.description}
      </Typography>

      <Typography variant="h5" gutterBottom>
        {adventure.title}
      </Typography>
      <Typography variant="body1" paragraph>
        {adventure.description}
      </Typography>
      <Box display="flex" justifyContent="center" mt={3}>
        <NextButton />
      </Box>
    </Container>
  );
}
