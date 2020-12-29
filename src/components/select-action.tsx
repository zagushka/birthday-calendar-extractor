import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, {
  FunctionComponent,
  useEffect,
  useState,
} from 'react';

import { pluck } from 'rxjs/operators';
import {
  ACTIONS_SET,
  STORAGE_KEYS,
} from '../constants';
import {
  translate,
  translateString,
} from '../filters/translate';
import { StartGenerationAction } from '../libs/events/actions';
import { sendMessage } from '../libs/events/events';
import {
  retrieveUserSettings,
  storeUserSettings,
} from '../libs/storage/chrome.storage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }),
);

const SelectAction: FunctionComponent = () => {

  const [isWaiting, setIsWaiting] = useState<boolean>(true);
  const [selectedAction, setSelectedAction] = useState<ACTIONS_SET>(ACTIONS_SET.SELECT_FILE_FORMAT_CSV);

  const classes = useStyles();

  const setAction = (action: ACTIONS_SET) => {
    storeUserSettings({[STORAGE_KEYS.LAST_SELECTED_ACTION]: action}, true);
    setSelectedAction(action);
  };

  const startGeneration = () => {
    sendMessage(new StartGenerationAction(selectedAction))
      .subscribe(() => setIsWaiting(false));
    setIsWaiting(true);
  };

  useEffect(() => {
    retrieveUserSettings([STORAGE_KEYS.LAST_SELECTED_ACTION])
      .pipe(
        pluck(STORAGE_KEYS.LAST_SELECTED_ACTION),
      )
      .subscribe((a) => {
        setIsWaiting(false);
        setSelectedAction(a);
      });
  }, []);

  return (
    <>

      {/*<Tab.Container*/}
      {/*  activeKey={selectedAction}*/}
      {/*  onSelect={(e) => setAction(e as ACTIONS_SET)}*/}
      {/*>*/}

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography className={classes.heading}>{translateString(ACTIONS_SET.ENABLE_BADGE)}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Hi
            {/*<div className='d-flex flex-grow-1 border'>*/}
            {/*        <ResponsiveEmbed*/}
            {/*          autoplay loop*/}
            {/*          type='video' aspect='4by3'>*/}
            {/*          <source src='/media/badge.mp4' type='video/mp4'>*/}
            {/*        </ResponsiveEmbed>*/}
            {/*</div>*/}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography className={classes.heading}>{translateString(ACTIONS_SET.SELECT_FILE_FORMAT_ICS)}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {translate('SELECT_ICS_DESCRIPTION')}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography className={classes.heading}>{translateString(ACTIONS_SET.SELECT_FILE_FORMAT_DELETE_ICS)}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {translate('SELECT_DELETE_ICS_DESCRIPTION')}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography className={classes.heading}>{translateString(ACTIONS_SET.SELECT_FILE_FORMAT_CSV)}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {translate('FILE_FORMAT_CSV_DESCRIPTION')}
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/*<div className='d-flex align-items-start flex-shrink-0 flex-column ml-auto'>*/}
      {/*  <div className='d-flex flex-nowrap mt-auto align-self-end'>*/}
      {/*    <Button size='sm'*/}
      {/*            variant='outline-success'*/}
      {/*            onClick={startGeneration}>*/}
      {/*      {translate('GENERATE')}*/}
      {/*    </Button>*/}
      {/*    {' '}*/}
      {/*    <LeaveFeedbackButton/>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </>
  );
};

export default SelectAction;
