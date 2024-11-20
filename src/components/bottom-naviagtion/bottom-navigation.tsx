import {
  BottomNavigation,
  BottomNavigationAction,
  makeStyles,
} from '@material-ui/core';
import {
  Build,
  EventNote,
  GetApp,
  Repeat,
} from '@material-ui/icons';
import React, {
  FunctionComponent,
  useContext,
} from 'react';
import { NavLink } from 'react-router-dom';
import {
  isDevelopment,
  isShowTools,
} from '@/constants';
import { CurrentStatusContext } from '@/context/current-status.context';
import { translateString } from '@/filters/translateString';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

export const BottomMenu: FunctionComponent = () => {
  const { isActive } = useContext(CurrentStatusContext);
  const classes = useStyles();

  return (
    <BottomNavigation
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction
        label={translateString('BUTTON_TO_CALENDAR_TITLE')}
        icon={<EventNote />}
        disabled={!isActive}
        component={NavLink}
        className="Mui-selected"
        to="/calendar"
      />

      <BottomNavigationAction
        label={translateString('BUTTON_TO_DOWNLOADS_TITLE')}
        icon={<GetApp />}
        disabled={!isActive}
        component={NavLink}
        className="Mui-selected"
        to="/export"
      />
      <BottomNavigationAction
        label={translateString('BUTTON_TO_SCAN_TITLE')}
        icon={<Repeat />}
        component={NavLink}
        className="Mui-selected"
        to="/activate"
      />
      {isDevelopment && isShowTools && (
      <BottomNavigationAction
        label="Tools"
        icon={<Build />}
        component={NavLink}
        className="Mui-selected"
        to="/dev-tools"
      />
      )}
    </BottomNavigation>
  );
};
