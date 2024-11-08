import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { FunctionComponent } from 'react';
import { WIZARD_NAMES } from '../constants';
import { translateString } from '../filters/translateString';

export interface ActionAccordionInterface {
  action: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES];
  currentAction: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES];
  onChange: (action: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES]) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => void;
}

const ActionAccordion: FunctionComponent<ActionAccordionInterface> = (params) => {
  const {
    action, currentAction, onChange, children,
  } = params;
  const isExpanded = action === currentAction;

  return (
    <Accordion expanded={isExpanded} onChange={onChange(action)}>

      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">{translateString(action)}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Box flexDirection="column" display="flex" alignItems="flex-end">
          {children}
        </Box>
      </AccordionDetails>

    </Accordion>
  );
};

export default ActionAccordion;
