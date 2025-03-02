import { Button } from "@material-ui/core";
import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CurrentStatusContext } from "@/context/current-status.context";
import Analytics from "@/libs/analytics";
import { SHOW_MODAL_DOWNLOAD_KEYWORD } from "@/libs/events/types";
import { storeUserSettings } from "@/libs/storage/chrome.storage";
import { translateString } from "@/filters/translateString";

interface GenerateAndDownloadButtonProps {
  disabled?: boolean;
  calendarType: string;
  onClick: () => void;
}

const GenerateAndDownloadButton: FunctionComponent<GenerateAndDownloadButtonProps> = (props) => {
  const { onClick, calendarType, disabled = false } = props;
  const location = useLocation();
  const { isDonated, isDonationPageVisited } = useContext(CurrentStatusContext);
  const [onceClicked, setOnceClicked] = useState(false);

  // Listen to the update of the donationPageVisited even,
  // so we know if user successfully entered the keycode
  // handle click if once clicked to proceed and was interrupted by the keyword modal
  useEffect(() => {
    if ((isDonated || isDonationPageVisited) && onceClicked) {
      handleClick();
    }
  }, [isDonated, isDonationPageVisited]);

  const handleClick = async () => {
    // if not donated yet and last time asked for keyword is greater than two weeks
    if (!isDonated && !isDonationPageVisited) {
      setOnceClicked(true);
      await storeUserSettings({ modal: { type: SHOW_MODAL_DOWNLOAD_KEYWORD } });
      // Log the request keyword modal shown
      return Analytics.fireButtonClickEvent("request_keyword", location.pathname, {
        calendar_type: calendarType,
      });
    }

    await Analytics.fireButtonClickEvent("generate_calendar", location.pathname, {
      calendar_type: calendarType,
    });
    onClick();
  };

  return (
    <Button size="small" variant="contained" color="primary" disabled={disabled} onClick={handleClick}>
      {translateString("GENERATE")}
    </Button>
  );
};

export default GenerateAndDownloadButton;
