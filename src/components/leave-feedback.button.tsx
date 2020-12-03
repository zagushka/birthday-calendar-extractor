import React from 'react';
import { Button } from 'react-bootstrap';
import translate from '../filters/translate';

export default class LeaveFeedbackButton extends React.Component<any, any> {
  render() {
    return <Button
      size='sm'
      className='ml-auto'
      variant='outline-dark'
      // v-link.close.active=''LEAVE_FEEDBACK_LINK''
    >
      {translate('LEAVE_FEEDBACK_TITLE')}
    </Button>;
  }
}
