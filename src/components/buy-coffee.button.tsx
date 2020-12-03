import React from 'react';
import { Button } from 'react-bootstrap';
import translateFilter from '../filters/translate';

export default class BuyCoffeeButton extends React.Component<any, any> {
  render() {
    return <Button
      size='sm'
      variant='outline-dark'
      // v-link.close.active=''BUY_ME_COFFEE_LINK''
    >
      {translateFilter('BUY_ME_COFFEE_TITLE')}
    </Button>;
  }
}
