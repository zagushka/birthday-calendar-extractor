import React from 'react';
import { Button } from 'react-bootstrap';
import handleLink from '../filters/handleLink';
import { translate } from '../filters/translate';

export default class LeaveFeedbackButton extends React.Component<any, any> {
  render() {
    return <Button
      size='sm'
      className='ml-auto'
      variant='outline-dark'
      onClick={(e) => handleLink(e, 'LEAVE_FEEDBACK_LINK', {close: true, active: true})}
    >
      {translate('LEAVE_FEEDBACK_TITLE')}
    </Button>;
  }
}
