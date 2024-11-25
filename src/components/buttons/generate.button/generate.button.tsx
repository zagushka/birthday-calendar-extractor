import Analytics from "@/libs/analytics";
import { Button } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { translateString } from '@/filters/translateString';
import { useLocation } from "react-router-dom";

interface GenerateAndDownloadButtonProps {
  disabled?: boolean;
  calendarType: string;
  onClick: () => void;
}

const GenerateAndDownloadButton: FunctionComponent<GenerateAndDownloadButtonProps> = (props) => {
  const { onClick, calendarType, disabled = false } = props;
  const location = useLocation();

  const handleClick = async () => {
    await Analytics.fireButtonClickEvent('generate_calendar', location.pathname, {
      calendar_type: calendarType,
    });
    onClick();
  }

  return (
    <Button
      size="small"
      variant="contained"
      color="primary"
      disabled={disabled}
      onClick={handleClick}
    >
      {translateString('GENERATE')}
    </Button>
  );
};

export default GenerateAndDownloadButton;
