import { Button } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import handleLink from '../filters/handleLink';
import { translate } from '../filters/translate';

const LeaveFeedbackButton: FunctionComponent = () => {
  return (
    <Button
      onClick={(e) => handleLink(e, 'LEAVE_FEEDBACK_LINK', {close: true, active: true})}
    >
      {translate('LEAVE_FEEDBACK_TITLE')}
    </Button>
  );
};

export default LeaveFeedbackButton;
