import { Button } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import handleLink from '../../../filters/handleLink';
import { translateString } from '../../../filters/translateString';

const BuyCoffeeButton: FunctionComponent = () => {
  return (
    <Button
      onClick={() => handleLink('BUY_ME_COFFEE_LINK', {close: true, active: true})}
    >
      {translateString('BUY_ME_COFFEE_TITLE')}
    </Button>
  );
};

export default BuyCoffeeButton;
