'use client';

import type { SelectChangeEvent } from '@mui/material';

import React, { useState, useEffect } from 'react';

import { Edit, Email, Person, Settings, AccountCircle } from '@mui/icons-material';
import {
  Box,
  Button,
  Select,
  Divider,
  MenuItem,
  Container,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';

import { useAppDispatch, useAppSelector } from 'src/lib/hooks';
import {
  fetchPersonalization,
  updatePersonalization,
} from 'src/lib/features/personalization/personalization-slice';

import { useAuthContext } from 'src/auth/hooks';

const Page: React.FC = () => {
  const { user } = useAuthContext();
  const dispatch = useAppDispatch();
  const personalizationState = useAppSelector((state) => state.personalization);
  const { personalization, status, error } = personalizationState;

  const [difficulty, setDifficulty] = useState<string>('1');
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    if (user && !personalization) {
      dispatch(fetchPersonalization());
    }
  }, [user, dispatch, personalization]);

  // Update local state when personalization data changes
  useEffect(() => {
    if (personalization) {
      setDifficulty(personalization.difficulty.toString());
      setInstructions(personalization.personal_details || '');
    }
  }, [personalization]);

  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setDifficulty(event.target.value);
  };

  const handleInstructionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInstructions(event.target.value);
  };

  const handleInstructionsSubmit = () => {
    const updatedData = {
      difficulty: parseInt(difficulty, 10),
      personal_details: instructions,
    };
    dispatch(updatePersonalization(updatedData));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Profile
      </Typography>
      <Box mb={2}>
        <Box display="flex" alignItems="center" mb={1}>
          <Person fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="subtitle1">
            Name: {user?.first_name} {user?.last_name}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <Email fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="subtitle1">Email: {user?.email}</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <AccountCircle fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="subtitle1">Username: {user?.username}</Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />

      {status === 'loading' && <CircularProgress />}
      {status === 'failed' && <Typography color="error">Error: {error}</Typography>}
      {status !== 'loading' && (
        <>
          <Typography variant="h6" gutterBottom>
            Difficulty Level
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Each difficulty roughly corresponds with each HSK level (e.g., difficulty 1 is HSK 1).
          </Typography>

          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>Level</InputLabel>
            <Select
              value={difficulty}
              onChange={handleDifficultyChange}
              label="Difficulty Level"
              startAdornment={<Edit fontSize="small" sx={{ color: 'primary.main' }} />}
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <MenuItem key={level} value={level.toString()}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Personalization
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Customize your assistant by adding specific instructions. Mention words, sentence
            structures, interests you want to focus on in conversations, or do prompt injection.
          </Typography>
          <TextField
            label="Custom Instructions"
            multiline
            rows={4}
            fullWidth
            value={instructions}
            onChange={handleInstructionsChange}
            margin="normal"
            variant="outlined"
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Settings />}
            onClick={handleInstructionsSubmit}
            sx={{ mt: 2, mb: 3 }}
          >
            Save Changes
          </Button>
        </>
      )}
    </Container>
  );
};

export default Page;
