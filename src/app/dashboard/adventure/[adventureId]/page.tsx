// src/app/adventure/[adventureId]/page.tsx

'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from 'src/lib/hooks';
import { fetchAdventureDetail } from 'src/lib/features/adventure/adventure-slice';
import { RootState } from 'src/lib/types';
import { CircularProgress, Typography, Box } from '@mui/material';

const AdventurePage: React.FC = () => {
  const params = useParams();
  const adventureId = params?.adventureId;

  const dispatch = useAppDispatch();

  const { adventure, status, error } = useAppSelector((state: RootState) => state.adventureDetail);

  useEffect(() => {
    if (adventureId) {
      dispatch(fetchAdventureDetail(Number(adventureId)));
    }
  }, [adventureId, dispatch]);

  if (status === 'loading') {
    return <CircularProgress />;
  }

  if (status === 'failed') {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  if (!adventure) {
    return null;
  }

  return (
    <Box>
      {/* Story Title and Description */}
      <Typography variant="h4">{adventure.story.title}</Typography>
      <Typography variant="body1">{adventure.story.description}</Typography>

      {/* Adventure Title and Description */}
      <Typography variant="h5">{adventure.title}</Typography>
      <Typography variant="body1">{adventure.description}</Typography>
    </Box>
  );
};

export default AdventurePage;
