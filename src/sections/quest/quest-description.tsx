// src/components/quest-description.tsx

'use client';

import React from 'react';

import { Box, Container, Typography, CircularProgress } from '@mui/material';

interface Quest {
  title: string;
  description: string;
  adventure: {
    title: string;
    description: string;
  };
}

interface QuestDescriptionProps {
  quest?: Quest | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
}

export function QuestDescription({ quest, status, error }: QuestDescriptionProps) {
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

  if (!quest) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        {quest.adventure.title}
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        {quest.adventure.description}
      </Typography>

      <Typography variant="h5" gutterBottom>
        {quest.title}
      </Typography>
      <Typography variant="body1" paragraph>
        {quest.description}
      </Typography>
    </Container>
  );
}
