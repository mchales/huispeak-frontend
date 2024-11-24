import React from 'react';
import { Slider, Typography, Box } from '@mui/material';

interface SpeedSelectorProps {
  selectedSpeed: number;
  onSpeedChange: (speed: number) => void;
}

const SpeedSelector: React.FC<SpeedSelectorProps> = ({ selectedSpeed, onSpeedChange }) => {
  const handleSpeedChange = (event: Event, newValue: number | number[]) => {
    onSpeedChange(newValue as number);
  };

  return (
    <Box width={200} px={2}>
      <Typography gutterBottom>Speed: {selectedSpeed.toFixed(2)}x</Typography>
      <Slider
        value={selectedSpeed}
        min={0.25}
        max={2.0}
        step={0.05}
        onChange={handleSpeedChange}
        aria-labelledby="speed-selector"
      />
    </Box>
  );
};

export default SpeedSelector;
