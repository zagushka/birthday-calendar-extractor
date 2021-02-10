import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { FunctionComponent } from 'react';
import { WIZARD_NAMES } from '../constants';
import { translateString } from '../filters/translateString';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }),
);

export interface ActionAccordionInterface {
  action: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES];
  currentAction: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES];
  onChange: (action: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES]) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => void;
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
        <Box>
          {params.children}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ActionAccordion;
