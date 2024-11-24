import React from 'react';
import { Button, ButtonGroup } from '@mui/material';

interface LevelSelectorProps {
  selectedLevel: number;
  onLevelChange: (level: number) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ selectedLevel, onLevelChange }) => {
  return (
    <ButtonGroup variant="contained" color="primary" aria-label="Level Selector">
      {[1, 2, 3, 4, 5].map((level) => (
        <Button
          key={level}
          variant={selectedLevel === level ? 'contained' : 'outlined'}
          onClick={() => onLevelChange(level)}
        >
          Level {level}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default LevelSelector;
