import React, { FunctionComponent } from 'react';
import { Button } from 'react-bootstrap';
import handleLink from '../filters/handleLink';
import { translate } from '../filters/translate';

const BuyCoffeeButton: FunctionComponent = () => {
  return <Button
    size='sm'
    variant='outline-dark'
    onClick={(e) => handleLink(e, 'BUY_ME_COFFEE_LINK', {close: true, active: true})}
  >
    {translate('BUY_ME_COFFEE_TITLE')}
  </Button>;
};

export default BuyCoffeeButton;
