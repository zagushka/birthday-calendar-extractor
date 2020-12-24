import React, { FunctionComponent } from 'react';
import { Button } from 'react-bootstrap';
import handleLink from '../filters/handleLink';
import { translate } from '../filters/translate';

const LeaveFeedbackButton: FunctionComponent = () => {
  return <Button
    size='sm'
    className='ml-auto'
    variant='outline-dark'
    onClick={(e) => handleLink(e, 'LEAVE_FEEDBACK_LINK', {close: true, active: true})}
  >
    {translate('LEAVE_FEEDBACK_TITLE')}
  </Button>;
};


export default LeaveFeedbackButton;
