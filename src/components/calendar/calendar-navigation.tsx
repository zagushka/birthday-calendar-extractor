import {
  Box,
  Button,
  Divider,
  IconButton,
} from '@material-ui/core';
import {
  ChevronLeft,
  ChevronRight,
} from '@material-ui/icons';
import React, { FunctionComponent } from 'react';
import { translateString } from '../../filters/translateString';
import BuyCoffeeButton from '../buttons/buy-coffee.button/buy-coffee.button';

interface CalendarNavigationProps {
  updateDayIndex: (delta?: number) => void;
}

export const CalendarNavigation: FunctionComponent<CalendarNavigationProps> = ({updateDayIndex}) => {
  return (
    <React.Fragment>
      <Box p={1} pr={2} display='flex' justifyContent='space-between'>
        <Box>
          <Button size='small' color='primary' onClick={() => updateDayIndex()}>
            {translateString('TODAY')}
          </Button>

          <IconButton size={'small'} onClick={() => updateDayIndex(-1)}>
            <ChevronLeft/>
          </IconButton>

          <IconButton size={'small'} onClick={() => updateDayIndex(1)}>
            <ChevronRight/>
          </IconButton>
        </Box>

        <BuyCoffeeButton variant='outlined' color='secondary' withIcon/>
      </Box>

      <Divider/>
    </React.Fragment>
  );
};
