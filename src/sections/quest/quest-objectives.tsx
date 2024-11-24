'use client';

import React from 'react';

import {
  Box,
  List,
  ListItem,
  Container,
  Typography,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { QuestDetailState } from 'src/lib/types';

export function QuestObjectives({ quest, status, error }: QuestDetailState) {
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
      <Typography variant="h6" gutterBottom>
        Objectives
      </Typography>
      <List>
        {quest.objectives.map((obj) => (
          <ListItem key={obj.id}>
            <ListItemText primary={obj.objective} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
