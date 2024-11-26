'use client';

import type { QuestDetailState } from 'src/lib/types';

import React from 'react';

import { Box, Container, Typography, CircularProgress } from '@mui/material';

export function QuestDescription({ quest, status, error }: QuestDetailState) {
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
    <Container maxWidth="lg" sx={{ mt: 3 }}>
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
