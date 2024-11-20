import { Button } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { translateString } from '@/filters/translateString';

interface GenerateAndDownloadButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

const GenerateAndDownloadButton: FunctionComponent<GenerateAndDownloadButtonProps> = (props) => {
  const { onClick, disabled = false } = props;
  return (
    <Button
      size="small"
      variant="contained"
      color="primary"
      disabled={disabled}
      onClick={onClick}
    >
      {translateString('GENERATE')}
    </Button>
  );
};

export default GenerateAndDownloadButton;
