import { Button } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { NavLink } from 'react-router-dom';
import { translateString } from '../../../filters/translateString';
import { handleCloseModal } from '../../modals/modals.lib';

const ToCalendarButton: FunctionComponent = () => (
  <Button
    size="small"
    color="primary"
    variant="contained"
    component={NavLink}
    to="/calendar"
    onClick={handleCloseModal}
  >
    {translateString('TO_CALENDAR_TITLE')}
  </Button>
);

export default ToCalendarButton;
