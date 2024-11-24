// Import necessary modules and components
import { Container, Grid, Typography, Button, Box } from '@mui/material';
import { Hearing, RecordVoiceOver, Chat } from '@mui/icons-material';
import Link from '@mui/material/Link';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

export function HomeView() {
  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      {/* Hero Section */}
      <Box textAlign="center" mb={8}>
        <Typography variant="h2" component="h1" gutterBottom>
          Practice Spoken Chinese with Our AI-Powered Platform
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Immerse yourself in practical situations, role-playing, and cultural experiences.
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
              Improve your pronunciation and fluency with real-time feedback.
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
              Understand native speakers through interactive exercises.
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
              Engage in dialogues that mimic real-life scenarios.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
