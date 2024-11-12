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

interface Quest {
  title: string;
  description: string;
  adventure: {
    title: string;
    description: string;
  };
  objectives: { id: string; objective: string }[];
}

interface QuestObjectivesProps {
  quest?: Quest | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
}

export function QuestObjectives({ quest, status, error }: QuestObjectivesProps) {
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
