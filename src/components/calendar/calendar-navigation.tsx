import { Box, Button, Divider, IconButton } from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import React, { FunctionComponent, MouseEventHandler, useCallback, useContext } from "react";
import { CurrentStatusContext } from "@/context/current-status.context";
import { translateString } from "@/filters/translateString";
import { useTapsCounter } from "@/libs/hooks/tap-counter.hook";
import { storeUserSettings } from "@/libs/storage/chrome.storage";
import BuyCoffeeButton from "@/components/buttons/buy-coffee.button/buy-coffee.button";

interface CalendarNavigationProps {
  updateDayIndex: (delta?: number) => void;
}

export const CalendarNavigation: FunctionComponent<CalendarNavigationProps> = ({ updateDayIndex }) => {
  const { isDonated } = useContext(CurrentStatusContext);

  const hideButton = useCallback(() => {
    storeUserSettings({ donated: !isDonated });
  }, [isDonated]);

  const multipleClicksHandler = useTapsCounter(5, 1000, hideButton);

  const handleClickOnToday: MouseEventHandler = () => {
    multipleClicksHandler();
    updateDayIndex();
  };

  return (
    <>
      <Box p={1} pr={2} display="flex" justifyContent="space-between">
        <Box>
          <Button size="small" color="primary" onClick={handleClickOnToday}>
            {translateString("TODAY")}
          </Button>

          <IconButton size="small" onClick={() => updateDayIndex(-1)}>
            <ChevronLeft />
          </IconButton>

          <IconButton size="small" onClick={() => updateDayIndex(1)}>
            <ChevronRight />
          </IconButton>
        </Box>

        <BuyCoffeeButton buttonLocation="calendar-navigation" variant="outlined" color="secondary" withIcon />
      </Box>

      <Divider />
    </>
  );
};
