import {
  makeStyles,
  Theme,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import React, {
  FunctionComponent,
  useContext,
} from 'react';

import {
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { LoadingContext } from '../../context/loading.context';
import { TodayUsersContext } from '../../context/today-users.context';
import BirthdaysList from '../birthdays-list/birthdays-list';
import { FirstScan } from '../first-scan';
import './user-serrings.scss';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={index}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

const UserSettings: FunctionComponent = () => {
  const classes = useStyles();
  const {isLoading} = useContext(LoadingContext);
  const {isActive} = useContext(TodayUsersContext);
  const loaded = !isLoading('SETTINGS');

  return (
    <>
      {loaded &&
      <Switch>
        <Route path='/error'>
        </Route>
        <Route path='/activate'>
          {!isActive ? <Redirect to='/'/> : <FirstScan/>}
        </Route>
        <Route path='/'>
          {!isActive ? <BirthdaysList/> : <Redirect to='/activate'/>}
        </Route>
      </Switch>
      }
    </>
  );
};

export default UserSettings;
