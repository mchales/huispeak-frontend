'use client';

import React from 'react';

import { Box, Container, Typography } from '@mui/material';

import { NextButton } from 'src/components/navigation/next-button';

// export const metadata = { title: 'Dashboard - Practice Practical Situations in Chinese' };

const Page: React.FC = () => (
  <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
    {/* Header */}
    <Typography variant="h3" component="h1" gutterBottom>
      Embark on a Journey to the West: Practice Practical Situations in Chinese
    </Typography>

    {/* Sub-header */}
    <Typography variant="h5" color="textSecondary" gutterBottom>
      Improve your conversational skills through real-world scenarios intertwined with an epic story
    </Typography>

    {/* Description */}
    <Box mt={6}>
      <Typography variant="body1" color="textSecondary">
        Join the legendary *Journey to the West* and practice Chinese through practical, everyday
        conversations woven into the storyline. Each scenario reflects real-life situations while
        immersing you in cultural experiences, making your learning engaging and relevant.
      </Typography>
    </Box>
    <Box sx={{ mt: 3 }}>
      <NextButton />
    </Box>
  </Container>
);

export default Page;
