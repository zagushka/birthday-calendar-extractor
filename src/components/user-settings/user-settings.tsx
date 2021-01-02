import {
  AppBar,
  makeStyles,
  Tab,
  Tabs,
  Theme,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import React, {
  FunctionComponent,
  useContext,
  useState,
} from 'react';
import { TABS } from '../../constants';
import { SettingsContext } from '../../context/settings.context';
import TodayUsersContextProvider from '../../context/today-users.context';
import { translateString } from '../../filters/translate';
import SelectAction from '../select-action';
import TodayBirthdays from '../today-bdays';
import ToggleShowBadgeButton from '../toggle-show-badge.button';
import Toolz from '../toolz';
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
        <Box py={1} px={1}>
          {children}
        </Box>
      )}
    </div>
  );
}

const UserSettings: FunctionComponent = () => {
  const classes = useStyles();

  const {tab, setTab} = useContext(SettingsContext);
  const [loaded, setLoaded] = useState<boolean>(true); // Do not display tabs before all the data been fetched
  const [waiting, setWaiting] = useState<boolean>(false); // Set true while processing

  const updateTabIndex = (event: React.ChangeEvent<{}>, index: TABS) => setTab(index);

  return (
    <TodayUsersContextProvider>
      {loaded &&
      <div className={classes.root}>
        <AppBar position='static'>
          <Tabs value={tab} onChange={updateTabIndex} aria-label='simple tabs example'>
            <Tab value={TABS.TODAY_BIRTHDAYS} label={translateString('TODAY_BIRTHDAY_TITLE')}/>
            <Tab value={TABS.CALENDAR_GENERATOR} label={translateString('USER_SETTINGS')}/>
            <Tab value={TABS.DEBUG_TOOLS} label='TOOLZ'/>
          </Tabs>
        </AppBar>
        <TabPanel value={tab} index={TABS.TODAY_BIRTHDAYS}>
          <TodayBirthdays/>
          <ToggleShowBadgeButton onWaiting={setWaiting}/>
        </TabPanel>
        <TabPanel value={tab} index={TABS.CALENDAR_GENERATOR}>
          <SelectAction/>
        </TabPanel>
        <TabPanel value={tab} index={TABS.DEBUG_TOOLS}>
          <Toolz/>
        </TabPanel>
      </div>
      }
    </TodayUsersContextProvider>
  );
};

export default UserSettings;
