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
import React, { FunctionComponent } from 'react';
import { ACTIONS_SET } from '../constants';
import { translateString } from '../filters/translate';

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


interface ActionAccordionInterface {
  action: ACTIONS_SET;
  currentAction: ACTIONS_SET;
  onChange: (action: ACTIONS_SET) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => void;
}

const ActionAccordion: FunctionComponent<ActionAccordionInterface> = (params) => {
  const classes = useStyles();

  const action = params.action;
  const currentAction = params.currentAction;
  const onChange = params.onChange;

  const isExpanded = action === currentAction;


  return (
    <Accordion expanded={isExpanded}
               onChange={onChange(action)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon/>}
      >
        <Typography className={classes.heading}>{translateString(action)}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          {params.children}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default ActionAccordion;
