'use client';

import React from 'react';

import { Box, Container, Typography } from '@mui/material';
import { NextButton } from 'src/components/navigation/next-button';

// export const metadata = { title: 'Dashboard - Practice Practical Situations in Chinese' };

const Page: React.FC = () => (
  <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
    {/* Header */}
    <Typography variant="h3" component="h1" gutterBottom>
      Practice Practical Situations in Chinese
    </Typography>

    {/* Sub-header */}
    <Typography variant="h5" color="textSecondary" gutterBottom>
      Improve your conversational skills through real-world situations
    </Typography>

    {/* Main Call-to-Action */}
    {/* <Box mt={4}>
        <Button variant="contained" color="primary" size="large" sx={{ px: 6, py: 2 }}>
          Start Learning
        </Button>
      </Box> */}

    {/* Description */}
    <Box mt={6}>
      <Typography variant="body1" color="textSecondary">
        Explore various scenarios that reflect practical, everyday conversations in Chinese. Dive
        into cultural experiences while enhancing your language skills.
      </Typography>
    </Box>
    <Box sx={{ mt: 3 }}>
      <NextButton />
    </Box>
  </Container>
);

export default Page;
