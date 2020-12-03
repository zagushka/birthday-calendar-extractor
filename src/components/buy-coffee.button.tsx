import React from 'react';
import { Button } from 'react-bootstrap';
import translate from '../filters/translate';

export default class BuyCoffeeButton extends React.Component<any, any> {
  render() {
    return <Button
      size='sm'
      variant='outline-dark'
      // v-link.close.active=''BUY_ME_COFFEE_LINK''
    >
      {translate('BUY_ME_COFFEE_TITLE')}
    </Button>;
  }
}
