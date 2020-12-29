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
  useEffect,
  useState,
} from 'react';
import { pluck } from 'rxjs/operators';
import { STORAGE_KEYS } from '../../constants';
import TodayUsersContextProvider from '../../context/today-users.context';
import { translateString } from '../../filters/translate';
import {
  retrieveUserSettings,
  storeUserSettings,
} from '../../libs/storage/chrome.storage';
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

  const [tabIndex, setTabIndex] = useState<string>('USER_SETTINGS');
  const [loaded, setLoaded] = useState<boolean>(false); // Do not display tabs before all the data been fetched
  const [waiting, setWaiting] = useState<boolean>(false); // Set true while processing

  useEffect(() => {
    retrieveUserSettings([STORAGE_KEYS.LAST_ACTIVE_TAB])
      .pipe(pluck(STORAGE_KEYS.LAST_ACTIVE_TAB))
      .subscribe((storedTabIndex) => {
        setLoaded(true);
        setTabIndex(storedTabIndex);
      });
  });

  const updateTabIndex = (event: React.ChangeEvent<{}>, index: string) => {
    storeUserSettings({[STORAGE_KEYS.LAST_ACTIVE_TAB]: index}, true);
    setTabIndex(index);
  };

  return (
    <TodayUsersContextProvider>
      {loaded &&
      <div className={classes.root}>
        <AppBar position='static'>
          <Tabs value={tabIndex} onChange={updateTabIndex} aria-label='simple tabs example'>
            <Tab value={'TODAY_BIRTHDAY_TITLE'} label={translateString('TODAY_BIRTHDAY_TITLE')}/>
            <Tab value={'USER_SETTINGS'} label={translateString('USER_SETTINGS')}/>
            <Tab value={'TOOLZ'} label='TOOLZ'/>
          </Tabs>
        </AppBar>
        <TabPanel value={tabIndex} index='TODAY_BIRTHDAY_TITLE'>
          <TodayBirthdays/>
          <ToggleShowBadgeButton onWaiting={setWaiting}/>
        </TabPanel>
        <TabPanel value={tabIndex} index='USER_SETTINGS'>
          <SelectAction/>
        </TabPanel>
        <TabPanel value={tabIndex} index='TOOLZ'>
          <Toolz/>
        </TabPanel>
      </div>

// <Tabs
//       className='no-wrap'
//       activeKey={tabIndex}
//       onSelect={updateTabIndex}
//     >
//       <Tab
//         title={translateString('TODAY_BIRTHDAY_TITLE')}
//         eventKey='TODAY_BIRTHDAY_TITLE'
//       >
//         <TodayBirthdays/>
//         <div className='d-flex'>
//           <ToggleShowBadgeButton onWaiting={setWaiting}/>
//         </div>
//       </Tab>
//
//       <Tab
//         title={translateString('USER_SETTINGS')}
//         eventKey='USER_SETTINGS'
//       >
//         {/*<Overlay show={this.waiting}>*/}
//         <SelectAction/>
//         {/*</Overlay>*/}
//       </Tab>
//       <Tab title='TOOLZ' eventKey='TOOLZ'>
//         <Toolz/>
//       </Tab>
//     </Tabs>
      }
    </TodayUsersContextProvider>
  );
};

export default UserSettings;
