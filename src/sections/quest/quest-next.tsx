import React from 'react';

import { Container } from '@mui/material';

import { NextButton } from 'src/components/navigation/next-button';

export function QuestNext() {
  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <NextButton />
    </Container>
  );
}
