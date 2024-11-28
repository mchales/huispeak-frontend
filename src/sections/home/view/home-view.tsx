// Import necessary modules and components
import Link from '@mui/material/Link';
import { Chat, Hearing, RecordVoiceOver } from '@mui/icons-material';
import { Box, Grid, Button, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

export function HomeView() {
  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      {/* Hero Section */}
      <Box textAlign="center" mt={10} mb={8}>
        <Typography variant="h2" component="h1" gutterBottom>
          Practice Spoken Chinese with HuiSpeak
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Embark on a *Journey to the West* and master Chinese through interactive role-playing and
          cultural experiences.
        </Typography>

        <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
          <Button variant="contained" color="primary" size="large">
            Get Started
          </Button>
        </Link>
      </Box>

      {/* Features Section */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box textAlign="center">
            <RecordVoiceOver fontSize="large" color="primary" />
            <Typography variant="h6" component="h3" gutterBottom>
              Practice Speaking
            </Typography>
            <Typography color="textSecondary">
              Take on the role of a character in the legendary journey, improving your pronunciation
              and fluency as you navigate conversations in the story.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box textAlign="center">
            <Hearing fontSize="large" color="primary" />
            <Typography variant="h6" component="h3" gutterBottom>
              Enhance Listening
            </Typography>
            <Typography color="textSecondary">
              Follow the story&apos;s exciting adventures while honing your ability to understand
              spoken Chinese in diverse contexts.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box textAlign="center">
            <Chat fontSize="large" color="primary" />
            <Typography variant="h6" component="h3" gutterBottom>
              Realistic Conversations
            </Typography>
            <Typography color="textSecondary">
              Practice cultural and practical situations while interacting with characters and
              tackling challenges.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
